import React, { FC, useCallback } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import i18next from 'i18next'
import OpeningHours from './OpeningHours'
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import SelectField from '../../../atoms/SelectField'

// utils
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// reducers
import { RootState } from '../../../reducers'
import ImgUploadField from '../../../atoms/ImgUploadField'

// assets
import { ReactComponent as InstagramIcon } from '../../../assets/icons/social-instagram-icon.svg'
import { ReactComponent as FacebookIcon } from '../../../assets/icons/social-facebook-icon.svg'
import { ReactComponent as CreditCardIcon } from '../../../assets/icons/credit-card-outlined-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as PhoneIcon } from '../../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as UserIcon } from '../../../assets/icons/user-icon.svg'
import { getUsers } from '../../../reducers/users/userActions'

type ComponentProps = {
	openNoteModal: Function
	isAdmin: boolean
	changeSalonVisibility: (visible: boolean) => void
	publishSalon: (published: boolean) => void
	switchDisabled: boolean
	salonID?: number
}

type Props = InjectedFormProps<IUserAccountForm, ComponentProps> & ComponentProps

// validate user select only if auth user have SUPER ADMIN or ADMIN permissions
const validateUsersSelect = (value: string, formValues: any, props: any) => {
	if (!value && props?.isAdmin) {
		return i18next.t('loc:Toto pole je povinné')
	}
	return undefined
}

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, change, openNoteModal, isAdmin, changeSalonVisibility, publishSalon, switchDisabled, salonID } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	const onSearchUsers = useCallback(
		async (searchText: string, page: number) => {
			// roleID = 3 for PARTNER users
			const { data, usersOptions } = await dispatch(getUsers(page, undefined, undefined, searchText, 3))
			return { pagination: data?.pagination?.page, data: usersOptions }
		},
		[dispatch]
	)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<div className={'flex justify-between w-full items-center'}>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<InfoIcon className={'text-notino-black mr-2'} />
								{t('loc:Základné údaje')}
							</h3>
							{salonID ? (
								<Permissions
									allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_EDIT]}
									render={(hasPermission, { openForbiddenModal }) => (
										<div className={'flex justify-between w-1/2'}>
											<Field
												className={'mt-2 mb-2 w-12/25'}
												component={SwitchField}
												label={t('loc:Viditeľný')}
												name={'isVisible'}
												size={'middle'}
												required
												customOnChange={(value: boolean) => {
													if (!hasPermission) {
														openForbiddenModal()
													} else {
														changeSalonVisibility(value)
													}
												}}
												disabled={switchDisabled}
											/>
											<Field
												className={'mt-2 mb-2 w-12/25'}
												component={SwitchField}
												label={t('loc:Publikovaný')}
												name={'isPublished'}
												size={'middle'}
												required
												customOnChange={(value: boolean) => {
													if (!hasPermission) {
														openForbiddenModal()
													} else {
														publishSalon(value)
													}
												}}
												disabled={switchDisabled}
											/>
										</div>
									)}
								/>
							) : null}
						</div>
						<Divider className={'mb-3 mt-3'} />

						<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} required />
						<Field component={TextareaField} label={t('loc:O nás')} name={'aboutUsFirst'} size={'large'} />
						<Field component={TextareaField} label={t('loc:Doplňujúci popis')} name={'aboutUsSecond'} size={'large'} />
						<Field
							className={'m-0'}
							component={ImgUploadField}
							name={'logo'}
							label={t('loc:Logo')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple={false}
							maxCount={1}
							category={UPLOAD_IMG_CATEGORIES.SALON}
						/>
						<Field
							className={'m-0'}
							component={ImgUploadField}
							name={'gallery'}
							label={t('loc:Fotogaléria')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple
							required
							maxCount={10}
							category={UPLOAD_IMG_CATEGORIES.SALON}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<PhoneIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Kontaktné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<PhoneWithPrefixField
							label={'Telefón'}
							placeholder={t('loc:Zadajte telefón')}
							size={'large'}
							prefixName={'phonePrefixCountryCode'}
							phoneName={'phone'}
							required
						/>
						<Field className={'w-full'} component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
						<Field
							component={AddressFields}
							inputValues={{
								latitude: get(formValues, 'latitude'),
								longitude: get(formValues, 'longitude'),
								city: get(formValues, 'city'),
								street: get(formValues, 'street'),
								zipCode: get(formValues, 'zipCode'),
								country: get(formValues, 'country')
							}}
							changeFormFieldValue={change}
							name={'address'}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<TimerIcon width={24} height={24} className={'text-notino-black mr-2'} /> {t('loc:Otváracie hodiny')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field className={'mb-0'} component={SwitchField} label={t('loc:Pon - Pi rovnaké otváracie hodiny')} name={'sameOpenHoursOverWeek'} size={'middle'} />
						<FieldArray component={OpeningHours} name={'openingHours'} />
						<Button type={'primary'} size={'middle'} className={`noti-btn w-1/4 mb-6 mt-3`} onClick={() => openNoteModal()}>
							{t('loc:Pridať poznámku')}
						</Button>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<CreditCardIcon className={'text-notino-black mr-2'} />
							{t('loc:Možnosti platby')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field component={InputField} label={t('loc:Iné spôsoby platby')} name={'otherPaymentMethods'} size={'large'} />
						<Field className={'mb-6'} component={SwitchField} label={t('loc:Platba kartou')} name={'payByCard'} size={'middle'} required />
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0'}>{t('loc:Sociálne siete')}</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field component={InputField} label={t('loc:Facebook')} name={'socialLinkFB'} size={'large'} prefix={(<FacebookIcon />) as any} />
						<Field component={InputField} label={t('loc:Instagram')} name={'socialLinkInstagram'} size={'large'} prefix={(<InstagramIcon />) as any} />
						<Field component={InputField} label={t('loc:Webstránka')} name={'socialLinkWebPage'} size={'large'} />
					</Col>
				</Row>

				{/* show this block only if auth user have SUPER ADMIN or ADMIN permissions */}
				{isAdmin ? (
					<Row>
						<Col span={24}>
							<h3 className={'mb-0 flex items-center'}>
								<UserIcon width={20} height={20} className={'text-notino-black mr-2'} />
								{t('loc:Oprávnenie')}
							</h3>
							<Divider className={'mb-3 mt-3'} />
							<Field
								component={SelectField}
								label={t('loc:Používateľ')}
								placeholder={t('loc:Vyber používateľa')}
								name={'userID'}
								size={'large'}
								validate={validateUsersSelect}
								onSearch={onSearchUsers}
								optionLabelProp={'label'}
								filterOption={true}
								labelInValue
								showSearch
								allowInfinityScroll
								required
							/>
						</Col>
					</Row>
				) : undefined}
			</Space>
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
