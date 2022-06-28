import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { change, Field } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'

// atoms
import InputField from '../atoms/InputField'
import PhonePrefixField from '../atoms/PhonePrefixField'

// reducers
import { RootState } from '../reducers'

// utils
import { validationPhone } from '../utils/helper'
import i18n from '../utils/i18n'
import { ENUMERATIONS_KEYS, FORM, LANGUAGE } from '../utils/enums'

// assets
import { ReactComponent as SK_Flag } from '../assets/flags/SK.svg'
import { ReactComponent as EN_Flag } from '../assets/flags/GB.svg'
import { ReactComponent as CZ_Flag } from '../assets/flags/CZ.svg'
import { ReactComponent as HU_Flag } from '../assets/flags/HU.svg'
import { ReactComponent as RO_Flag } from '../assets/flags/RO.svg'
import { ReactComponent as BG_Flag } from '../assets/flags/BG.svg'
import { ReactComponent as IT_Flag } from '../assets/flags/IT.svg'

type Props = {
	formName?: FORM
	placeholder?: string
	label?: string
	size?: string
	prefixName?: string
	phoneName?: string
	required?: boolean
	disabled?: boolean
	className?: string
	style?: React.CSSProperties
}

const fallbackOptions = [
	{
		key: 1,
		label: '+421',
		value: LANGUAGE.SK,
		flag: SK_Flag
	},
	{
		key: 2,
		label: '+420',
		value: LANGUAGE.CZ,
		flag: CZ_Flag
	},
	{
		key: 3,
		label: '+44',
		value: LANGUAGE.EN,
		flag: EN_Flag
	},
	{
		key: 4,
		label: '+36',
		value: LANGUAGE.HU,
		flag: HU_Flag
	},
	{
		key: 5,
		label: '+40',
		value: LANGUAGE.RO,
		flag: RO_Flag
	},
	{
		key: 6,
		label: '+359',
		value: LANGUAGE.BG,
		flag: BG_Flag
	},
	{
		key: 7,
		label: '+39',
		value: LANGUAGE.IT,
		flag: IT_Flag
	}
] as any

const PhoneWithPrefixField = (props: Props) => {
	const { placeholder, label, size, prefixName = 'phonePrefixCountryCode', phoneName = 'phone', disabled, required = false, className, style, formName } = props
	const prefixOptions = useSelector((state: RootState) => state?.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const dispatch = useDispatch()
	const [fallbackDefaultValue, setFallbackDefaultValue] = useState<string>('')

	let options = prefixOptions?.enumerationsOptions
	if (!options || options.length === 0) options = fallbackOptions

	useEffect(() => {
		i18n.on('languageChanged', (language) => {
			setFallbackDefaultValue(language)
		})
	}, [])

	useEffect(() => {
		if (formName) {
			dispatch(change(formName, prefixName, fallbackDefaultValue))
		}
	}, [formName, prefixName, fallbackDefaultValue])

	return (
		<Row gutter={8} wrap={false} className={className} style={style}>
			<Col>
				<Field
					label={label}
					component={PhonePrefixField}
					name={prefixName}
					size={size}
					options={options}
					loading={prefixOptions?.isLoading}
					defaultValue={fallbackDefaultValue}
					required={required}
					disabled={disabled}
					className='phone-prefix'
				/>
			</Col>
			<Col flex='auto'>
				<Field
					label={label ? ' ' : undefined}
					component={InputField}
					placeholder={placeholder}
					name={phoneName}
					size={size}
					disabled={disabled}
					validate={validationPhone}
				/>
			</Col>
		</Row>
	)
}

export default PhoneWithPrefixField
