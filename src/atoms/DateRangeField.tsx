import React, { PropsWithChildren } from 'react'
import { DatePicker, DatePickerProps, Form } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { map, get } from 'lodash'
import cx from 'classnames'
import { WrappedFieldsProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { ReactComponent as DateSuffixIcon } from '../assets/icons/date-suffix-icon.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'

import { DEFAULT_DATE_INIT_FORMAT, DEFAULT_DATE_INPUT_FORMAT } from '../utils/enums'

type Props = WrappedFieldsProps &
	InputProps &
	FormItemLabelProps &
	DatePickerProps & {
		disablePast?: boolean // for disable startDate from past
		disableStartDayEnd?: boolean
	}

const { Item } = Form

const DateRangeField = (props: Props) => {
	const {
		names,
		labels,
		formats,
		getCalendarContainer,
		renderExtraFooter,
		required,
		placeholders,
		disabled,
		disableStartDayEnd,
		disablePast,
		suffixIcon,
		clearIcon,
		allowClear,
		getPopupContainer
	} = props
	const disabledStartDate = (startValue: Dayjs | null) => {
		const endValue = get(props, `${names[1]}.input.value`) as any
		const yesterday = dayjs().subtract(1, 'day')
		if (disablePast && startValue?.isBefore(yesterday)) {
			// disable past
			return true
		}
		if (startValue?.isAfter(endValue)) {
			// disable StartValue after EndValue
			return true
		}
		return !!(disableStartDayEnd && (startValue?.isAfter(endValue) || startValue?.isSame(endValue)))
	}

	const disabledEndDate = (endValue: Dayjs | null) => {
		const startValue = get(props, `${names[0]}.input.value`) as any
		if (disablePast && endValue?.isBefore(dayjs())) {
			// disable past
			return true
		}
		if (endValue?.isBefore(startValue)) {
			// disable EndValue before StartValue
			return true
		}
		return !!(disableStartDayEnd && (endValue?.isBefore(startValue) || endValue?.isSame(startValue)))
	}

	return (
		<div className={'flex'}>
			{map(names, (name, index: number) => {
				const input = get(props, `[${name}].input`) as any
				const { touched, error } = get(props, `[${name}].meta`)
				let value
				const format = get(formats, `[${index}]`) || DEFAULT_DATE_INPUT_FORMAT
				if (input.value && dayjs(input.value).isValid()) {
					value = dayjs(input.value)
				}

				const allowClearWrap = !required
				let disabledDate
				if (index === 0) {
					disabledDate = disabledStartDate
				} else {
					disabledDate = disabledEndDate
				}
				return (
					<Item
						label={labels ? labels[index] : (undefined as any)}
						required={required}
						help={touched && (error as any)}
						validateStatus={error && touched ? 'error' : (undefined as any)}
						key={index}
						className={'w-1/2'}
					>
						<DatePicker
							{...input}
							className={cx('w-full noti-date-input', { 'allow-clear': allowClearWrap })}
							onBlur={() => {}}
							place
							onChange={(val) => {
								if (val) {
									input.onChange(val.format(DEFAULT_DATE_INIT_FORMAT))
								} else {
									input.onChange(null)
								}
							}}
							arrow={false}
							getCalendarContainer={getCalendarContainer}
							format={format}
							suffixIcon={suffixIcon || <DateSuffixIcon className={'TreeCategories'} />}
							clearIcon={clearIcon || <RemoveIcon className={'TreeCategories'} />}
							allowClear={allowClearWrap || allowClear}
							value={value}
							placeholder={get(placeholders, `[${index}]`)}
							disabledDate={disabledDate}
							disabled={disabled}
							renderExtraFooter={renderExtraFooter}
							showToday={!(index === 1 && disableStartDayEnd === true)}
							getPopupContainer={getPopupContainer || ((node) => node)}
						/>
					</Item>
				)
			})}
		</div>
	)
}

export default DateRangeField
