import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// schema
import { ICreateUserForm, validationCreateUserFn } from '../../../schemas/user'

// reducers
import { RootState } from '../../../reducers'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// utils
import { ENUMERATIONS_KEYS, FORM } from '../../../utils/enums'
import { optionRenderWithImage, showErrorNotification } from '../../../utils/helper'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

type ComponentProps = {}

type Props = InjectedFormProps<ICreateUserForm, ComponentProps> & ComponentProps

const CreateUserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	const roles = useSelector((state: RootState) => state.roles.systemRoles)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Vytvoriť používateľa')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
					<PhoneWithPrefixField
						label={'Telefón'}
						placeholder={t('loc:Zadajte telefón')}
						size={'large'}
						prefixName={'phonePrefixCountryCode'}
						phoneName={'phone'}
						formName={FORM.ADMIN_CREATE_USER}
						required
					/>
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
						name={'assignedCountryCode'}
						label={t('loc:Predvolená krajina')}
						placeholder={t('loc:Vyberte krajinu')}
						allowClear
						size={'large'}
						filterOptions
						onDidMountSearch
						options={countries?.enumerationsOptions}
						loading={countries?.isLoading}
						disabled={countries?.isLoading}
					/>
					<Field
						component={SelectField}
						options={roles?.data}
						label={t('loc:Rola')}
						placeholder={t('loc:Vyberte rolu')}
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
	onSubmitFail: showErrorNotification,
	validate: validationCreateUserFn
})(CreateUserAccountForm)

export default form
