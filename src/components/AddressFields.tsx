/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, ReactElement } from 'react'
import { Field, InjectedFormProps, WrappedFieldProps } from 'redux-form'
import { Alert, Col, Row } from 'antd'
import cx from 'classnames'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// components
import MapContainer from './MapContainer'

// utils
import { ENUMERATIONS_KEYS, FORM, MAP, mapApiConfig, VALIDATION_MAX_LENGTH } from '../utils/enums'
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
import InputField from '../atoms/InputField'
import SelectField from '../atoms/SelectField'
import InputNumberField from '../atoms/InputNumberField'
import StandaloneSearchBoxField from '../atoms/StandaloneSearchBoxField'

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
	form?: FORM
}

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

const AddressFields = (props: Props) => {
	const {
		changeFormFieldValue,
		inputValues,
		input,
		meta: { form, error, touched },
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

	const parseAddressObject = (addressComponents: google.maps.places.PlaceResult['address_components']) => {
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

	const selectLocation = (place: google.maps.places.PlaceResult) => {
		parseAddressObject(place.address_components)
		if (place.geometry?.location) {
			changeFormFieldValue('latitude', parseFloat(place.geometry.location.lat().toFixed(8)))
			changeFormFieldValue('longitude', parseFloat(place.geometry.location.lng().toFixed(8)))
			changeFormFieldValue('zoom', MAP.placeZoom)
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
						{mapError || !mapApiConfig().googleMapsApiKey ? (
							<Row className={'w-full h-full block'} justify='center'>
								<Alert message={t('loc:Google mapa je aktuálne nedostupná.')} showIcon type={'warning'} className={'noti-alert mb-4 google-map-warning'} />
								<Row justify={'space-between'}>
									<Field
										className={'w-4/5'}
										component={InputField}
										label={t('loc:Ulica')}
										placeholder={t('loc:Zadajte ulicu')}
										name={'street'}
										size={'large'}
										disabled={disabled}
										validate={validationRequired}
										required
									/>
									<Field
										className={'w-1/6'}
										component={InputField}
										label={t('loc:Popisné číslo')}
										placeholder={t('loc:Zadajte číslo')}
										name={'streetNumber'}
										disabled={disabled}
										maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
										size={'large'}
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
										disabled={disabled}
										validate={validationRequired}
										required
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:PSČ')}
										placeholder={t('loc:Zadajte smerovacie číslo')}
										name={'zipCode'}
										maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
										size={'large'}
										disabled={disabled}
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
										disabled={disabled}
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
										disabled={disabled}
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
										disabled={disabled}
										validate={[validationRequiredNumber, numberMinLatitude, numberMaxLatitude]}
									/>
								</Row>
							</Row>
						) : (
							<>
								<div className={'mb-7 flex-1 w-1/2 xl:w-full'}>
									<Row>
										<Col span={24} className={'mb-7'}>
											<StandaloneSearchBoxField
												label={t('loc:Vyhľadať')}
												required
												onPlaceSelected={selectLocation}
												type='search'
												placeholder={t('loc:Vyhľadajte miesto na mape')}
												className={'mb-0 pb-0'}
												error={error && touched}
												disabled={disabled}
												form={form}
												name={input.name}
											/>
											<div className={cx('text-danger', { hidden: !(error && touched) })}>{error}</div>
										</Col>
										<Col span={24}>
											<Row gutter={[8, 8]}>
												<Col span={8}>
													<Field
														component={InputField}
														label={t('loc:Ulica')}
														placeholder={t('loc:Zadajte ulicu')}
														name={'street'}
														size={'large'}
														disabled={disabled}
														validate={validationRequired}
														required
													/>
													<Field
														component={InputField}
														label={t('loc:Mesto')}
														placeholder={t('loc:Zadajte mesto')}
														name={'city'}
														size={'large'}
														disabled={disabled}
														validate={validationRequired}
														required
													/>
													<Row gutter={[8, 8]}>
														<Col span={12}>
															<Field
																component={InputField}
																label={t('loc:PSČ')}
																placeholder={t('loc:Zadajte smerovacie číslo')}
																name={'zipCode'}
																maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
																size={'large'}
																disabled={disabled}
																validate={validationRequired}
																required
															/>
														</Col>
														<Col span={12}>
															<Field
																component={InputField}
																label={t('loc:Popisné číslo')}
																placeholder={t('loc:Zadajte číslo')}
																maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
																name={'streetNumber'}
																disabled={disabled}
																size={'large'}
															/>
														</Col>
													</Row>
													<Field
														component={SelectField}
														optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
														label={t('loc:Štát')}
														placeholder={t('loc:Vyber krajinu')}
														options={countries?.enumerationsOptions || []}
														name={'country'}
														size={'large'}
														readOnly
														disabled={disabled}
														loading={countries?.isLoading}
														validate={validationRequired}
														required
													/>
												</Col>
												<Col span={16}>
													<MapContainer
														onError={() => setMapError(true)}
														onLocationChange={changeLocation}
														lat={get(inputValues, 'latitude')}
														lng={get(inputValues, 'longitude')}
														zoom={get(inputValues, 'zoom')}
														disabled={disabled}
													/>
												</Col>
											</Row>
										</Col>
									</Row>
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
