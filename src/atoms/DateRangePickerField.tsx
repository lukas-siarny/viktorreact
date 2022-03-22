import React, { useCallback } from 'react'
import { DatePicker, Form } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { RangePickerProps } from 'antd/es/date-picker'
import { forEach, isEmpty } from 'lodash'
import { FormItemProps } from 'antd/lib/form/FormItem'
import dayjs, { Dayjs } from 'dayjs'
import { ReactComponent as SeparatorIcon } from '../assets/icons/datepicker-separator-icon.svg'

import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_INIT_FORMAT } from '../utils/enums'
import { formFieldID } from '../utils/helper'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'

export type Props = WrappedFieldProps &
	FormItemProps &
	RangePickerProps & {
		disableFuture?: boolean // for disable startDate from past
		disablePast?: boolean // for disable startDate from past
		itemRef?: any
	}

const { RangePicker } = DatePicker

const DateRangePickerField = (props: Props) => {
	const {
		renderExtraFooter,
		input,
		placeholder,
		label,
		format = DEFAULT_DATE_FORMAT,
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
		size
	} = props

	const onFocus = (e: any) => {
		if (input.onFocus) {
			input.onFocus(e)
		}
	}

	const value: any = []
	forEach(input.value, (val) => {
		if (val && dayjs(val).isValid()) {
			value.push(dayjs(val))
		}
	})

	const onChange = useCallback(
		(vals: any) => {
			if (!isEmpty(vals)) {
				const formattedValues = {
					dateFrom: vals[0].format(DEFAULT_DATE_INIT_FORMAT),
					dateTo: vals[1].format(DEFAULT_DATE_INIT_FORMAT)
				}
				input.onChange(formattedValues)
			} else {
				input.onChange(null)
			}
		},
		[input]
	)

	const disabledDateWrap = useCallback(
		(currentDate: Dayjs) => {
			let disable = false
			if (disabledDate) {
				disable = disabledDate(currentDate)
			} else if (disableFuture) {
				disable = currentDate && currentDate > dayjs().endOf('day')
			} else if (disablePast) {
				disable = currentDate && currentDate < dayjs().startOf('day')
			}
			// TODO: validacia na range 2 mesiace podla prveho datumu ktory bol zvoleny TP-2111
			// TODO: validacia na vsetko isBefore datumu ktory bol prvy zvoleny TP-2111
			return disable
		},
		[disableFuture, disablePast, disabledDate]
	)

	return (
		<Form.Item style={style} label={label} required={required}>
			<div id={formFieldID(meta.form, input.name)}>
				<RangePicker
					ref={itemRef}
					value={value}
					onChange={onChange}
					format={format}
					onFocus={onFocus}
					placeholder={placeholder}
					clearIcon={<RemoveIcon className={'text-blue-600'} />}
					suffixIcon={suffixIcon}
					separator={separator || <SeparatorIcon />}
					open={open}
					disabledDate={disabledDateWrap}
					dropdownClassName={dropdownClassName}
					renderExtraFooter={renderExtraFooter}
					getPopupContainer={getPopupContainer || ((node) => node)}
					size={size}
				/>
			</div>
		</Form.Item>
	)
}

export default DateRangePickerField
