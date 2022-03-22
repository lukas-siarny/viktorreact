import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// enums
import { FORM } from '../../../utils/enums'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// types
import { ICreateUserForm } from '../../../types/interfaces'

// validate
import validateCreateUserAccountForm from './validateCreateUserAccountForm'

// reducers
import { RootState } from '../../../reducers'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

type ComponentProps = {}

type Props = InjectedFormProps<ICreateUserForm, ComponentProps> & ComponentProps

const CreateUserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const roles = useSelector((state: RootState) => state.roles.roles)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Vytvoriť používateľa')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
					<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
					<Field
						component={SelectField}
						options={roles?.data}
						label={t('loc:Rola')}
						placeholder={t('loc:Vyber rolu')}
						name={'roleID'}
						size={'large'}
						loading={roles?.isLoading}
						required
					/>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<ICreateUserForm, ComponentProps>({
	form: FORM.ADMIN_CREATE_USER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCreateUserAccountForm
})(CreateUserAccountForm)

export default form
