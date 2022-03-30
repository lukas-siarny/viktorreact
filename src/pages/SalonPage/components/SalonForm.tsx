import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import OpeningHours from './OpeningHours'
import AddressFields from '../../../components/AddressFields'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'

// enums
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'

// types
import { IUserAccountForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// reducers
import { RootState } from '../../../reducers'
import ImgUploadField from '../../../atoms/ImgUploadField'

type ComponentProps = {
	openNoteModal: Function
}

type Props = InjectedFormProps<IUserAccountForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, openNoteModal } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col>
				<Row className={'mx-9'}>
					<h3 className={'mb-0 mt-3'}>{t('loc:Základné informácie o salóne')}</h3>
					<Divider className={'mb-3 mt-3'} />
				</Row>
			</Col>
			<Col className={'flex'}>
				<Row className={'mx-9 h-full block w-1/2'} justify='center'>
					<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} required />
					<Field component={TextareaField} label={t('loc:O nás')} name={'aboutUsFirst'} size={'large'} />
					<Field component={TextareaField} label={t('loc:Doplnujúci popis')} name={'aboutUsSecond'} size={'large'} />
				</Row>
				<Row className={'mx-9 h-full block w-1/2'} justify='center'>
					<Field
						className={'m-0'}
						component={ImgUploadField}
						name={'logo'}
						label={t('loc:Logo')}
						signUrl={URL_UPLOAD_IMAGES}
						multiple={false}
						required
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
				</Row>
			</Col>
			<Col span={24}>
				<Row className={'mx-9 mb-2 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Adresa')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field
						component={AddressFields}
						inputValues={{
							latitude: get(formValues, 'latitude'),
							longitude: get(formValues, 'longitude'),
							city: get(formValues, 'city'),
							street: get(formValues, 'street'),
							zip: get(formValues, 'zipCode'),
							country: get(formValues, 'country')
						}}
						changeFormFieldValue={change}
						name={'address'}
					/>
				</Row>
			</Col>
			<Col>
				<Row className={'mx-9 h-full block'} justify='center'>
					<div className={'vertical-divider-lg mt-0 mb-4'} />
					<div className={'flex justify-between items-center w-full mb-4'}>
						<h3 className={'mb-0'}>{t('loc:Otváracie hodiny')}</h3>
						<Button type={'primary'} size={'middle'} className={`noti-btn w-1/4`} onClick={() => openNoteModal()}>
							{t('loc:Pridať poznámku')}
						</Button>
					</div>
					<Field className={'mb-0'} component={SwitchField} label={t('loc:Pon - Pi rovnaké otváracie hodiny')} name={'sameOpenHoursOverWeek'} size={'middle'} />
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
