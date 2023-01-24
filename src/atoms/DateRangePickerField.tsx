import React, { useCallback } from 'react'
import { DatePicker, Form } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { RangePickerProps } from 'antd/es/date-picker'
import { forEach, isEmpty } from 'lodash'
import { FormItemProps } from 'antd/lib/form/FormItem'
import dayjs, { Dayjs } from 'dayjs'
import cx from 'classnames'
import { ReactComponent as SeparatorIcon } from '../assets/icons/datepicker-separator-icon.svg'

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_INIT_FORMAT, DEFAULT_DATE_WITH_TIME_FORMAT } from '../utils/enums'
import { formFieldID } from '../utils/helper'

export type Props = WrappedFieldProps &
	FormItemProps &
	RangePickerProps & {
		disableFuture?: boolean // for disable startDate from past
		disablePast?: boolean // for disable startDate from past
		itemRef?: any
		rangePickerClassName?: string
		showTime?: boolean
	}

const { RangePicker } = DatePicker

const DateRangePickerField = (props: Props) => {
	const {
		allowEmpty,
		renderExtraFooter,
		input,
		placeholder,
		label,
		format,
		open,
		getPopupContainer,
		style,
		dropdownClassName,
		separator,
		suffixIcon,
		disableFuture,
		disablePast,
		disabledDate,
		itemRef,
		required,
		meta,
		size,
		disabled,
		className,
		presets,
		rangePickerClassName,
		showTime,
		dropdownAlign,
		locale
	} = props

	const onFocus = (e: any) => {
		if (input.onFocus) {
			input.onFocus(e)
		}
	}

	const value: any = []
	forEach(input?.value, (val) => {
		if (val && dayjs(val).isValid()) {
			value.push(dayjs(val))
		}
	})

	const onChange = useCallback(
		(vals: any) => {
			if (!isEmpty(vals)) {
				let formattedValues
				if (showTime) {
					formattedValues = {
						dateFrom: vals[0].toISOString(),
						dateTo: vals[1].toISOString()
					}
				} else {
					formattedValues = {
						dateFrom: vals[0].format(DEFAULT_DATE_INIT_FORMAT),
						dateTo: vals[1].format(DEFAULT_DATE_INIT_FORMAT)
					}
				}
				input.onChange(formattedValues)
			} else {
				input.onChange(null)
			}
		},
		[input, showTime]
	)

	const disabledDateWrap = useCallback(
		(currentDate: Dayjs) => {
			let disable = false
			const now = dayjs()
			if (disabledDate) {
				disable = disabledDate(currentDate)
			} else if (disableFuture) {
				disable = currentDate && currentDate > now.endOf('day')
			} else if (disablePast) {
				disable = currentDate && currentDate < now.startOf('day')
			}
			// TODO: validacia na range 2 mesiace podla prveho datumu ktory bol zvoleny TP-2111
			// TODO: validacia na vsetko isBefore datumu ktory bol prvy zvoleny TP-2111
			return disable
		},
		[disableFuture, disablePast, disabledDate]
	)

	return (
		<Form.Item
			className={className}
			style={style}
			label={label}
			required={required}
			help={meta?.touched && meta?.error}
			validateStatus={meta?.error && meta?.touched ? 'error' : undefined}
		>
			<div id={formFieldID(meta?.form, input?.name)}>
				<RangePicker
					ref={itemRef}
					allowEmpty={allowEmpty}
					className={cx('noti-date-picker', rangePickerClassName)}
					value={value}
					dropdownAlign={dropdownAlign}
					onChange={onChange}
					showTime={showTime}
					format={format || (showTime ? DEFAULT_DATE_WITH_TIME_FORMAT : DEFAULT_DATE_FORMAT)}
					onFocus={onFocus}
					placeholder={placeholder}
					suffixIcon={suffixIcon}
					separator={separator || <SeparatorIcon />}
					open={open}
					disabledDate={disabledDateWrap}
					popupClassName={dropdownClassName}
					renderExtraFooter={renderExtraFooter}
					getPopupContainer={getPopupContainer || ((node) => node)}
					size={size}
					disabled={disabled}
					presets={presets}
					locale={locale}
				/>
			</div>
		</Form.Item>
	)
}

export default DateRangePickerField
