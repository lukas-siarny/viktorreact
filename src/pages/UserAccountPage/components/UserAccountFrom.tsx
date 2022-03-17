import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'
import cx from 'classnames'

// enums
import { FORM } from '../../../utils/enums'

// types
import { ILoginForm } from '../../../types/interfaces'

// validate
import validateUserAccountForm from './validateUserAccountForm'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

type ComponentProps = {
	isCompany: boolean
}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, isCompany } = props

	const editClass = cx({
		'w-2/4': isCompany,
		'w-full': !isCompany
	})

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={`${editClass} mx-9 h-full block`} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Osobné údaje')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} />
					<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} />
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} disabled />
					<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
				</Row>
				{isCompany ? (
					<Row className={'mx-9 w-2/4 h-full block'} justify='center'>
						<h3 className={'mb-0 mt-3'}>{t('loc:Firma')}</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'companyName'} size={'large'} required />
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:IČO')}
								placeholder={t('loc:Zadajte ičo')}
								name={'businessID'}
								size={'large'}
								required
							/>
							<Field className={'w-12/25'} component={InputField} label={t('loc:IČ DPH')} placeholder={t('loc:Zadajte ič dph')} name={'vatID'} size={'large'} />
						</Row>
						<Field component={InputField} label={t('loc:Ulica')} placeholder={t('loc:Zadajte ulicu')} name={'street'} size={'large'} required />
						<Row justify={'space-between'}>
							<Field className={'w-12/25'} component={InputField} label={t('loc:Mesto')} placeholder={t('loc:Zadajte mesto')} name={'city'} size={'large'} required />
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:PSČ')}
								placeholder={t('loc:Zadajte smerovacie číslo')}
								name={'zipCode'}
								size={'large'}
								required
							/>
						</Row>
						<Field
							component={SelectField}
							label={t('loc:Štát')}
							placeholder={t('loc:Vyber krajinu')}
							options={[
								{ label: 'Slovakia', value: 'SK' },
								{ label: 'Czechia', value: 'CZ' }
							]}
							name={'countryCode'}
							size={'large'}
							required
						/>
					</Row>
				) : undefined}
			</Col>
		</Form>
	)
}

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.USER_ACCOUNT_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateUserAccountForm
})(UserAccountForm)

export default form
