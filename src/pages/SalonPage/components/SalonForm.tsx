import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'

// enums
import { FORM } from '../../../utils/enums'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// atoms
import InputField from '../../../atoms/InputField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import OpeningHours from './OpeningHours'
import SwitchField from '../../../atoms/SwitchField'

type ComponentProps = {}

type Props = InjectedFormProps<IUserAccountForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Salón')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} />
					<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} />
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} disabled />
					<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
				</Row>
			</Col>
			<Col>
				<Row className={'mx-9 h-full block'} justify='center'>
					<Field component={InputField} placeholder={t('loc:poznámku')} name={'openingHoursNote'} size={'small'} />
					<div className={'vertical-divider-lg'} />
					<h4>{t('loc:Otváracie hodiny')}</h4>
					<Field component={SwitchField} label={t('loc:Pon - Pi rovnaké otváracie hodiny')} name={'sameOpenHoursOverWeek'} size={'middle'} />
					<FieldArray component={OpeningHours} name={'openingHours'} />
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<IUserAccountForm, ComponentProps>({
	form: FORM.SALON,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateSalonForm
})(UserAccountForm)

export default form
