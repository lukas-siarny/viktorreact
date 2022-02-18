import React, { useCallback, FC } from 'react'
import { Form, InputNumber, InputNumberProps, InputProps } from 'antd'
import { BaseFieldsProps, WrappedFieldsProps } from 'redux-form'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { get, last, map, split } from 'lodash'

const { Item } = Form

type Props = WrappedFieldsProps &
	FormItemLabelProps &
	InputNumberProps &
	InputProps &
	BaseFieldsProps & {
		extraValidation?: boolean
	}

const FieldItem: FC<{ name: string; topProp: any; index: number }> = ({ name, topProp, index }) => {
	// NOTE: split kvoli tomu ak by bol field wrapnuty v FormSectione a ten by posielal names ako formSectionName.inputName
	const input = get(topProp, `[${last(split(name, '.'))}].input`) as InputNumberProps
	const onChange = useCallback(
		(val) => {
			if (input.onChange) {
				if (val) {
					input.onChange(Number(val))
				} else {
					input.onChange(null as any)
				}
			}
		},
		[input]
	)
	return (
		<InputNumber
			key={name}
			className={'mr-2'}
			onChange={onChange}
			size={topProp.size || 'middle'}
			value={input.value}
			placeholder={get(topProp.placeholders, `[${index}]`) as any}
			type={'number'}
			min={topProp.min || -99999999}
			max={topProp.max || 999999999}
			disabled={topProp.disabled}
		/>
	)
}

const InputRangeField = (props: Props) => {
	const { names, label, required } = props

	return (
		<Item label={label} required={required}>
			<div className={'flex'}>
				{map(names, (name, index: number) => (
					<FieldItem topProp={props} name={name} index={index} />
				))}
			</div>
		</Item>
	)
}

export default React.memo(InputRangeField)
