import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, map } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import {
	FORM,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_PAYMENT_METHODS,
	RESERVATION_SOURCE_TYPE,
	RESERVATION_SOURCE_TYPES,
	RESERVATION_STATE,
	RESERVATION_STATES,
	ROW_GUTTER_X_DEFAULT
} from '../../../utils/enums'
import {
	checkFiltersSizeWithoutSearch,
	getAssignedUserLabel,
	transalteReservationSourceType,
	translateReservationPaymentMethod,
	translateReservationState
} from '../../../utils/helper'

// atoms

// components
import Filters from '../../../components/Filters'
import SelectField from '../../../atoms/SelectField'

// reducers
import { RootState } from '../../../reducers'
import DateField from '../../../atoms/DateField'
import { IReservationsFilter } from '../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IReservationsFilter, ComponentProps> & ComponentProps

const RESERVATION_STATE_OPTIONS = () =>
	map(RESERVATION_STATES, (item) => ({
		key: item,
		label: translateReservationState(item as RESERVATION_STATE)
	}))

const RESERVATION_PAYMENT_METHOD_OPTIONS = () =>
	map(RESERVATION_PAYMENT_METHODS, (item) => ({
		key: item,
		label: translateReservationPaymentMethod(item as RESERVATION_PAYMENT_METHOD)
	}))

const RESERVATION_SOURCE_TYPE_OPTIONS = () =>
	map(RESERVATION_SOURCE_TYPES, (item) => ({
		key: item,
		label: transalteReservationSourceType(item as RESERVATION_SOURCE_TYPE)
	}))

const ReservationsFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const reservations = useSelector((state: RootState) => state.salons.reservations)
	const formValues = useSelector((state: RootState) => getFormValues(FORM.RESERVAtIONS_FILTER)(state))

	const employeeIDsOptions = map(reservations?.data?.employees, (employee) => {
		return {
			key: employee.id,
			label: getAssignedUserLabel({
				id: employee.id,
				firstName: employee.firstName,
				lastName: employee.lastName,
				email: employee.email
			})
		}
	})

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							mode={'multiple'}
							name={'reservationStates'}
							placeholder={t('loc:Stav')}
							allowClear
							showSearch={false}
							showArrow
							size={'middle'}
							options={RESERVATION_STATE_OPTIONS()}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							mode={'multiple'}
							name={'reservationPaymentMethods'}
							placeholder={t('loc:Spôsob úhrady')}
							allowClear
							showSearch={false}
							showArrow
							size={'middle'}
							options={RESERVATION_PAYMENT_METHOD_OPTIONS()}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							mode={'multiple'}
							showSearch={false}
							showArrow
							name={'employeeIDs'}
							placeholder={t('loc:Zamestnanci')}
							allowClear
							size={'middle'}
							options={employeeIDsOptions}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							showSearch={false}
							name={'reservationCreateSourceType'}
							placeholder={t('loc:Vytvorená v')}
							allowClear
							size={'middle'}
							options={RESERVATION_SOURCE_TYPE_OPTIONS()}
						/>
					</Col>
					{/* <Field */}
					{/*	name={'dateFrom'} */}
					{/*	label={t('loc:Dátum od')} */}
					{/*	className={'pb-0'} */}
					{/*	// pickerClassName={'w-full'} */}
					{/*	component={DateField} */}
					{/*	// placement={'bottomRight'} */}
					{/*	// dropdownAlign={{ points: ['tr', 'br'] }} */}
					{/*	required */}
					{/*	size={'large'} */}
					{/*	suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />} */}
					{/*	// compareFrom1={dayjs()} */}
					{/*	// compareTo1={dayjs().add(1, 'year')} */}
					{/* /> */}
					{/* <Field */}
					{/*	name={'dateTo'} */}
					{/*	label={t('loc:Dátum do')} */}
					{/*	className={'pb-0'} */}
					{/*	// pickerClassName={'w-full'} */}
					{/*	component={DateField} */}
					{/*	// placement={'bottomRight'} */}
					{/*	// dropdownAlign={{ points: ['tr', 'br'] }} */}
					{/*	required */}
					{/*	size={'large'} */}
					{/*	suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />} */}
					{/*	// compareFrom1={dayjs()} */}
					{/*	// compareTo1={dayjs().add(1, 'year')} */}
					{/* /> */}
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm<IReservationsFilter, ComponentProps>({
	form: FORM.RESERVAtIONS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(ReservationsFilter)

export default form
