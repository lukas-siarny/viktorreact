import React from 'react'
import { Form, Radio } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'

const { Item } = Form

type Props = WrappedFieldProps &
	InputProps &
	FormItemLabelProps & {
		options: any
	}

const ToggleField = (props: Props) => {
	const {
		input,
		label,
		required,
		options,
		size,
		meta: { error, touched },
		style
	} = props

	return (
		<Item required={required} label={label} help={touched && error} validateStatus={error && touched ? 'error' : undefined} style={style}>
			<Radio.Group
				optionType='button'
				size={size}
				className={'noti-toggle-btn'}
				buttonStyle={'solid'}
				value={input.value || []}
				options={options}
				onChange={input.onChange}
			/>
		</Item>
	)
}

export default ToggleField
