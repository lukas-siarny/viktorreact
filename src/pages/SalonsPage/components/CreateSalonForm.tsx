import React from 'react'
import { getFormValues, InjectedFormProps, reduxForm, Field } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import AddressFields, { AddressInputFields } from '../../../components/AddressFields'

// utils
import { FORM } from '../../../utils/enums'

// types
import { RootState } from '../../../reducers'

// validation
import validateCreateSalonForm from './validateCreateSalonForm'

type ComponentProps = {}

// TODO: use correct (full) type definition
// NOTE: let address property in Type definition. Property represents global wrapper for address subfields validation
export type TempSalonFormDefinition = AddressInputFields & {
	address?: string
}

type Props = InjectedFormProps<TempSalonFormDefinition, ComponentProps> & ComponentProps

const CreateSalonForm = (props: Props) => {
	const { submitting, handleSubmit, change } = props
	const { t } = useTranslation()

	const formValues = useSelector((state: RootState) => getFormValues(FORM.CREATE_SALON_FROM)(state))

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Field
				component={AddressFields}
				inputValues={{
					latitude: get(formValues, 'latitude'),
					longitude: get(formValues, 'longitude'),
					city: get(formValues, 'city'),
					street: get(formValues, 'street'),
					zip: get(formValues, 'zip'),
					country: get(formValues, 'country')
				}}
				changeFormFieldValue={change}
				name='address'
			/>
			<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
				{t('loc:Zmeniť')}
			</Button>
		</Form>
	)
}

const form = reduxForm<TempSalonFormDefinition, ComponentProps>({
	form: FORM.CREATE_SALON_FROM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCreateSalonForm
})(CreateSalonForm)

export default form
