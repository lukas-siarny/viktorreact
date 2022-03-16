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
import { ILoginForm } from '../../../types/interfaces'

// validate
import validateCreateUserAccountForm from './validateCreateUserAccountForm'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

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
					<Field
						component={InputField}
						label={t('loc:Telefónne číslo')}
						placeholder={t('loc:Zadajte telefónne číslo')}
						name={'phone'}
						size={'large'}
						addonBefore={
							<Field
								className={'addon-before'}
								component={SelectField}
								placeholder={t('loc:Vyber predvoľbu')}
								options={[
									{ label: '+421', value: 'SK' },
									{ label: '+420', value: 'CZ' }
								]}
								name={'phonePrefixCountryCode'}
								size={'large'}
								required
							/>
						}
						required
					/>
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

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.ADMIN_CREATE_USER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCreateUserAccountForm
})(CreateUserAccountForm)

export default form
