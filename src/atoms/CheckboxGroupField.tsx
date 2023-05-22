// ant
import { Checkbox, Form } from 'antd'
import { CheckboxGroupProps } from 'antd/lib/checkbox'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { FormItemProps } from 'antd/lib/form/FormItem'
import cx from 'classnames'
import { map } from 'lodash'
import React from 'react'
import { WrappedFieldProps } from 'redux-form'

const { Item } = Form

type ComponentProps = {
	checkboxGroupStyles?: React.CSSProperties
	horizontal?: boolean
	size: 'small' | 'medium' | 'large'
	rounded?: boolean
	hideChecker?: boolean
	optionRender?: (option: any, isChecked: boolean, disabled?: boolean) => React.ReactNode
	nullAsEmptyValue?: boolean
	useCustomColor?: boolean
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
		size = 'medium',
		rounded,
		hideChecker,
		optionRender,
		disabled,
		nullAsEmptyValue,
		useCustomColor
	} = props

	const checkboxes = map(options, (option: any) => {
		const isChecked = input.value?.includes(option.value)
		const checkerStyle =
			useCustomColor && (option.color || option.extra?.color) ? ({ '--checkbox-color': option.color || option.extra?.color || '#000' } as React.CSSProperties) : undefined

		if (typeof option === 'string') {
			return (
				<Checkbox key={option} value={option} disabled={disabled} className={cx({ horizontal })} style={checkerStyle}>
					{optionRender ? optionRender(option, isChecked, disabled) : option}
				</Checkbox>
			)
		}
		return (
			<Checkbox disabled={option.disabled || disabled} key={`${option.value}`} value={option.value} className={cx({ horizontal })} style={checkerStyle}>
				{optionRender ? optionRender(option, isChecked, disabled) : option.label}
			</Checkbox>
		)
	})
	return (
		<Item
			label={label}
			required={required}
			help={touched && error}
			className={cx(className, `noti-checkbox-group noti-checkbox-group-${size}`, {
				'noti-checkbox-group-horizontal': horizontal,
				'noti-checkbox-group-vertical': !horizontal,
				'noti-checkbox-group-rounded': rounded,
				'noti-checkbox-group-hidden': hideChecker,
				'noti-checkbox-group-custom-color': useCustomColor
			})}
			validateStatus={error && touched ? 'error' : undefined}
			style={style}
		>
			<Checkbox.Group
				className={'flex flex-wrap'}
				value={input.value || []}
				onChange={(checkedValue) => {
					let newValue: CheckboxValueType[] | null = checkedValue
					if (nullAsEmptyValue && checkedValue?.length === 0) {
						newValue = null
					}
					input.onChange(newValue)
				}}
				defaultValue={defaultValue}
				disabled={disabled}
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
