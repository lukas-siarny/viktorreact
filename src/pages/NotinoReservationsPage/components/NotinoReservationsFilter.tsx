import React, { useMemo } from 'react'
import { Field, Fields, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, map } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import {
	CHANGE_DEBOUNCE_TIME,
	ENUMERATIONS_KEYS,
	FIELD_MODE,
	FORM,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_PAYMENT_METHODS,
	RESERVATION_SOURCE_TYPE,
	RESERVATION_SOURCE_TYPES,
	RESERVATION_STATE,
	RESERVATION_STATES,
	ROW_GUTTER_X_M,
	VALIDATION_MAX_LENGTH
} from '../../../utils/enums'
import {
	checkFiltersSizeWithoutSearch,
	optionRenderWithIcon,
	optionRenderWithImage,
	transalteReservationSourceType,
	translateReservationPaymentMethod,
	translateReservationState,
	validationString
} from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'
import InputField from '../../../atoms/InputField'
import DateRangeField from '../../../atoms/DateRangeField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'
import { IReservationsFilter } from '../../../types/interfaces'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

type ComponentProps = {}

type Props = InjectedFormProps<IReservationsFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const NotinoReservationsFilter = (props: Props) => {
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const RESERVATION_PAYMENT_METHOD_OPTIONS = useMemo(
		() =>
			map(RESERVATION_PAYMENT_METHODS, (item) => ({
				key: item,
				label: translateReservationPaymentMethod(item as RESERVATION_PAYMENT_METHOD).text,
				icon: translateReservationPaymentMethod(item as RESERVATION_PAYMENT_METHOD).icon
			})),
		[]
	)

	const RESERVATION_SOURCE_TYPE_OPTIONS = useMemo(
		() =>
			map(RESERVATION_SOURCE_TYPES, (item) => ({
				key: item,
				label: transalteReservationSourceType(item as RESERVATION_SOURCE_TYPE)
			})),
		[]
	)
	const RESERVATION_STATE_OPTIONS = useMemo(
		() =>
			map(RESERVATION_STATES, (item) => ({
				key: item,
				label: translateReservationState(item as RESERVATION_STATE).text,
				icon: translateReservationState(item as RESERVATION_STATE).icon
			})),
		[]
	)

	const { handleSubmit } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.NOTINO_RESERVATIONS_FILTER)(state))
	const categoriesOptions = useSelector((state: RootState) => state.service.services.categoriesOptions)

	const search = (
		<Field
			className={'h-10'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa názvu alebo ID')}
			name={'search'}
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength255}
		/>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={search} activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_M}>
					<Col span={8}>
						<Fields
							label={t('loc:Dátum vytvorenia rezervácie')}
							names={['createdAtFrom', 'createdAtTo']}
							placeholders={[t('loc:od'), t('loc:do')]}
							component={DateRangeField}
							size={'large'}
						/>
					</Col>
					<Col span={8}>
						<Fields
							label={t('loc:Dátum plánovanej rezervácie')}
							names={['dateFrom', 'dateTo']}
							placeholders={[t('loc:od'), t('loc:do')]}
							component={DateRangeField}
							size={'large'}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							className={'pb-0 mt-4'}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
					</Col>
					<Col span={6}>
						<Field
							component={SelectField}
							name={'categoryFirstLevelIDs'}
							mode={'multiple'}
							placeholder={t('loc:Kategórie')}
							allowClear
							showArrow
							size={'large'}
							showSearch={false}
							onDidMountSearch
							options={categoriesOptions}
						/>
					</Col>
					<Col span={6}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithIcon(itemData)}
							mode={'multiple'}
							name={'reservationStates'}
							placeholder={t('loc:Stav')}
							allowClear
							showSearch={false}
							showArrow
							size={'large'}
							options={RESERVATION_STATE_OPTIONS}
						/>
					</Col>
					<Col span={6}>
						<Field
							component={SelectField}
							mode={'multiple'}
							name={'reservationPaymentMethods'}
							placeholder={t('loc:Spôsob úhrady')}
							optionRender={(itemData: any) => optionRenderWithIcon(itemData)}
							allowClear
							showSearch={false}
							showArrow
							size={'large'}
							options={RESERVATION_PAYMENT_METHOD_OPTIONS}
						/>
					</Col>
					<Col span={6}>
						<Field
							component={SelectField}
							showSearch={false}
							name={'reservationCreateSourceType'}
							placeholder={t('loc:Vytvoril')}
							allowClear
							size={'large'}
							options={RESERVATION_SOURCE_TYPE_OPTIONS}
						/>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm<IReservationsFilter, ComponentProps>({
	form: FORM.NOTINO_RESERVATIONS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(NotinoReservationsFilter)

export default form
