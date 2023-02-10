import React from 'react'
import { Checkbox, Row, Form } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import cx from 'classnames'

const { Item } = Form

type Props = WrappedFieldProps &
	InputProps &
	FormItemLabelProps & {
		optionRender?: (option: any, isChecked: boolean, disabled?: boolean) => React.ReactNode
		hideChecker?: boolean
	}

const CheckboxField = (props: Props) => {
	const {
		input,
		label,
		required,
		disabled,
		meta: { error, touched },
		placeholder,
		style,
		className,
		hideChecker,
		optionRender
	} = props

	return (
		<Item
			className={cx(className, 'noti-checkbox', { 'noti-checkbox-hidden': hideChecker })}
			required={required}
			label={label}
			help={touched && error}
			validateStatus={error && touched ? 'error' : undefined}
			style={style}
		>
			<Row>
				<Checkbox {...input} checked={!!input.value} disabled={disabled}>
					{optionRender ? optionRender(placeholder, !!input.value, disabled) : placeholder}
				</Checkbox>
			</Row>
		</Item>
	)
}

export default CheckboxField
