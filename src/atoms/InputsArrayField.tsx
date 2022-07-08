import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, WrappedFieldArrayProps } from 'redux-form'
import { Button, Form } from 'antd'

// components
import DeleteButton from '../components/DeleteButton'

// helpers

// assets
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon-16.svg'
import InputField from './InputField'
import { validationRequired } from '../utils/helper'
import { STRINGS } from '../utils/enums'

const { Item } = Form

type Props = WrappedFieldArrayProps & {
	entityName: string
	requied?: boolean
	requiedAtLeastOne?: boolean
	disabled?: boolean
	label: string
	style?: React.CSSProperties
	// 0 = infinite count
	maxCount?: number
}

const InputsArrayField = (props: Props) => {
	const { fields, disabled, requied, requiedAtLeastOne, entityName, label, style, maxCount = 5 } = props
	const [t] = useTranslation()

	const getRequiedValidation = (index: number) => {
		if (requied) {
			return validationRequired
		}
		if (requiedAtLeastOne && index === 0) {
			return validationRequired
		}
		return undefined
	}

	const buttonAdd = (
		<Button onClick={() => fields.push('')} icon={<PlusIcon className={'text-notino-black'} />} className={'noti-btn mt-2'} type={'default'} size={'small'} disabled={disabled}>
			{STRINGS(t).addRecord(entityName)}
		</Button>
	)

	return (
		<Item label={label} required={requied || requiedAtLeastOne} style={style}>
			<div className={'flex flex-col gap-4 w-full'}>
				{fields.map((field: any, index: any) => {
					return (
						<div key={index} className={'flex gap-2'}>
							<Field
								className={'flex-1 m-0'}
								component={InputField}
								name={`${field}.email`}
								size={'large'}
								placeholder={STRINGS(t).enter(entityName)}
								disabled={disabled}
								validate={getRequiedValidation(index)}
							/>

							<DeleteButton
								className={'bg-red-100 mt-2'}
								onClick={() => fields.remove(index)}
								onlyIcon
								smallIcon
								noConfirm
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
