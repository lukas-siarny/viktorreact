import React from 'react'
import { useTranslation } from 'react-i18next'
import { WrappedFieldArrayProps } from 'redux-form'
import { Button, Form } from 'antd'
import { useSelector } from 'react-redux'
import { map } from 'lodash'

// components
import DeleteButton from '../components/DeleteButton'
import PhoneWithPrefixField from '../components/PhoneWithPrefixField'

// assets
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon.svg'

// utils
import { ENUMERATIONS_KEYS } from '../utils/enums'
import { getPrefixCountryCode } from '../utils/helper'

// reducers
import { RootState } from '../reducers'

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

	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const buttonAdd = (
		<Button
			onClick={() => fields.push({ phonePrefixCountryCode })}
			icon={<PlusIcon className={'text-notino-black'} />}
			className={'noti-btn mt-2'}
			type={'default'}
			size={'small'}
			disabled={disabled}
		>
			{t('loc:Pridať telefón')}
		</Button>
	)

	return (
		<Item label={t('loc:Telefónne čísla')} required={requied || requiedAtLeastOne} style={style}>
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
								className={'m-0 pb-0 w-full gap-2 noti-phone-prefix-array'}
								fallbackDefaultValue={phonePrefixCountryCode}
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
