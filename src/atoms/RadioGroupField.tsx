import React from 'react'
import { Radio, Form } from 'antd'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { map } from 'lodash'
import cx from 'classnames'

const { Item } = Form

type Props = WrappedFieldProps &
	InputProps &
	FormItemLabelProps & {
		options: any
		direction: 'vertical' | 'horizontal'
	}

const RadioGroupField = (props: Props) => {
	const {
		input,
		label,
		required,
		options,
		meta: { error, touched },
		className,
		style,
		direction = 'horizontal'
	} = props

	const radioOptions = map(options, (option) => {
		if (typeof option === 'string') {
			return (
				<Radio key={option} value={option}>
					{option}
				</Radio>
			)
		}
		return (
			<Radio className={cx({ 'w-full': direction === 'vertical' })} key={`${option.value}`} value={option.value}>
				{option.label}
				{option.customContent ? option.customContent : null}
			</Radio>
		)
	})

	return (
		<Item
			required={required}
			label={label}
			help={touched && error}
			validateStatus={error && touched ? 'error' : undefined}
			style={style}
			className={cx(className, 'noti-radio', { 'noti-radio-has-error': error && touched })}
		>
			<Radio.Group value={input.value || []} onChange={input.onChange} className={cx({ flex: direction === 'horizontal', block: direction === 'vertical' })}>
				{radioOptions}
			</Radio.Group>
		</Item>
	)
}

export default RadioGroupField
