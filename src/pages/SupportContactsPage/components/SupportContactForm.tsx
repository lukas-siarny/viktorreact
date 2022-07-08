import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import OpeningHours from '../../../components/OpeningHours/OpeningHours'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// types
import { ISupportContactForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PhoneIcon } from '../../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../../assets/icons/clock-icon.svg'
import InputsArrayField from '../../../atoms/InputsArrayField'
import PhoneArrayField from '../../../atoms/PhoneArrayField'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	openNoteModal: Function
	disabledForm: boolean
	supportContactID?: number
}

type Props = InjectedFormProps<ISupportContactForm, ComponentProps> & ComponentProps

const SupportContactForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, disabledForm } = props

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES_FILTER_OPTIONS])

	const countryOptionRender = (itemData: any) => {
		const { value, label, flag } = itemData
		return (
			<div className='flex items-center'>
				<img className='noti-flag w-6 mr-1 rounded' src={flag} alt={value} />
				{label}
			</div>
		)
	}

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<PhoneIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Kontaktné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<FieldArray
							component={InputsArrayField}
							name={'email'}
							props={{ disabled: disabledForm, entityName: t('loc:email'), label: t('loc:Email'), requied: true }}
						/>
						<FieldArray component={PhoneArrayField} name={'phone'} props={{ disabled: disabledForm, requied: true }} />
						<Field
							component={SelectField}
							optionRender={countryOptionRender}
							label={t('loc:Štát')}
							placeholder={t('loc:Vyber krajinu')}
							options={countries?.enumerationsOptions || []}
							name={'countryCode'}
							size={'large'}
							loading={countries?.isLoading}
							allowClear
							required
						/>
						<Row justify={'space-between'}>
							<Field className={'w-4/5'} component={InputField} label={t('loc:Ulica')} placeholder={t('loc:Zadajte ulicu')} name={'street'} size={'large'} />
							<Field
								className={'w-1/6'}
								component={InputField}
								label={t('loc:Popisné číslo')}
								placeholder={t('loc:Zadajte číslo')}
								name={'streetNumber'}
								size={'large'}
							/>
						</Row>
						<Row justify={'space-between'}>
							<Field className={'w-12/25'} component={InputField} label={t('loc:Mesto')} placeholder={t('loc:Zadajte mesto')} name={'city'} size={'large'} />
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:PSČ')}
								placeholder={t('loc:Zadajte smerovacie číslo')}
								name={'zipCode'}
								size={'large'}
							/>
						</Row>
						<Field
							component={TextareaField}
							label={t('loc:Poznámka')}
							name={'note'}
							size={'large'}
							placeholder={t('loc:Zadajte doplňujúcu informáciu, napr "3. poschodie v ľavo"')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
							showLettersCount
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<TimerIcon width={24} height={24} className={'text-notino-black mr-2'} /> {t('loc:Otváracie hodiny')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field
							className={'mb-0'}
							component={SwitchField}
							label={t('loc:Pon - Pi rovnaké otváracie hodiny')}
							name={'sameOpenHoursOverWeek'}
							size={'middle'}
							disabled={disabledForm}
						/>
						<FieldArray component={OpeningHours} name={'openingHours'} props={{ disabled: disabledForm }} />
					</Col>
				</Row>
			</Space>
		</Form>
	)
}

const form = reduxForm<ISupportContactForm, ComponentProps>({
	form: FORM.SUPPORT_CONTACT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateSalonForm
})(SupportContactForm)

export default form
