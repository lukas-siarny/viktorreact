import React, { FC, useMemo } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Button } from 'antd'
import { useSelector } from 'react-redux'

// utils
import { DELETE_BUTTON_ID, ENUMERATIONS_KEYS, FORM, STRINGS, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, optionRenderWithImage, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// atoms
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'

// types
import { ISmsUnitPricesForm } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// validate
import validateSmsUnitPricesForm from './validateSmsUnitPricesForm'
import DateField from '../../../atoms/DateField'

type ComponentProps = {
	smsUnitPriceID?: string
	closeForm: () => void
	onDelete: () => void
	disabledForm?: boolean
}

type Props = InjectedFormProps<ISmsUnitPricesForm, ComponentProps> & ComponentProps

const SmsUnitPricesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, smsUnitPriceID, closeForm, onDelete, submitting, pristine, disabledForm } = props

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const currenices = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])
	const specialistContacts = useSelector((state: RootState) => state.specialistContacts.specialistContacts)
	const formValues: Partial<ISmsUnitPricesForm> = useSelector((state: RootState) => getFormValues(FORM.SMS_UNIT_PRICES_FORM)(state))
	const currencySymbol = currenices.data?.find((currency) => currency.code === formValues?.countryCode)?.symbol

	const countriesOptions = useMemo(() => {
		const selectedSpecialistContact = smsUnitPriceID ? specialistContacts.data?.find((smsUnitPrice) => smsUnitPrice.id === smsUnitPriceID) : undefined
		return countries?.enumerationsOptions?.map((country) => {
			const alreadyExists = specialistContacts.data?.find((smsUnitPrice) => smsUnitPrice.country.code === (country.value as string))

			return {
				...country,
				disabled: country?.value !== selectedSpecialistContact?.country.code && !!alreadyExists
			}
		})
	}, [countries?.enumerationsOptions, specialistContacts.data, smsUnitPriceID])

	return (
		<Form layout={'vertical'} className={'w-full top-0 sticky pt-1 px-6 pb-6 -mx-6'} onSubmitCapture={handleSubmit}>
			<div className={'h-full'}>
				<h3 className={'mb-0 mt-3 relative pr-7'}>
					{smsUnitPriceID ? t('loc:Upraviť cenu SMS') : t('loc:Pridať novú cenu SMS')}
					<Button className='noti-close-form-btn absolute top-1 right-0' onClick={() => closeForm()}>
						<CloseIcon />
					</Button>
				</h3>
				<Divider className={'my-3'} />
				<Field
					component={SelectField}
					optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
					label={t('loc:Krajina')}
					placeholder={t('loc:Vyberte krajinu')}
					options={countriesOptions}
					name={'countryCode'}
					size={'large'}
					loading={countries?.isLoading}
					required
					disabled={disabledForm}
				/>
				<Field
					component={InputNumberField}
					label={`${t('loc:Jednotková cena SMS')} ${currencySymbol ? `(${currencySymbol})` : ''}`.trim()}
					placeholder={t('loc:Zadajte sumu')}
					options={countriesOptions}
					name={'amount'}
					size={'large'}
					loading={countries?.isLoading}
					required
					disabled={disabledForm}
					precision={2}
				/>

				<Field
					component={DateField}
					pickerClassName={'w-full'}
					label={t('loc:Platnosť od')}
					placeholder={t('loc:Vyberte dátum')}
					name={'validFrom'}
					size={'large'}
					disabled={disabledForm}
				/>
				<div className={'flex w-full justify-start mt-6 gap-2 flex-wrap'}>
					<Button
						className={'noti-btn w-full xl:w-auto xl:min-w-40'}
						size='middle'
						type='primary'
						htmlType='submit'
						disabled={submitting || pristine}
						loading={submitting}
						icon={smsUnitPriceID ? <EditIcon /> : <CreateIcon />}
						id={formFieldID(FORM.SPECIALIST_CONTACT, SUBMIT_BUTTON_ID)}
					>
						{smsUnitPriceID ? t('loc:Uložiť') : STRINGS(t).createRecord(t('loc:cenu'))}
					</Button>
					{smsUnitPriceID && (
						<DeleteButton
							onConfirm={onDelete}
							entityName={''}
							type={'default'}
							className='w-full xl:w-auto xl:min-w-40'
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							id={formFieldID(FORM.SPECIALIST_CONTACT, DELETE_BUTTON_ID)}
						/>
					)}
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<ISmsUnitPricesForm, ComponentProps>({
	form: FORM.SPECIALIST_CONTACT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateSmsUnitPricesForm,
	onSubmitFail: showErrorNotification
})(withPromptUnsavedChanges(SmsUnitPricesForm))

export default form
