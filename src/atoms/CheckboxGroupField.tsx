// ant
import { Checkbox, Form } from 'antd'
import { CheckboxGroupProps } from 'antd/lib/checkbox'
import { FormItemProps } from 'antd/lib/form/FormItem'
import cx from 'classnames'
import { map } from 'lodash'
import React from 'react'
import { WrappedFieldProps } from 'redux-form'

const { Item } = Form

type ComponentProps = {
	checkboxGroupStyles?: React.CSSProperties
	horizontal?: boolean
	large?: boolean
}

type Props = WrappedFieldProps & CheckboxGroupProps & FormItemProps & ComponentProps

const CheckboxGroupField = (props: Props) => {
	const {
		input,
		options,
		label,
		required,
		meta: { error, touched },
		style,
		checkboxGroupStyles,
		defaultValue,
		horizontal,
		className,
		large
	} = props

	const checkboxes = map(options, (option: any) => {
		if (typeof option === 'string') {
			return (
				<Checkbox key={option} value={option} className={cx({ large, 'inline-flex': horizontal })}>
					{option}
				</Checkbox>
			)
		}
		return (
			<Checkbox disabled={option.disabled} key={`${option.value}`} value={option.value} className={cx('my-1', { large, 'inline-flex': horizontal })}>
				{option.label}
			</Checkbox>
		)
	})
	return (
		<Item label={label} required={required} help={touched && error} className={className} validateStatus={error && touched ? 'error' : undefined} style={style}>
			<Checkbox.Group
				className={'flex flex-wrap'}
				value={input.value || []}
				onChange={input.onChange}
				defaultValue={defaultValue}
				style={{
					...checkboxGroupStyles,
					flexDirection: horizontal ? 'row' : 'column'
				}}
			>
				{checkboxes}
			</Checkbox.Group>
		</Item>
	)
}

export default CheckboxGroupField
