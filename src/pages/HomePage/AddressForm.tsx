import React, { useEffect, useState } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Divider, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import MapContainer from '../../components/MapContainer'

// utils
import { FORM, GOOGLE_MAP_URL, MAP, ROW_GUTTER_X_DEFAULT, WEB_PROJECT_CODE } from '../../utils/enums'
import { validationNumberMax, validationNumberMin, validationRequiredNumber } from '../../utils/helper'

// types
import { RootState } from '../../reducers'

// atoms
import InputNumberField from '../../atoms/InputNumberField'
import LocationSearchInputField from '../../atoms/LocationSearchInputField'

interface ILabelInValueOption<ValueType = number, ExtraType = any> {
	key: ValueType
	value: ValueType
	label: string
	extra?: ExtraType
}

export interface IDestinationForm {
	name: string
	nameLocalization: {
		languageCode: string
		value?: string | null
		webProjectCode: WEB_PROJECT_CODE | null
	}[]
	latitude: number
	longitude: number
	zoom: number
	timezone: string
	parentID: ILabelInValueOption
	countryID: ILabelInValueOption
}

type ComponentProps = {
	hideFooterButtons?: boolean
	destinationID?: number
	hasChildren?: boolean
}

type Props = InjectedFormProps<IDestinationForm, ComponentProps> & ComponentProps

interface Template {
	home: string[]
	postal_code: string[]
	street: string[]
	region: string[]
	city: string[]
	country: string[]
}

const numberMinLongitude = validationNumberMin(MAP.minLongitude)
const numberMaxLongitude = validationNumberMax(MAP.maxLongitude)
const numberMinLatitude = validationNumberMin(MAP.minLatitude)
const numberMaxLatitude = validationNumberMax(MAP.maxLatitude)
const numberMinZoom = validationNumberMin(MAP.minZoom)
const numberMaxZoom = validationNumberMax(MAP.maxZoom)

const AddressForm = (props: Props) => {
	const { handleSubmit, change, initialize } = props
	const [t] = useTranslation()

	const formValues = useSelector((state: RootState) => getFormValues(FORM.DESTINATION_FORM)(state))
	const [zoomState, setZoomState] = useState(14)

	useEffect(() => {
		setZoomState(get(formValues, 'zoom'))
	}, [formValues])

	useEffect(() => {
		initialize({ zoom: 14 })
	}, [initialize])

	const parseAddressObject = (addressComponents: any) => {
		const template: Template = {
			home: ['street_number'],
			postal_code: ['postal_code'],
			street: ['street_address', 'route'],
			region: ['administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'administrative_area_level_4', 'administrative_area_level_5'],
			city: ['locality', 'sublocality', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'sublocality_level_4'],
			country: ['country']
		}

		const address = {
			home: '',
			postal_code: '',
			street: '',
			region: '',
			city: '',
			country: ''
		}

		addressComponents.forEach((component: any) => {
			Object.keys(template).forEach((shouldBe) => {
				if (template[shouldBe as keyof Template].indexOf(component.types[0]) !== -1) {
					if (shouldBe === 'country') {
						address[shouldBe] = component.short_name
					} else {
						address[shouldBe as keyof Template] = component.long_name
					}
				}
			})
		})

		console.log('🚀 ~ file: AddressForm.tsx ~ line 120 ~ parseAddressObject ~ address', address)
	}

	const selectLocation = (place: any) => {
		console.log('🚀 ~ file: AddressForm.tsx ~ line 75 ~ selectLocation ~ place', place)
		parseAddressObject(place.address_components)
		change('latitude', parseFloat(place.location.lat().toFixed(8)))
		change('longitude', parseFloat(place.location.lng().toFixed(8)))
		change('name', place.placeName)
	}

	const changeLocation = (e: any) => {
		change('latitude', parseFloat(e.latLng.lat().toFixed(8)))
		change('longitude', parseFloat(e.latLng.lng().toFixed(8)))
	}

	const handleZoomChanged = (newZoom: number) => {
		change('zoom', newZoom)
		setZoomState(newZoom)
	}

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'space-around'}>
				<Col xl={6} md={9}>
					<LocationSearchInputField
						googleMapURL={GOOGLE_MAP_URL}
						loadingElement={<div style={{ height: '100%' }} />}
						containerElement={<div />}
						label={t('loc:Vyhľadať')}
						onPlaceSelected={selectLocation}
						placeholder={t('loc:Vyhľadajte miesto na mape')}
					/>
					<Field
						component={InputNumberField}
						label={t('loc:Zem. dĺžka')}
						placeholder={t('loc:Zem. dĺžka v rozsahu od -180 do 180')}
						name='longitude'
						required
						maxChars={10}
						validate={[validationRequiredNumber, numberMinLongitude, numberMaxLongitude]}
					/>
					<Field
						component={InputNumberField}
						label={t('loc:Zem. šírka')}
						placeholder={t('loc:Zem. šírka v rozsahu od -90 do 90')}
						name='latitude'
						required
						maxChars={10}
						validate={[validationRequiredNumber, numberMinLatitude, numberMaxLatitude]}
					/>
					<Field
						component={InputNumberField}
						label={t('loc:Zoom')}
						placeholder={t('loc:Zoom v rozsahu od 1 do 10')}
						name='zoom'
						required
						precision={0}
						onPressEnter={(ref: any) => ref.blur()}
						validate={[validationRequiredNumber, numberMinZoom, numberMaxZoom]}
					/>
				</Col>
				<Col xl={1} className={'flex-center'}>
					<Divider type={'vertical'} style={{ height: '100%' }} />
				</Col>
				<Col xl={17} md={14}>
					<MapContainer
						googleMapURL={GOOGLE_MAP_URL}
						containerElement={<div style={{ height: '660px' }} />}
						mapElement={<div style={{ height: '100%' }} />}
						loadingElement={<div style={{ height: '100%' }} />}
						onLocationChange={changeLocation}
						lat={get(formValues, 'latitude')}
						long={get(formValues, 'longitude')}
						zoom={zoomState}
						zoomChanged={handleZoomChanged}
					/>
				</Col>
			</Row>
		</Form>
	)
}

const form = reduxForm<IDestinationForm, ComponentProps>({
	form: FORM.DESTINATION_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true
})(AddressForm)

export default form
