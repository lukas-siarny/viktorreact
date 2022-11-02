import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// validate
import validateUserAccountForm from './validateUserAccountForm'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'

type ComponentProps = {}

type Props = InjectedFormProps<IUserAccountForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 flex items-center'}>
						<InfoIcon className={'text-notino-black mr-2'} /> {t('loc:Osobné údaje')}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex space-between w-full'}>
						<Field
							className={'m-0 mr-3'}
							component={ImgUploadField}
							name={'avatar'}
							label={t('loc:Avatar')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple={false}
							maxCount={1}
							category={UPLOAD_IMG_CATEGORIES.USER}
						/>

						<div className={'flex-1'}>
							<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} />
							<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} />
						</div>
					</div>
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} disabled />
					<PhoneWithPrefixField
						label={'Telefón'}
						placeholder={t('loc:Zadajte telefón')}
						size={'large'}
						prefixName={'phonePrefixCountryCode'}
						phoneName={'phone'}
						formName={FORM.USER_ACCOUNT}
					/>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<IUserAccountForm, ComponentProps>({
	form: FORM.USER_ACCOUNT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateUserAccountForm
})(UserAccountForm)

export default form
