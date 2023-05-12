import React, { useMemo } from 'react'
import { Field, Fields, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, map } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import {
	CHANGE_DEBOUNCE_TIME,
	FORM,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_PAYMENT_METHODS,
	RESERVATION_SOURCE_TYPE,
	RESERVATION_SOURCE_TYPES,
	RESERVATION_STATE,
	RESERVATION_STATES,
	RESERVATIONS_STATE,
	ROW_GUTTER_X_M
} from '../../../utils/enums'
import {
	checkFiltersSizeWithoutSearch,
	getAssignedUserLabel,
	optionRenderWithIcon,
	transalteReservationSourceType,
	translateReservationPaymentMethod,
	translateReservationState
} from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'
import DateRangeField from '../../../atoms/DateRangeField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'
import { ISalonReservationsFilter, ReservationsEmployees } from '../../../types/interfaces'

type ComponentProps = {
	reservationState: RESERVATIONS_STATE
}

type Props = InjectedFormProps<ISalonReservationsFilter, ComponentProps> & ComponentProps

const employeeIDsOptions = (employees: ReservationsEmployees) =>
	map(employees, (employee) => {
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

const ReservationsFilter = (props: Props) => {
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

	const { handleSubmit, reservationState } = props
	const [t] = useTranslation()
	const reservations = useSelector((state: RootState) => state.calendar.paginatedReservations)
	const formValues = useSelector((state: RootState) => getFormValues(FORM.RESERVATIONS_FILTER)(state))
	const categoriesOptions = useSelector((state: RootState) => state.service.services.categoriesOptions)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters activeFilters={checkFiltersSizeWithoutSearch(formValues)} form={FORM.RESERVATIONS_FILTER}>
				<>
					<Row gutter={ROW_GUTTER_X_M}>
						<Col span={6}>
							<Fields
								label={t('loc:Dátum vytvorenia rezervácie')}
								names={['createdAtFrom', 'createdAtTo']}
								placeholders={[t('loc:od'), t('loc:do')]}
								component={DateRangeField}
								size={'large'}
							/>
						</Col>
						<Col span={6}>
							<Fields
								label={t('loc:Dátum plánovanej rezervácie')}
								names={['dateFrom', 'dateTo']}
								placeholders={[t('loc:od'), t('loc:do')]}
								component={DateRangeField}
								size={'large'}
							/>
						</Col>
						<Col span={6}>
							<Field
								component={SelectField}
								name={'categoryIDs'}
								mode={'multiple'}
								placeholder={t('loc:Kategórie')}
								allowClear
								showArrow
								className={'pb-0 mt-4'}
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
								className={'pb-0 mt-4'}
								disabled={reservationState === RESERVATIONS_STATE.PENDING}
								size={'large'}
								options={RESERVATION_STATE_OPTIONS}
							/>
						</Col>
					</Row>
					<Row gutter={ROW_GUTTER_X_M}>
						<Col span={8}>
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
						<Col span={8}>
							<Field
								component={SelectField}
								mode={'multiple'}
								showSearch={false}
								showArrow
								name={'employeeIDs'}
								placeholder={t('loc:Zamestnanci')}
								allowClear
								size={'large'}
								options={employeeIDsOptions(reservations.data?.employees as ReservationsEmployees)}
							/>
						</Col>
						<Col span={8}>
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
				</>
			</Filters>
		</Form>
	)
}

const form = reduxForm<ISalonReservationsFilter, ComponentProps>({
	form: FORM.RESERVATIONS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(ReservationsFilter)

export default form
