import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
// ant
import { Form, Input, InputProps } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'

type Props = FormItemLabelProps &
	InputProps & {
		smallInput?: boolean
		resetOnBlur?: boolean
	}

const RawInput = (props: Props) => {
	const { size, placeholder, disabled, step, onBlur, onPressEnter, style, value, className, readOnly, resetOnBlur } = props

	const inputRef = useRef(null)
	// NOTE: pomocny state na data pre input
	const [textData, setTextData] = useState<any>(undefined)

	useEffect(() => {
		setTextData(value)
	}, [value])

	const onChange = (e: any) => {
		setTextData(e.target.value)
	}

	const onBlurWrap = useCallback(async () => {
		let val: any = ''
		if (resetOnBlur) {
			// NOTE: pomocna premenna aby field vedel ze pri bulkovom update nastav '' pri onBlure
			setTextData(value)
		}
		val = textData

		if (onBlur) {
			await onBlur(val)
		}
	}, [onBlur, resetOnBlur, textData, value])

	const onPressEnterWrap = useCallback(async () => {
		// NOTE: e.target.value v onPressEnter() može byť 5.5555€ aj keď je precision = 0, v parent komponente treba zavolať ref.blur() a do onBlur príde už zaokrúhlená number hodnota
		if (onPressEnter) {
			const ref = inputRef.current
			onPressEnter(ref as any)
		}
	}, [onPressEnter])

	return (
		<Form.Item style={{ marginBottom: 0 }} className={cx({ 'form-item-disabled': disabled, readOnly })}>
			<Input
				ref={inputRef}
				style={style || { width: '100%' }}
				className={cx('tp-input', { className, readOnly })}
				size={size || 'middle'}
				value={textData}
				placeholder={placeholder}
				disabled={disabled}
				step={step}
				onChange={onChange}
				type={'text'}
				// NOTE: Prevent proti posielaniu BLUR akcie so string payloadom - posiela Ant na pozadi
				onBlur={onBlurWrap}
				onPressEnter={onPressEnterWrap}
			/>
		</Form.Item>
	)
}

export default React.memo(RawInput)

const refBlur = (ref: any) => ref?.blur()

type WrappedComponent = InputProps & {
	onBlurFn: (value: any, onBlurParam1?: any, onBlurParam2?: any, onBlurParam3?: any, onBlurParam4?: any, onBlurParam5?: any) => any
	onBlurParam1: any
	onBlurParam2?: any
	onBlurParam3?: any
	onBlurParam4?: any
	onBlurParam5?: any
	resetOnBlur?: boolean
}

const RawInputWrapp: FC<WrappedComponent> = (props) => {
	const { disabled, onBlurFn, onBlurParam1, onBlurParam2, onBlurParam3, onBlurParam4, onBlurParam5, value, size, resetOnBlur, style, className, readOnly } = props

	const onBlur = useCallback(
		(val) => {
			onBlurFn(val, onBlurParam1, onBlurParam2, onBlurParam3, onBlurParam4, onBlurParam5)
		},
		[onBlurFn, onBlurParam1, onBlurParam2, onBlurParam3, onBlurParam4, onBlurParam5]
	)

	return (
		<RawInput
			value={value}
			disabled={disabled}
			resetOnBlur={resetOnBlur}
			smallInput
			readOnly={readOnly}
			onBlur={onBlur}
			size={size}
			style={style}
			className={className}
			onPressEnter={refBlur}
		/>
	)
}

export const RawInputWrapper = React.memo(RawInputWrapp)
