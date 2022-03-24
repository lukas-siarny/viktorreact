import React, { useEffect, useState, ReactElement } from 'react'
import { Field, InjectedFormProps } from 'redux-form'
import { Col, Divider, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import Geocode from 'react-geocode'

// components
import MapContainer from './MapContainer'

// utils
import { GOOGLE_MAPS_API_KEY, MAP, ROW_GUTTER_X_DEFAULT } from '../utils/enums'
import { getGoogleMapUrl, getCurrentLanguageCode, parseAddressComponents } from '../utils/helper'

// atoms
import LocationSearchInputField from '../atoms/LocationSearchInputField'
import InputField from '../atoms/InputField'

type LocationSearchElements = {
	loadingElement: ReactElement<any>
	containerElement: ReactElement<any>
}

type MapContainerElements = {
	mapElement: ReactElement<any>
} & LocationSearchElements

type Props = {
	latitude: number
	longtitude: number
	changeFormFieldValue: InjectedFormProps['change']
	zoom?: number
	locationSearchElements?: LocationSearchElements
	mapContainerElements?: MapContainerElements
}

const FULL_H_ELEMENT = <div style={{ height: '100%' }} />

const AddressFields = (props: Props) => {
	const {
		changeFormFieldValue,
		latitude,
		longtitude,
		zoom = MAP.defaultZoom,
		locationSearchElements = {
			loadingElement: FULL_H_ELEMENT,
			containerElement: <div />
		},
		mapContainerElements = {
			loadingElement: FULL_H_ELEMENT,
			mapElement: FULL_H_ELEMENT,
			containerElement: <div style={{ height: '660px' }} />
		}
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

		changeFormFieldValue('city', address.city)
		changeFormFieldValue('street', `${address.street} ${address.streetNumber}`)
		changeFormFieldValue('country', address.country)
	}

	const selectLocation = (place: any) => {
		parseAddressObject(place.address_components)
		changeFormFieldValue('latitude', parseFloat(place.location.lat().toFixed(8)))
		changeFormFieldValue('longitude', parseFloat(place.location.lng().toFixed(8)))
	}

	const changeLocation = (e: any) => {
		const lat = e.latLng.lat().toFixed(8)
		const lng = e.latLng.lng().toFixed(8)

		changeFormFieldValue('latitude', parseFloat(lat))
		changeFormFieldValue('longitude', parseFloat(lng))

		// reverse geocoding
		Geocode.fromLatLng(lat, lng).then(
			(response: any) => parseAddressObject(response.results[0].address_components),
			(error: any) => {
				// eslint-disable-next-line no-console
				console.error(error)
			}
		)
	}

	return (
		<>
			{googleMapUrl && (
				<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'space-around'}>
					<Col xl={6} md={9}>
						<LocationSearchInputField
							googleMapURL={googleMapUrl}
							loadingElement={locationSearchElements.loadingElement}
							containerElement={locationSearchElements.containerElement}
							label={t('loc:Vyhľadať')}
							onPlaceSelected={selectLocation}
							placeholder={t('loc:Vyhľadajte miesto na mape')}
						/>
						<Divider type={'horizontal'} style={{ width: '100%' }} />
						<Field component={InputField} label={t('loc:Mesto')} name={'city'} size={'large'} />
						<Field component={InputField} label={t('loc:Ulica')} name={'street'} size={'large'} />
						<Field component={InputField} label={t('loc:PSČ')} name={'postalCode'} size={'large'} />
						<Field component={InputField} label={t('loc:Krajina')} name={'country'} size={'large'} />
					</Col>
					<Col xl={1} className={'flex-center'}>
						<Divider type={'vertical'} style={{ height: '100%' }} />
					</Col>
					<Col xl={17} md={14}>
						<MapContainer
							googleMapURL={googleMapUrl}
							containerElement={mapContainerElements.containerElement}
							mapElement={mapContainerElements.mapElement}
							loadingElement={mapContainerElements.loadingElement}
							onLocationChange={changeLocation}
							lat={latitude}
							long={longtitude}
							zoom={zoom}
						/>
					</Col>
				</Row>
			)}
		</>
	)
}

export default AddressFields
