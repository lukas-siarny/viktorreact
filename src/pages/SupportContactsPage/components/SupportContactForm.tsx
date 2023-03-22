import React, { FC, useMemo } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'

// components
import OpeningHours from '../../../components/OpeningHours/OpeningHours'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import InputsArrayField from '../../../atoms/InputsArrayField'
import PhoneArrayField from '../../../atoms/PhoneArrayField'
import SelectField from '../../../atoms/SelectField'

// utils
import { optionRenderWithImage, showErrorNotification } from '../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// types
import { ISupportContactForm } from '../../../types/interfaces'

// validate
import validateSupportContactForm from './validateSupportContactForm'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PhoneIcon } from '../../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

type ComponentProps = {
	disabledForm: boolean
	supportContactID?: string
}

type Props = InjectedFormProps<ISupportContactForm, ComponentProps> & ComponentProps

const SupportContactForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, disabledForm } = props

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact)

	const countriesOptions = useMemo(() => {
		return countries?.enumerationsOptions?.map((country) => {
			const alreadyExists = supportContacts?.data?.supportContacts?.find((supportCountry: any) => supportCountry.country.code === (country.value as string))

			return {
				...country,
				disabled: country?.value !== supportContact?.data?.supportContact?.country.code && !!alreadyExists
			}
		})
	}, [supportContact?.data?.supportContact?.country.code, countries?.enumerationsOptions, supportContacts?.data?.supportContacts])

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
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							label={t('loc:Krajina')}
							placeholder={t('loc:Vyberte krajinu')}
							options={countriesOptions || []}
							name={'countryCode'}
							size={'large'}
							loading={countries?.isLoading || supportContacts?.isLoading}
							required
							disabled={disabledForm}
						/>
						<FieldArray
							component={InputsArrayField}
							name={'emails'}
							props={{ disabled: disabledForm, nestedFieldName: 'email', entityName: t('loc:email'), label: t('loc:Emailové adresy'), required: true }}
						/>
						<FieldArray component={PhoneArrayField} name={'phones'} props={{ disabled: disabledForm, requied: true }} />
						<Row justify={'space-between'}>
							<Field
								className={'w-4/6'}
								component={InputField}
								label={t('loc:Ulica')}
								placeholder={t('loc:Zadajte ulicu')}
								name={'street'}
								size={'large'}
								maxLength={VALIDATION_MAX_LENGTH.LENGTH_75}
								disabled={disabledForm}
							/>
							<Field
								className={'w-3/10'}
								component={InputField}
								label={t('loc:Popisné číslo')}
								placeholder={t('loc:Zadajte číslo')}
								name={'streetNumber'}
								size={'large'}
								maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
								disabled={disabledForm}
							/>
						</Row>
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Mesto')}
								placeholder={t('loc:Zadajte mesto')}
								name={'city'}
								size={'large'}
								maxLength={VALIDATION_MAX_LENGTH.LENGTH_100}
								disabled={disabledForm}
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:PSČ')}
								placeholder={t('loc:Zadajte smerovacie číslo')}
								name={'zipCode'}
								size={'large'}
								maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
								disabled={disabledForm}
							/>
						</Row>
						<Field
							component={TextareaField}
							className={'pb-0'}
							label={t('loc:Poznámka')}
							name={'note'}
							size={'large'}
							placeholder={t('loc:Zadajte doplňujúcu informáciu, napr "3. poschodie vľavo"')}
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
							className={'mb-0 pb-0'}
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
	validate: validateSupportContactForm
})(withPromptUnsavedChanges(SupportContactForm))

export default form
