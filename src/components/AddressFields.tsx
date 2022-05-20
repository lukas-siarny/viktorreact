/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, ReactElement } from 'react'
import { InjectedFormProps, WrappedFieldProps } from 'redux-form'
import { Col, Row } from 'antd'
import cx from 'classnames'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import Geocode from 'react-geocode'

// components
import MapContainer from './MapContainer'

// utils
import { GOOGLE_MAPS_API_KEY, MAP, ROW_GUTTER_X_M } from '../utils/enums'
import { getGoogleMapUrl, getCurrentLanguageCode, parseAddressComponents } from '../utils/helper'

// atoms
import LocationSearchInputField from '../atoms/LocationSearchInputField'

function getLabelField(label: string): ReactElement<any> {
	return (
		<div className='ant-col ant-form-item-label'>
			<label title={label}>{label}</label>
		</div>
	)
}

/**
 * Define in props only variables required for form
 */
export type AddressInputFields = {
	latitude: number
	longitude: number
	city?: string
	street?: string
	zipCode?: string
	country?: string
	address?: string
}

type LocationSearchElements = {
	loadingElement: ReactElement<any>
	containerElement: ReactElement<any>
}

type MapContainerElements = {
	mapElement: ReactElement<any>
} & LocationSearchElements

type Props = WrappedFieldProps & {
	inputValues: AddressInputFields
	changeFormFieldValue: InjectedFormProps['change']
	zoom?: number
	locationSearchElements?: LocationSearchElements
	mapContainerElements?: MapContainerElements
	disabled?: boolean
}

const FULL_H_ELEMENT = <div className='h-full' />

const AddressFields = (props: Props) => {
	const {
		changeFormFieldValue,
		inputValues,
		zoom = MAP.defaultZoom,
		input,
		meta: { error, touched },
		locationSearchElements = {
			loadingElement: FULL_H_ELEMENT,
			containerElement: <div />
		},
		mapContainerElements = {
			loadingElement: FULL_H_ELEMENT,
			mapElement: FULL_H_ELEMENT,
			containerElement: <div className='h-96' />
		},
		disabled
	} = props
	const { t } = useTranslation()

	const [googleMapUrl, setGoogleMapUrl] = useState<string | undefined>(undefined)

	useEffect(() => {
		// init react-google-maps
		setGoogleMapUrl(getGoogleMapUrl())
		// init react-geocode
		Geocode.setApiKey(GOOGLE_MAPS_API_KEY)
		Geocode.setLanguage(getCurrentLanguageCode())
	}, [])

	const parseAddressObject = (addressComponents: any[]) => {
		const address = parseAddressComponents(addressComponents)

		const { streetNumber, houseNumber } = address

		changeFormFieldValue('city', address.city)
		changeFormFieldValue('country', address.country)
		changeFormFieldValue('zipCode', address.zip)

		if (streetNumber) {
			changeFormFieldValue('street', `${address.street} ${streetNumber}`)
		} else if (houseNumber) {
			changeFormFieldValue('street', `${address.city} ${houseNumber}`)
		} else {
			changeFormFieldValue('street', address.street)
		}

		input.onChange(true)
	}

	const selectLocation = (place: any) => {
		parseAddressObject(place.address_components)
		changeFormFieldValue('latitude', parseFloat(place.location.lat().toFixed(8)))
		changeFormFieldValue('longitude', parseFloat(place.location.lng().toFixed(8)))
	}

	const changeLocation = (event: any) => {
		const lat = event.latLng.lat().toFixed(8)
		const lng = event.latLng.lng().toFixed(8)

		changeFormFieldValue('latitude', parseFloat(lat))
		changeFormFieldValue('longitude', parseFloat(lng))

		// reverse geocoding
		Geocode.fromLatLng(lat, lng).then(
			(response: any) => parseAddressObject(response.results[0].address_components),
			(e: any) => {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		)
	}

	return (
		<>
			{googleMapUrl && (
				<>
					<Row>
						<Col span={24}>
							<LocationSearchInputField
								googleMapURL={googleMapUrl}
								loadingElement={locationSearchElements.loadingElement}
								containerElement={locationSearchElements.containerElement}
								label={t('loc:Vyhľadať')}
								onPlaceSelected={selectLocation}
								type='search'
								placeholder={t('loc:Vyhľadajte miesto na mape')}
								error={error && touched}
								disabled={disabled}
							/>
							<div className={cx('text-danger h-6', { hidden: !(error && touched) })}>{error}</div>
						</Col>
					</Row>
					<Row gutter={ROW_GUTTER_X_M} justify={'space-around'} className={'mb-6'}>
						<Col xl={18} md={15}>
							<MapContainer
								googleMapURL={googleMapUrl}
								containerElement={mapContainerElements.containerElement}
								mapElement={mapContainerElements.mapElement}
								loadingElement={mapContainerElements.loadingElement}
								onLocationChange={changeLocation}
								lat={get(inputValues, 'latitude')}
								long={get(inputValues, 'longitude')}
								zoom={zoom}
								disabled={disabled}
							/>
						</Col>
						<Col xl={6} md={9}>
							{/* Display only fields defined in inputValues */}
							{'city' in inputValues && (
								<div>
									{getLabelField(t('loc:Mesto'))}
									<h4>{get(inputValues, 'city')}</h4>
								</div>
							)}
							{'street' in inputValues && (
								<div>
									{getLabelField(t('loc:Ulica'))}
									<h4>{get(inputValues, 'street')}</h4>
								</div>
							)}
							{'zipCode' in inputValues && (
								<div>
									{getLabelField(t('loc:PSČ'))}
									<h4>{get(inputValues, 'zipCode')}</h4>
								</div>
							)}
							{'country' in inputValues && (
								<div>
									{getLabelField(t('loc:Krajina'))}
									<h4>{get(inputValues, 'country')}</h4>
								</div>
							)}
						</Col>
					</Row>
				</>
			)}
		</>
	)
}

export default AddressFields
