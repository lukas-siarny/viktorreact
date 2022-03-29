import React, { FC } from 'react'
import { Field, FieldArray, Fields, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import OpeningHours from './OpeningHours'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import DateRangeField from '../../../atoms/DateRangeField'

// enums
import { FORM } from '../../../utils/enums'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

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
					<div className={'vertical-divider-lg mt-0 mb-4'} />
					<h3>{t('loc:Otváracie hodiny')}</h3>
					<Field className={'mb-0'} component={SwitchField} label={t('loc:Pon - Pi rovnaké otváracie hodiny')} name={'sameOpenHoursOverWeek'} size={'middle'} />
					<FieldArray component={OpeningHours} name={'openingHours'} />
					<Col className={'flex mt-4 justify-between'}>
						<Field className={'w-12/25'} label={t('loc:Poznámka')} component={InputField} placeholder={t('loc:poznámku')} name={'note'} size={'middle'} />
						<div className={'w-12/25'}>
							<Fields
								labels={[t('loc:Platnosť'), ' ']}
								names={['noteFrom', 'noteTo']}
								placeholders={[t('loc:čas od'), t('loc:čas do')]}
								component={DateRangeField}
								hideHelp
								allowClear
								itemClassName={'m-0'}
							/>
						</div>
					</Col>
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
