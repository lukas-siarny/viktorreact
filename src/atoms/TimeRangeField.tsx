import { BaseFieldsProps, WrappedFieldsProps } from 'redux-form'

import React from 'react'
import { get, map } from 'lodash'
import cx from 'classnames'

import dayjs, { Dayjs } from 'dayjs'

import { Col, Form, Row, TimePicker } from 'antd'
import { TimePickerProps } from 'antd/lib/time-picker'
import { FormItemProps } from 'antd/lib/form/FormItem'

// assets
import { ReactComponent as TimerIcon } from '../assets/icons/clock-icon.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'

import { formFieldID } from '../utils/helper'
import { DEFAULT_TIME_FORMAT, DROPDOWN_POSITION, ROW_GUTTER_X_DEFAULT } from '../utils/enums'

type Props = WrappedFieldsProps &
	TimePickerProps &
	FormItemProps &
	BaseFieldsProps & {
		placeholders: string[]
		labels?: string[]
		timeFormat?: string
		itemClassName?: string
		hideHelp?: boolean
	}

const { Item } = Form

const TimeRangeField = (props: Props) => {
	const {
		names,
		placeholders,
		labels,
		disabled,
		clearIcon,
		allowClear,
		minuteStep,
		getPopupContainer,
		required,
		size,
		itemClassName,
		timeFormat = DEFAULT_TIME_FORMAT,
		hideHelp,
		suffixIcon
	} = props

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			{map(names, (name, index: number) => {
				const meta = get(props, `${name}.meta`) as any
				const input = get(props, `${name}.input`) as any
				const inputRef = React.createRef<any>()

				let pickerValue
				if (input.value) {
					pickerValue = dayjs(input.value, timeFormat)
				}

				const onChangeWrap = (valueWithSeconds: Dayjs) => {
					// NOTE: neporovnavaj sekundy, ak kliknes na dropdown tlacidlo "Teraz"
					const value = valueWithSeconds.set('seconds', 0).set('milliseconds', 0)

					let newValue = value.format(timeFormat)
					const other = dayjs(get(props, `${names[index === 0 ? 1 : 0]}.input.value`) as any, timeFormat)
					let isNorm

					if (index === 0 && value >= other) {
						newValue = other.subtract(1, 'minute').format(timeFormat)
						isNorm = true
					} else if (index === 1 && value <= other) {
						newValue = other.set('minutes', other.minute() + 1).format(timeFormat)
						isNorm = true
					}

					// NOTE: blurni input aby sa normalizovana hodnota prejavila hned po vybere
					if (isNorm) {
						inputRef?.current?.blur()
					}

					input.onChange(newValue)
				}

				const onClear = (value: Dayjs | null) => {
					if (!value) {
						input.onChange(null)
					} else {
						onChangeWrap(value)
					}
				}

				return (
					<Col span={12} key={name}>
						<Item
							className={cx('w-full', itemClassName)}
							label={labels?.[index]}
							required={required}
							help={hideHelp ? undefined : meta.touched && meta.error}
							validateStatus={meta.touched && meta.error ? 'error' : undefined}
						>
							<TimePicker
								ref={inputRef}
								id={formFieldID(meta.form, input.name)}
								dropdownAlign={DROPDOWN_POSITION.BOTTOM_LEFT}
								onSelect={onChangeWrap} // NOTE: workaround https://github.com/ant-design/ant-design/issues/21189
								onChange={onClear}
								format={timeFormat}
								value={pickerValue}
								className={'w-full noti-date-input noti-time-input'}
								popupClassName={'noti-time-dropdown'}
								size={size}
								suffixIcon={suffixIcon || <TimerIcon className={'text-notino-black'} />}
								placeholder={placeholders[index] as any}
								disabled={disabled}
								clearIcon={clearIcon || <RemoveIcon className={'text-notino-black'} />}
								allowClear={allowClear}
								minuteStep={minuteStep}
								getPopupContainer={getPopupContainer || ((node: any) => node)}
							/>
						</Item>
					</Col>
				)
			})}
		</Row>
	)
}

export default TimeRangeField
