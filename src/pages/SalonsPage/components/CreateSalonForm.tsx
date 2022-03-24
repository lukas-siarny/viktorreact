import React from 'react'
import { getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// interfaces
import { IStructuredAddress } from '../../../types/interfaces'

// components
import AddressFields from '../../../components/AddressFields'

// utils
import { FORM } from '../../../utils/enums'

// types
import { RootState } from '../../../reducers'

type ComponentProps = {}

// TODO use correct (full) type definition
type TempSalonFormDefinition = Pick<IStructuredAddress, 'city' | 'country' | 'street'>

type Props = InjectedFormProps<TempSalonFormDefinition, ComponentProps> & ComponentProps

const CreateSalonForm = (props: Props) => {
	const { submitting, handleSubmit, change } = props
	const { t } = useTranslation()

	const formValues = useSelector((state: RootState) => getFormValues(FORM.DESTINATION_FORM)(state))

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<AddressFields latitude={get(formValues, 'latitude')} longtitude={get(formValues, 'longtitude')} changeFormFieldValue={change} />
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
	destroyOnUnmount: true
})(CreateSalonForm)

export default form
