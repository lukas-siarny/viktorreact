/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, ReactElement } from 'react'
import { InjectedFormProps, WrappedFieldProps } from 'redux-form'
import { Col, Row } from 'antd'
import cx from 'classnames'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import Geocode from 'react-geocode'

// components
import i18next from 'i18next'
import MapContainer from './MapContainer'

// utils
import { GOOGLE_MAPS_API_KEY, MAP } from '../utils/enums'
import { getGoogleMapUrl, getCurrentLanguageCode, parseAddressComponents } from '../utils/helper'

// atoms
import LocationSearchInputField from '../atoms/LocationSearchInputField'

/**
 * Define in props only variables required for form
 */
export type AddressInputFields = {
	latitude: number
	longitude: number
	city?: string
	street?: string
	streetNumber?: string
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

export interface IAddressValues {
	street?: string
	streetNumber?: string
	city?: string
	country?: string
	zipCode?: string
}

export const AddressLayout = (values?: IAddressValues, className?: string) => {
	const street = values?.street
	const streetNumber = values?.streetNumber
	const city = values?.city
	const zipCode = values?.zipCode
	const country = values?.country

	const isEmpty = !street && !streetNumber && !city && !zipCode && !country

	return (
		<Row className={cx('address-field-address gap-2 items-start', className)} wrap={false}>
			<Col className={'flex flex-col gap-1 text-base'}>
				{isEmpty ? (
					<i>{i18next.t('loc:Vyhľadajte adresu na mape alebo vo vyhľadávači')}</i>
				) : (
					<>
						{street || streetNumber ? (
							<span>
								{street} {streetNumber}
							</span>
						) : null}
						{zipCode || city ? (
							<span>
								{zipCode} {city}
							</span>
						) : null}
						{country}
					</>
				)}
			</Col>
		</Row>
	)
}

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
			containerElement: <div className='h-56 lg:h-72' />
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
			changeFormFieldValue('streetNumber', streetNumber)
			changeFormFieldValue('street', address.street)
		} else if (houseNumber) {
			changeFormFieldValue('streetNumber', houseNumber)
			changeFormFieldValue('street', address.city)
		} else {
			changeFormFieldValue('streetNumber', '')
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
					<Row className={'mb-4 gap-4'} wrap={false}>
						<div className={'mb-7 flex-1 w-1/2 xl:w-full'}>
							<Row>
								<Col span={24} className={'mb-7'}>
									<LocationSearchInputField
										googleMapURL={googleMapUrl}
										loadingElement={locationSearchElements.loadingElement}
										containerElement={locationSearchElements.containerElement}
										label={t('loc:Vyhľadať')}
										onPlaceSelected={selectLocation}
										type='search'
										placeholder={t('loc:Vyhľadajte miesto na mape')}
										className={'mb-0'}
										error={error && touched}
										disabled={disabled}
									/>
									<div className={cx('text-danger', { hidden: !(error && touched) })}>{error}</div>
								</Col>
							</Row>
							{AddressLayout({
								street: get(inputValues, 'street'),
								streetNumber: get(inputValues, 'streetNumber'),
								city: get(inputValues, 'city'),
								zipCode: get(inputValues, 'zipCode'),
								country: get(inputValues, 'country')
							})}
						</div>
						<div className={'mt-6 w-1/2 xl:w-2/3 max-w-3xl'}>
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
						</div>
					</Row>
				</>
			)}
		</>
	)
}

export default AddressFields
