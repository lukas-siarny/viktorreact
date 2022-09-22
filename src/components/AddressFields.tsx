/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, ReactElement } from 'react'
import { Field, InjectedFormProps, WrappedFieldProps } from 'redux-form'
import { Alert, Col, Row } from 'antd'
import cx from 'classnames'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'

// components
import i18next from 'i18next'
import { useSelector } from 'react-redux'
import MapContainer from './MapContainer'

// utils
import { ENUMERATIONS_KEYS, MAP } from '../utils/enums'
import {
	getGoogleMapUrl,
	parseAddressComponents,
	validationRequired,
	optionRenderWithImage,
	validationRequiredNumber,
	validationNumberMin,
	validationNumberMax
} from '../utils/helper'

// atoms
import LocationSearchInputField from '../atoms/LocationSearchInputField'
import InputField from '../atoms/InputField'
import SelectField from '../atoms/SelectField'
import InputNumberField from '../atoms/InputNumberField'

// redux
import { RootState } from '../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../assets/icons/globe-24.svg'

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

const numberMinLongitude = validationNumberMin(MAP.minLongitude)
const numberMaxLongitude = validationNumberMax(MAP.maxLongitude)
const numberMinLatitude = validationNumberMin(MAP.minLatitude)
const numberMaxLatitude = validationNumberMax(MAP.maxLatitude)

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
	const [mapError, setMapError] = useState<boolean>(false)

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	useEffect(() => {
		// init react-google-maps
		setGoogleMapUrl(getGoogleMapUrl())
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
		if (place.location) {
			changeFormFieldValue('latitude', parseFloat(place.location.lat().toFixed(8)))
			changeFormFieldValue('longitude', parseFloat(place.location.lng().toFixed(8)))
		}
	}

	const changeLocation = async (event: any) => {
		const lat = parseFloat(event.latLng.lat().toFixed(8))
		const lng = parseFloat(event.latLng.lng().toFixed(8))

		changeFormFieldValue('latitude', lat)
		changeFormFieldValue('longitude', lng)

		// reverse geocoding
		try {
			const windowObj = window as any
			if (windowObj.google?.maps) {
				const geocoder = new windowObj.google.maps.Geocoder()
				const response = await geocoder.geocode({
					location: {
						lat,
						lng
					}
				})

				if (response) {
					parseAddressObject(response.results[0].address_components)
					setMapError(false)
				} else {
					setMapError(true)
				}
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
			setMapError(true)
		}
	}

	return (
		<>
			{googleMapUrl && (
				<>
					<Row className={'mb-4 gap-4'} wrap={false}>
						{mapError ? (
							<Row className={'w-full h-full block'} justify='center'>
								<Alert message={t('loc:Google mapa je aktuálne nedostupná.')} showIcon type={'warning'} className={'noti-alert mb-4'} />
								<Row justify={'space-between'}>
									<Field
										className={'w-4/5'}
										component={InputField}
										label={t('loc:Ulica')}
										placeholder={t('loc:Zadajte ulicu')}
										name={'street'}
										size={'large'}
										validate={validationRequired}
										required
									/>
									<Field
										className={'w-1/6'}
										component={InputField}
										label={t('loc:Popisné číslo')}
										placeholder={t('loc:Zadajte číslo')}
										name={'streetNumber'}
										size={'large'}
										validate={validationRequired}
										required
									/>
								</Row>
								<Row justify={'space-between'}>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:Mesto')}
										placeholder={t('loc:Zadajte mesto')}
										name={'city'}
										size={'large'}
										validate={validationRequired}
										required
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:PSČ')}
										placeholder={t('loc:Zadajte smerovacie číslo')}
										name={'zipCode'}
										size={'large'}
										validate={validationRequired}
										required
									/>
								</Row>
								<Row justify={'space-between'}>
									<Field
										className={'w-1/4'}
										component={SelectField}
										optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
										label={t('loc:Štát')}
										placeholder={t('loc:Vyber krajinu')}
										options={countries?.enumerationsOptions || []}
										name={'country'}
										size={'large'}
										loading={countries?.isLoading}
										validate={validationRequired}
										required
									/>
									<Field
										className={'w-1/3'}
										component={InputNumberField}
										label={t('loc:Zem. dĺžka')}
										placeholder={t('loc:Zem. dĺžka v rozsahu od -180 do 180')}
										name='longitude'
										size={'large'}
										required
										maxChars={10}
										validate={[validationRequiredNumber, numberMinLongitude, numberMaxLongitude]}
									/>
									<Field
										className={'w-1/3'}
										component={InputNumberField}
										label={t('loc:Zem. šírka')}
										placeholder={t('loc:Zem. šírka v rozsahu od -90 do 90')}
										name='latitude'
										size={'large'}
										required
										maxChars={10}
										validate={[validationRequiredNumber, numberMinLatitude, numberMaxLatitude]}
									/>
								</Row>
								<Field
									component={SelectField}
									optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
									label={t('loc:Štát')}
									placeholder={t('loc:Vyber krajinu')}
									options={countries?.enumerationsOptions || []}
									name={'country'}
									size={'large'}
									loading={countries?.isLoading}
									validate={validationRequired}
									required
								/>
							</Row>
						) : (
							<>
								<div className={'mb-7 flex-1 w-1/2 xl:w-full'}>
									<Row>
										<Col span={24} className={'mb-7'}>
											<LocationSearchInputField
												googleMapURL={googleMapUrl}
												loadingElement={locationSearchElements.loadingElement}
												containerElement={locationSearchElements.containerElement}
												label={t('loc:Vyhľadať')}
												required
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
										onError={() => setMapError(true)}
										googleMapURL={googleMapUrl}
										containerElement={mapContainerElements.containerElement}
										mapElement={mapContainerElements.mapElement}
										loadingElement={mapContainerElements.loadingElement}
										onLocationChange={changeLocation}
										lat={get(inputValues, 'latitude')}
										long={get(inputValues, 'longitude')}
										disabled={disabled}
									/>
								</div>
							</>
						)}
					</Row>
				</>
			)}
		</>
	)
}

export default AddressFields
