import React from 'react'
import { Row, Col } from 'antd'
import { Field } from 'redux-form'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../atoms/InputField'
import PhonePrefixField from '../atoms/PhonePrefixField'

// reducers
import { RootState } from '../reducers'

type Props = {
	placeholder?: string
	label?: string
	size?: string
	prefixName?: string
	phoneName?: string
}

const fallbackOptions = [{ key: 1, label: '+421', value: 'SK', flag: 'https://flagcdn.com/h20/sk.png' }]
const fallbackDefaultValue = 'SK'

const PhoneWithPrefixField = (props: Props) => {
	const { placeholder, label, size, prefixName = 'phonePrefixCountryCode', phoneName = 'phone' } = props
	const prefixOptions = useSelector((state: RootState) => state.enumerationsStore.countries)

	let options = prefixOptions.enumerationsOptions
	if (options.length === 0) options = fallbackOptions

	return (
		<Row gutter={8} wrap={false}>
			<Col flex='102px'>
				<Field
					label={label}
					component={PhonePrefixField}
					name={prefixName}
					size={size}
					options={options}
					loading={prefixOptions.isLoading}
					defaultValue={fallbackDefaultValue}
				/>
			</Col>
			<Col flex='auto'>
				<Field label={label ? ' ' : undefined} component={InputField} placeholder={placeholder} name={phoneName} size={size} />
			</Col>
		</Row>
	)
}

export default PhoneWithPrefixField
