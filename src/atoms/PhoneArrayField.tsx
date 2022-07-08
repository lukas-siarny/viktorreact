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
import { FORM, STRINGS } from '../utils/enums'
import PhoneWithPrefixField from '../components/PhoneWithPrefixField'

const { Item } = Form

type Props = WrappedFieldArrayProps & {
	requied?: boolean
	requiedAtLeastOne?: boolean
	disabled?: boolean
	style?: React.CSSProperties
	// 0 = infinite count
	maxCount?: number
}

const PhoneArrayField = (props: Props) => {
	const { fields, disabled, requied, requiedAtLeastOne, style, maxCount = 5 } = props
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
			{t('loc:Pridať telefón')}
		</Button>
	)

	return (
		<Item label={t('loc:Telefón')} required={requied || requiedAtLeastOne} style={style}>
			<div className={'flex flex-col gap-4 w-full'}>
				{fields.map((field: any, index: any) => {
					return (
						<div key={index} className={'flex gap-2'}>
							<PhoneWithPrefixField
								placeholder={t('loc:Zadajte telefón')}
								prefixName={`${field}.phonePrefixCountryCode`}
								phoneName={`${field}.phone`}
								size={'large'}
								disabled={disabled}
								formName={FORM.SUPPORT_CONTACT}
								className={'m-0 w-full noti-phone-prefix-array'}
								required
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

export default PhoneArrayField
