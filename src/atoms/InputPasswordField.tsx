import React, { useCallback } from 'react'
import { Form, Input } from 'antd'
import cx from 'classnames'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { trimStart } from 'lodash'

import { ReactComponent as EyeIcon } from '../assets/icons/eye-icon.svg'
import { ReactComponent as EyeHiddenIcon } from '../assets/icons/eye-hidden-icon.svg'
import { formFieldID } from '../utils/helper'

const { Item } = Form

type Props = WrappedFieldProps &
	InputProps &
	FormItemLabelProps & {
		customOnBlur?: (value: string | null) => any
		hideHelp?: boolean
	}

const InputPasswordField = (props: Props) => {
	const {
		input,
		size,
		placeholder,
		label,
		required,
		type,
		prefix,
		disabled,
		style,
		customOnBlur,
		meta: { form, error, touched },
		hideHelp,
		maxLength,
		readOnly,
		className
	} = props

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// NOTE: prevent to have "" empty string as empty value
			const val = e.target.value ? e.target.value : null
			input.onChange(trimStart(val as string))
		},
		[input]
	)

	const onBlur = useCallback(
		async (e) => {
			// NOTE: prevent to have "" empty string as empty value
			const val = e.target.value ? e.target.value : null

			// NOTE: wait until redux-form "BLUR" action is finished
			await input.onBlur(val)

			if (customOnBlur) {
				customOnBlur(val)
			}
		},
		[input, customOnBlur]
	)

	const onFocus = useCallback(
		async (e) => {
			// NOTE: prevent to have "" empty string as empty value
			const val = e.target.value ? e.target.value : null
			if (input.onFocus) {
				input.onFocus(val)
			}
		},
		[input]
	)

	const renderToggleIcon = (visible: boolean) => {
		if (visible) {
			return <EyeIcon />
		}
		return <EyeHiddenIcon />
	}

	return (
		<Item
			label={label}
			required={required}
			style={style}
			className={cx(className, { 'form-item-disabled': disabled, readOnly })}
			help={hideHelp ? undefined : touched && error}
			validateStatus={error && touched ? 'error' : undefined}
		>
			<Input.Password
				{...input}
				id={formFieldID(form, input.name)}
				className={cx('noti-input-password')}
				onChange={onChange}
				onBlur={onBlur}
				size={size || 'middle'}
				onFocus={onFocus}
				value={input.value}
				iconRender={renderToggleIcon}
				placeholder={placeholder}
				type={type || 'text'}
				prefix={prefix}
				disabled={disabled}
				maxLength={maxLength}
			/>
		</Item>
	)
}

export default React.memo(InputPasswordField)
