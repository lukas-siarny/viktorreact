import React, { FC, useCallback, useEffect } from 'react'
import { Space, Row, Form, Button, Col } from 'antd'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'

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

const PhoneWithPrefixField = (props: Props) => {
	const { placeholder, label, size, prefixName = 'phonePrefixCountryCode', phoneName = 'phone' } = props
	const prefixOptions = useSelector((state: RootState) => state.enumerationsStore.countries)

	return (
		<Form.Item label={label}>
			<Row gutter={8}>
				<Col flex='102px'>
					<Field component={PhonePrefixField} name={prefixName} size={size} options={prefixOptions.enumerationsOptions} loading={prefixOptions.isLoading} />
				</Col>
				<Col flex='auto'>
					<Field component={InputField} placeholder={placeholder} name={phoneName} size={size} />
				</Col>
			</Row>
		</Form.Item>
	)
}

export default PhoneWithPrefixField
