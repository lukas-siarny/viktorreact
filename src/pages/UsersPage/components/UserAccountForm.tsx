import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// utils
import { optionRenderWithImage, showErrorNotification } from '../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_FILE } from '../../../utils/enums'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-icon.svg'

// reducers
import { RootState } from '../../../reducers'

// schema
import { IUserAccountForm, validationEditUserFn } from '../../../schemas/user'

type ComponentProps = {}

type Props = InjectedFormProps<IUserAccountForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	return (
		<Form layout={'vertical'} id={`${FORM.USER_ACCOUNT}-form`} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 flex items-center'}>
						<InfoIcon className={'text-notino-black mr-2 medium-icon'} /> {t('loc:Osobné údaje')}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex space-between w-full'}>
						<Field
							className={'m-0 mr-3'}
							component={ImgUploadField}
							name={'avatar'}
							label={t('loc:Avatar')}
							signUrl={URL_UPLOAD_FILE}
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
						required
						formName={FORM.USER_ACCOUNT}
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
	validate: validationEditUserFn
})(UserAccountForm)

export default form
