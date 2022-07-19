import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { WrappedFieldProps } from 'redux-form'

import { get, trimStart } from 'lodash'

import { Form, Input, Row } from 'antd'
import { TextAreaProps } from 'antd/lib/input'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { TextAreaRef } from 'antd/lib/input/TextArea'
import cx from 'classnames'

type Props = WrappedFieldProps &
	TextAreaProps &
	FormItemLabelProps & {
		focusRow?: number
		showLettersCount?: boolean
		focused?: boolean
	}

const TextareaField = (props: Props) => {
	const {
		input,
		prefix,
		disabled,
		label,
		placeholder,
		required,
		meta: { error, touched },
		rows,
		autoSize,
		allowClear,
		style,
		maxLength,
		focusRow,
		readOnly,
		className,
		size,
		showLettersCount,
		focused
	} = props

	const [autoSizeState, setSutoSizeState] = useState(undefined as { minRows?: number; maxRows?: number } | undefined)

	const ref = useRef(null as TextAreaRef | null)

	useEffect(() => {
		if (ref.current && focused) {
			ref.current.focus()
		}
	}, [focused])

	const parseValue = (value: any) => trimStart(value) || null

	const onChange = useCallback(
		(e: any) => {
			if (input.onChange) {
				const val = parseValue(get(e, 'target.value'))
				input.onChange(val as any, e.target.name)
			}
		},
		[input]
	)

	const onFocus = useCallback(
		(e) => {
			e.target.selectionEnd = 1
			if (input.onFocus) {
				input.onFocus(e)
			}
			if (focusRow) {
				setSutoSizeState({ minRows: focusRow, maxRows: 10 })
				ref?.current?.resizableTextArea?.resizeOnNextFrame()
			}
		},
		[focusRow, input, setSutoSizeState]
	)

	const onBlur = useCallback(
		(e) => {
			if (input.onBlur) {
				const val = parseValue(get(e, 'target.value'))
				input.onBlur(val as any, e.target.name)
			}
			if (focusRow) {
				setSutoSizeState({ minRows: 1, maxRows: 10 })
				ref?.current?.resizableTextArea?.resizeOnNextFrame()
			}
		},
		[focusRow, input, setSutoSizeState]
	)

	const lettersCount = useMemo(() => {
		return (
			<Row className={'justify-between w-full pr-2 items-end'}>
				<span>{label}</span>
				<i className='xs-regular mb-1'>{`${input.value.length}/${maxLength}`}</i>
			</Row>
		)
	}, [maxLength, input, label])

	return (
		<Form.Item
			label={showLettersCount ? lettersCount : label}
			required={required}
			style={style}
			help={touched && error}
			className={cx(className, { 'form-item-disabled': disabled, readOnly })}
			validateStatus={error && touched ? 'error' : undefined}
		>
			<Input.TextArea
				{...input}
				onFocus={onFocus}
				onBlur={onBlur}
				onChange={onChange}
				className={'noti-textarea'}
				value={input.value}
				placeholder={placeholder}
				prefix={prefix}
				disabled={disabled}
				rows={rows}
				autoSize={autoSizeState || autoSize}
				allowClear={allowClear}
				maxLength={maxLength}
				ref={ref}
				size={size}
			/>
		</Form.Item>
	)
}

export default TextareaField
