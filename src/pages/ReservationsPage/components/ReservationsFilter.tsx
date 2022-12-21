import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, map } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import dayjs from 'dayjs'
import { FORM, RESERVATION_STATES, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, translateReservationState } from '../../../utils/helper'

// atoms

// components
import Filters from '../../../components/Filters'
import SelectField from '../../../atoms/SelectField'

// reducers
import { RootState } from '../../../reducers'
import DateField from '../../../atoms/DateField'
import { ReactComponent as DateSuffixIcon } from '../../../assets/icons/date-suffix-icon.svg'
import { IReservationsFilter } from '../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IReservationsFilter, ComponentProps> & ComponentProps

const RESERVATION_STATE_OPTIONS = () =>
	map(RESERVATION_STATES, (item) => ({
		key: item,
		label: translateReservationState(item as any)
	}))

const ReservationsFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const servicesOptions = useSelector((state: RootState) => state.service.services.options)
	const formValues = useSelector((state: RootState) => getFormValues(FORM.RESERVAtIONS_FILTER)(state))

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					{/* <Col span={8}> */}
					{/*	<Field */}
					{/*		component={SelectField} */}
					{/*		name={'accountState'} */}
					{/*		placeholder={t('loc:Stav konta')} */}
					{/*		allowClear */}
					{/*		size={'middle'} */}
					{/*		filterOptions */}
					{/*		onDidMountSearch */}
					{/*		options={[]} */}
					{/*	/> */}
					{/* </Col> */}
					{/* <Col span={8}> */}
					{/*	<Field component={SelectField} name={'serviceID'} placeholder={t('loc:Služba')} allowClear size={'middle'} onDidMountSearch options={servicesOptions} /> */}
					{/* </Col> */}
					<Col span={8}>
						<Field
							component={SelectField}
							mode={'multiple'}
							name={'reservationStates'}
							placeholder={t('loc:Stav')}
							allowClear
							size={'middle'}
							options={RESERVATION_STATE_OPTIONS()}
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
