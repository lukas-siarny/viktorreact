import React from 'react'
import { Checkbox, Row, Form } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'

const { Item } = Form

type Props = WrappedFieldProps & InputProps & FormItemLabelProps

const CheckboxField = (props: Props) => {
	const {
		input,
		label,
		required,
		disabled,
		meta: { error, touched },
		placeholder,
		style
	} = props

	return (
		<Item required={required} label={label} help={touched && error} validateStatus={error && touched ? 'error' : undefined} style={style}>
			<Row>
				<Checkbox {...input} checked={!!input.value} disabled={disabled}>
					{placeholder}
				</Checkbox>
			</Row>
		</Item>
	)
}

export default CheckboxField
