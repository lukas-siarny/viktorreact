import React, { useCallback, useRef, useEffect } from 'react'
import { Form, Input } from 'antd'
import cx from 'classnames'
import { WrappedFieldProps } from 'redux-form'
import { InputProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { trimStart } from 'lodash'
import { FIELD_MODE } from '../utils/enums'
// eslint-disable-next-line import/no-cycle
import { formFieldID } from '../utils/helper'
import { ReactComponent as SearchIcon } from '../assets/icons/search-icon.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'

const { Item } = Form

type Props = WrappedFieldProps &
	InputProps &
	FormItemLabelProps & {
		customOnBlur?: (value: string | null) => any
		customOnChange?: (value: string | null) => any
		hideHelp?: boolean
		rounded?: boolean
		fieldMode?: FIELD_MODE
		focused?: boolean
	}

const InputField = (props: Props) => {
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
		meta: { form, error, touched },
		hideHelp,
		maxLength,
		fieldMode = FIELD_MODE.INPUT,
		readOnly,
		className,
		customOnChange,
		allowClear,
		suffix,
		addonBefore,
		focused
	} = props

	const inputRef = useRef<any>(null)

	useEffect(() => {
		if (inputRef.current && focused) {
			inputRef.current.focus()
		}
	}, [focused])

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// NOTE: prevent to have "" empty string as empty value
			const val = e.target.value ? trimStart(e.target.value) : null
			const change = customOnChange || input.onChange
			change(val)
		},
		[input, customOnChange]
	)

	/*
	 * This logic (onBlur, onFocus) set 'dirty' state for Form incorrectly.
	 * Scenario:
	 * 1.Non required field
	 * 2.Focus field
	 * 3.Blur field
	 * 4.Form state is dirty without changes
	
	const onBlur = useCallback(
		async (e) => {
			// NOTE: prevent to have "" empty string as empty value
			const val = e.target.value ? trim(e.target.value) : null
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
	) */

	return (
		<Item
			label={label}
			required={required}
			style={style}
			className={cx(className, { 'form-item-disabled': disabled, readOnly })}
			help={hideHelp ? undefined : touched && error}
			validateStatus={error && touched ? 'error' : undefined}
		>
			<Input
				{...input}
				id={formFieldID(form, input.name)}
				className={cx('noti-input', { 'noti-input-filter': fieldMode === FIELD_MODE.FILTER })}
				onChange={onChange}
				// onBlur={onBlur}
				addonBefore={addonBefore}
				size={size || 'middle'}
				// onFocus={onFocus}
				value={input.value}
				placeholder={placeholder}
				type={type || 'text'}
				// Ak je filter cez RemoveIcon zmazat string (ant ma pre input aj allowClear ale neda sa mu zmenit ikona tak ako napr v selecte preto to je takto robene)
				suffix={
					(allowClear || fieldMode === FIELD_MODE.FILTER) && input.value ? (
						<RemoveIcon onClick={() => input.onChange('')} className={'text-blue-600 cursor-pointer'} />
					) : (
						suffix
					)
				}
				prefix={fieldMode === FIELD_MODE.FILTER ? <SearchIcon /> : prefix}
				disabled={disabled}
				maxLength={maxLength}
				ref={inputRef}
			/>
		</Item>
	)
}

export default React.memo(InputField)
