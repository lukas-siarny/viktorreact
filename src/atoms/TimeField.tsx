import React, { KeyboardEvent } from 'react'
import { WrappedFieldProps } from 'redux-form'
import dayjs, { Dayjs } from 'dayjs'
// ant
import { FormItemProps } from 'antd/lib/form/FormItem'
import { Form, TimePicker } from 'antd'
import { TimePickerProps } from 'antd/lib/time-picker'

import { DEFAULT_TIME_FORMAT, DROPDOWN_POSITION } from '../utils/enums'
import { ReactComponent as TimerIcon } from '../assets/icons/timer-16-icon.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'

// eslint-disable-next-line import/no-cycle
import { formFieldID } from '../utils/helper'

type Props = WrappedFieldProps &
	FormItemProps &
	TimePickerProps & {
		timeFormat?: string
	}

class TimeField extends React.Component<Props> {
	state = { close: undefined }

	onKeyDown = (e: KeyboardEvent) => {
		if (e.keyCode === 13) {
			this.setState({ close: true }, () => {
				this.setState({ close: undefined })
			})
		}
	}

	onChangeWrap = (value: Dayjs) => {
		const { input, timeFormat = DEFAULT_TIME_FORMAT } = this.props
		const timeString = value.format(timeFormat)
		input.onChange(timeString || null)
	}

	onClear = (value: Dayjs | null) => {
		const { input } = this.props
		if (!value) {
			input.onChange(null)
		} else {
			this.onChangeWrap(value)
		}
	}

	render() {
		const {
			input,
			label,
			required,
			style,
			meta: { error, touched, form },
			timeFormat = DEFAULT_TIME_FORMAT,
			placeholder,
			disabled,
			allowClear,
			minuteStep,
			getPopupContainer,
			popupClassName,
			clearIcon
		} = this.props

		let value
		if (input.value) {
			value = dayjs(input.value, timeFormat)
		}
		const control = this.state.close ? { open: false } : {}

		return (
			<Form.Item label={label} required={required} style={style} help={touched && error} validateStatus={error && touched ? 'error' : undefined}>
				<div onKeyDown={this.onKeyDown}>
					<TimePicker
						id={formFieldID(form, input.name)}
						dropdownAlign={DROPDOWN_POSITION.BOTTOM_LEFT}
						style={{ width: '100%' }}
						onSelect={this.onChangeWrap} // NOTE: workaround https://github.com/ant-design/ant-design/issues/21189
						onChange={this.onClear}
						format={timeFormat}
						value={value}
						className={'tp-date-input tp-time-input'}
						popupClassName={popupClassName || 'tp-time-dropdown'}
						suffixIcon={<TimerIcon className={'text-blue-600'} />}
						placeholder={placeholder}
						disabled={disabled}
						clearIcon={clearIcon || <RemoveIcon className={'text-blue-600'} />}
						allowClear={allowClear}
						minuteStep={minuteStep}
						getPopupContainer={getPopupContainer || ((node: any) => node)}
						{...control}
					/>
				</div>
			</Form.Item>
		)
	}
}

export default TimeField
