import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { WrappedFieldInputProps, WrappedFieldProps } from 'redux-form'
import { PopConfirmComponentProps } from '../../../components/PopConfirmComponent'

export type CheckboxOption = {
	id: string
	value: number
	label?: string
	disabled?: boolean
	image?: Object
	extraAction?: {
		label: string
		action: () => void
		disabled?: boolean
		icon?: React.ReactNode
		popconfirm?: boolean
		popconfirmProps?: PopConfirmComponentProps
	}
}

interface IMultiselectInput extends Omit<WrappedFieldInputProps, 'value'> {
	value: Array<number>
}

type ComponentProps = {
	options: Array<CheckboxOption>
	label?: string
	input: IMultiselectInput
	required?: boolean
}

type Props = Omit<WrappedFieldProps, 'input'> & ComponentProps

const CheckboxGroupImageField = (props: Props) => {
	const {
		input,
		options,
		label,
		required,
		meta: { error, touched }
	} = props

	const { onChange, value } = input
	const checkedValues = useMemo(() => value || [], [value])

	const onInputChange = useCallback(
		(onChangeValue: number, checked: boolean) => {
			const newCheckedValues = checked ? checkedValues.filter((val) => val !== onChangeValue) : [...checkedValues, onChangeValue]
			onChange(newCheckedValues)
		},
		[checkedValues, onChange]
	)

	const errorMsg = error && touched ? error : undefined

	return (
		<>
			<fieldset className={cx('checkbox-group-image-fieldset', { error: errorMsg, required })}>
				<div className={'label-error-wrapper'}>
					<legend className={cx({ required })}>{label}</legend>
					{errorMsg && <span className={'ant-form-item-explain-error error-msg'}>{errorMsg}</span>}
				</div>
				<div className={cx('checkbox-group-image-wrapper', { error: errorMsg })}>
					{options?.map((option) => {
						const checked = checkedValues.includes(option.value)
						return (
							<div className={cx('checkbox-with-image', { checked, disabled: option.disabled })} key={option.id}>
								<label htmlFor={option.id}>
									<input type='checkbox' name={input.name} id={option.id} checked={checked} onChange={() => onInputChange(option.value, checked)} />
									<div className='inner-wrapper' style={{ backgroundImage: `url("${option.image}")` }}>
										<span className={'checker'} />
										<span className={'label'}>{option.label}</span>
									</div>
								</label>
								{option.extraAction && (
									<button type={'button'} onClick={option.extraAction?.action} disabled={option.extraAction?.disabled || option.disabled}>
										{option.extraAction?.label}
										{option.extraAction?.icon}
									</button>
								)}
							</div>
						)
					})}
				</div>
			</fieldset>
		</>
	)
}

export default CheckboxGroupImageField
