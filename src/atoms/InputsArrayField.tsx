import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, WrappedFieldArrayProps } from 'redux-form'
import { Button, Form } from 'antd'

// components
import DeleteButton from '../components/DeleteButton'

// atoms
import InputField from './InputField'
import InputNumberField from './InputNumberField'

// helpers
import { DELETE_BUTTON_ID, STRINGS } from '../utils/enums'

// assets
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon-16.svg'
import { formFieldID } from '../utils/helper'

const { Item } = Form

type Props = WrappedFieldArrayProps & {
	entityName: string
	required?: boolean
	disabled?: boolean
	label: string
	style?: React.CSSProperties
	// 0 = infinite count
	maxCount?: number
	nestedFieldName?: string
	inputSize?: string
	placeholder?: string
	type?: string
	emptyValue?: any
	// custom delete ak sa vyzaduje aj BE delete na onConfirm nie len odstranenie na FE cez remove index
	handleDelete?: (id: any, removeIndex: (index: number) => void, index: number) => any
}

const InputsArrayField = (props: Props) => {
	const { fields, disabled, handleDelete, required, entityName, label, style, maxCount = 5, nestedFieldName, inputSize = 'large', placeholder, type = 'text', emptyValue } = props
	const [t] = useTranslation()

	const buttonAdd = (
		<Button
			onClick={() => fields.push(emptyValue ?? '')}
			icon={<PlusIcon className={'text-notino-black'} />}
			className={'noti-btn mt-2'}
			type={'default'}
			size={'small'}
			disabled={disabled}
		>
			{STRINGS(t).addRecord(entityName)}
		</Button>
	)
	return (
		<Item label={label} required={required} style={style}>
			<div className={'flex flex-col gap-4 w-full'}>
				{fields.map((field: any, index: any) => {
					const fieldData = fields.get(index)
					const onConfirm = async () => {
						if (handleDelete) {
							// fields.remove funkcia sa posiela cela hore aby tam v try-catchi sa pouzila v pripade len ak nenastane BE chyba a zamedzi tym zmazaniu itemu z array ak nastala BE chyba a item nebol zmazany na BE
							await handleDelete(fieldData.id, fields.remove, index)
						}
					}
					return (
						<div key={index} className={'flex gap-2'}>
							<Field
								className={'flex-1 m-0 pb-0'}
								component={type === 'text' ? InputField : InputNumberField}
								name={`${field}.${nestedFieldName ?? entityName}`}
								size={inputSize}
								placeholder={placeholder || STRINGS(t).enter(entityName)}
								disabled={disabled}
								min={0}
							/>

							<DeleteButton
								id={formFieldID(props.meta.form, `${DELETE_BUTTON_ID}-${index}`)}
								className={`bg-red-100 ${inputSize === 'large' ? 'mt-2' : 'mt-1'}`}
								onClick={() => !handleDelete && fields.remove(index)} // FE mazanie
								onConfirm={onConfirm} // BE + FE mazanie
								onlyIcon
								smallIcon
								noConfirm={!handleDelete}
								size={'small'}
								disabled={disabled || fields.length === 1}
							/>
						</div>
					)
				})}
			</div>
			{maxCount ? fields.length < maxCount && buttonAdd : buttonAdd}
		</Item>
	)
}

export default InputsArrayField
