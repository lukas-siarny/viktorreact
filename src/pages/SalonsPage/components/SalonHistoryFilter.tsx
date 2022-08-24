import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'

// utils
import { FORM } from '../../../utils/enums'
import { getSalonFilterRanges, intervals } from './salonVersionsUtils'

// atoms
import DateRangePickerField from '../../../atoms/DateRangePickerField'

type ComponentProps = {
	clearIntervalQuery: Function
}

export interface ISalonHistoryFilter {
	dateFromTo: {
		dateFrom: string
		dateTo: string
	}
}

type Props = InjectedFormProps<ISalonHistoryFilter, ComponentProps> & ComponentProps

const SalonHistoryFilter = (props: Props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0 mt-1'}>
			<div className={'flex items-start'}>
				<Field
					className={'m-0'}
					rangePickerClassName={'w-full'}
					component={DateRangePickerField}
					showTime
					disableFuture
					placeholder={[t('loc:Od'), t('loc:Do')]}
					allowClear
					name={'dateFromTo'}
					ranges={getSalonFilterRanges(intervals)}
					dropdownAlign={{ points: ['tr', 'br'] }}
					allowEmpty={[false, false]}
				/>
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
