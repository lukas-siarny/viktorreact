import React, { useRef, useEffect } from 'react'
import ReactPinField from 'react-pin-field'
import { WrappedFieldProps } from 'redux-form'
import { Form } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import cx from 'classnames'

import { formFieldID } from '../utils/helper'

type Props = WrappedFieldProps &
	FormItemProps & {
		length: number
		formatPin?: (char: string) => string
	}

const PinField = (props: Props) => {
	const {
		input,
		length,
		meta: { form, error, touched },
		style,
		formatPin
	} = props

	const inputRef = useRef<any>(null)

	useEffect(() => {
		if (inputRef.current) {
			inputRef?.current?.inputs?.[0]?.focus()
		}
	}, [inputRef])

	return (
		<Form.Item style={style} validateStatus={error && touched ? 'error' : undefined}>
			<ReactPinField
				id={formFieldID(form, input.name)}
				ref={inputRef}
				length={length}
				format={formatPin}
				onComplete={(code) => input.onBlur(code)}
				onChange={(code) => input.onChange(code)}
				className={cx('pin-field heading-4 mr-2 rounded-DEFAULT', { 'pin-error': error && touched })}
			/>
			<div className={cx('mt-2 text-danger h-6', { invisible: !(error && touched) })}>{error}</div>
		</Form.Item>
	)
}

export default PinField
