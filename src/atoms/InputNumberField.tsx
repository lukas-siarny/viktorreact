import React, { useCallback, useRef } from 'react'
import { WrappedFieldProps } from 'redux-form'
import cx from 'classnames'

// ant
import { Form, InputNumber } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { InputNumberProps } from 'antd/lib/input-number'

// utils
import { formFieldID, transformNumberFieldValue } from '../utils/helper'

const { Item } = Form

type Props = WrappedFieldProps &
	FormItemLabelProps &
	InputNumberProps & {
		maxChars?: number
		smallInput?: boolean
		rounded?: boolean
		hideHelp?: boolean
		notNullValue?: boolean // Propa ktora hovori o tom ze nemozem posielat null na BE a vtedy nastavi hodnotu na min tj ak je min=1 a zmazem hdonotu alebo napisem mensiu ako min tak ju nastavi na min
	}

const InputNumberField = (props: Props) => {
	const {
		input,
		size,
		placeholder,
		label,
		required,
		disabled,
		style,
		meta: { form, error, touched },
		min = -99999999,
		max = 999999999,
		precision,
		step,
		parser,
		maxChars = 9, // NOTE: Kazde 9 ciferne cislo je bezpecne pre Postgres Integer typ
		smallInput,
		defaultValue,
		type = 'text',
		rounded,
		hideHelp,
		className,
		notNullValue = false,
		onPressEnter,
		readOnly,
		stringMode
	} = props

	const maxCharsParser = (displayValue: string | undefined): string => {
		if (maxChars && maxChars > 0 && displayValue && displayValue.length > maxChars) {
			const formatted = displayValue.slice(0, maxChars)
			return formatted
		}
		return displayValue || ''
	}
	const inputRef = useRef(null)

	const onFocus = useCallback(
		async (e) => {
			if (input.onFocus) {
				const val = transformNumberFieldValue(e.target.value)
				input.onFocus(val as any)
			}
		},
		[input]
	)

	const onPressEnterWrap = useCallback(async () => {
		// NOTE: e.target.value v onPressEnter() može byť 5.5555€ aj keď je precision = 0, v parent komponente treba zavolať ref.blur() a do onBlur príde už zaokrúhlená number hodnota
		if (onPressEnter) {
			const ref = inputRef.current
			onPressEnter(ref as any)
		}
	}, [onPressEnter])

	const onBlur = useCallback(
		async (e) => {
			const val = transformNumberFieldValue(e.target.value, Number(min), Number(max), precision, notNullValue)
			// NOTE: wait until redux-form "BLUR" action is finished
			await input.onBlur(val)
		},
		[min, max, precision, notNullValue, input]
	)

	return (
		<Item
			label={label}
			required={required}
			style={style}
			help={touched && !hideHelp && error}
			validateStatus={error && touched ? 'error' : undefined}
			className={cx(className, { 'small-input': smallInput, 'form-item-disabled': disabled, readOnly })}
		>
			<InputNumber
				{...input}
				ref={inputRef}
				style={{ width: '100%' }}
				id={formFieldID(form, input.name)}
				min={min}
				max={max}
				size={size || 'middle'}
				defaultValue={defaultValue}
				value={input.value}
				placeholder={placeholder}
				disabled={disabled}
				precision={precision}
				step={step}
				type={type || 'text'}
				className={cx('noti-input-number', { 'rounded-full': rounded })}
				onFocus={onFocus}
				decimalSeparator=','
				parser={maxChars && maxChars > 0 ? maxCharsParser : parser}
				// NOTE: Prevent proti posielaniu BLUR akcie so string payloadom - posiela Ant na pozadi
				onBlur={onBlur}
				onPressEnter={onPressEnterWrap}
				onChange={input.onChange}
				stringMode={stringMode}
			/>
		</Item>
	)
}

export default React.memo(InputNumberField)
