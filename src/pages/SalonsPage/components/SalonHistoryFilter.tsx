import React, { useEffect } from 'react'
import { change, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'

// utils
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { FORM, INTERVALS } from '../../../utils/enums'

// atoms
import DateRangePickerField from '../../../atoms/DateRangePickerField'
import SelectField from '../../../atoms/SelectField'
import { RootState } from '../../../reducers'

type ComponentProps = {
	clearIntervalQuery: Function
}

export interface ISalonHistoryFilter {
	dateFromTo: {
		dateFrom: string
		dateTo: string
	}
	interval: INTERVALS
}

type Props = InjectedFormProps<ISalonHistoryFilter, ComponentProps> & ComponentProps

type ValueAndUnit = {
	value: number
	unit: 'hour' | 'week'
}

const returnValueAndUnit = (interval: INTERVALS): ValueAndUnit | undefined => {
	switch (interval) {
		case INTERVALS.HOURS_24:
			return { value: 24, unit: 'hour' }
		case INTERVALS.HOURS_48:
			return { value: 48, unit: 'hour' }
		case INTERVALS.WEEK_1:
			return { value: 1, unit: 'week' }
		default:
			return undefined
	}
}

const SalonHistoryFilter = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit } = props

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON_HISTORY_FILTER]?.values)

	const intervals = [
		{ label: t('loc:24 hodín'), value: INTERVALS.HOURS_24 },
		{ label: t('loc:48 hodín'), value: INTERVALS.HOURS_48 },
		{ label: t('loc:Týždeň'), value: INTERVALS.WEEK_1 }
	]

	useEffect(() => {
		if (formValues?.interval) {
			const result = returnValueAndUnit(formValues?.interval)
			if (result) {
				const { unit, value } = result
				const now = dayjs()
				dispatch(
					change(FORM.SALON_HISTORY_FILTER, 'dateFromTo', {
						dateFrom: now.subtract(value, unit).toISOString(),
						dateTo: now.toISOString()
					})
				)
			}
		}
	}, [formValues?.interval])

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0 mt-1'}>
			<div className={'flex items-start'}>
				<Field className={'m-0'} component={SelectField} placeholder={t('loc:Vyberte interval')} name={'interval'} options={intervals} allowClear />
				<Field className={'m-0 ml-2'} component={DateRangePickerField} allowClear name={'dateFromTo'} />
			</div>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SALON_HISTORY_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(SalonHistoryFilter)

export default form
