import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Button, Alert } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import cx from 'classnames'

// utils
import { DEFAULT_DATE_INIT_FORMAT, DELETE_BUTTON_ID, FORM, MONTH_NAME_YEAR_FORMAT, STRINGS, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, optionRenderWithImage, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// components
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'
import DateField from '../../../atoms/DateField'
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'

// types
import { IEnumerationsCountriesPayload, ILoadingAndFailure } from '../../../types/interfaces'

// schema
import { ISmsUnitPricesForm, validationSmsUnitPricesFn } from '../../../schemas/smsUnitPrices'

type ComponentProps = {
	smsUnitPriceID?: string
	changeFormVisibility: (show?: boolean) => void
	onDelete: () => void
	disabledForm?: boolean
	currencySymbol?: string
	countries: IEnumerationsCountriesPayload & ILoadingAndFailure
}

type Props = InjectedFormProps<ISmsUnitPricesForm, ComponentProps> & ComponentProps

const SmsUnitPricesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, smsUnitPriceID, changeFormVisibility, onDelete, submitting, pristine, disabledForm, currencySymbol, countries } = props

	return (
		<Form layout={'vertical'} className={'w-full top-0 sticky pt-1 px-6 pb-6 -mx-6'} onSubmitCapture={handleSubmit}>
			<div className={'h-full'}>
				<h3 className={'mb-0 mt-3 relative pr-7'}>
					{smsUnitPriceID ? STRINGS(t).edit(t('loc:cenu SMS')) : STRINGS(t).addRecord(t('loc:novú cenu SMS'))}
					<Button className='noti-close-form-btn absolute top-1 right-0' onClick={() => changeFormVisibility()}>
						<CloseIcon />
					</Button>
				</h3>
				<Divider className={'my-3'} />
				{disabledForm && <Alert message={t('loc:Editovateľné sú len SMS ceny s platnosťou v budúcnosti')} showIcon type={'warning'} className={'noti-alert w-full mb-4'} />}
				<Field
					component={SelectField}
					optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
					label={t('loc:Krajina')}
					placeholder={t('loc:Vyberte krajinu')}
					options={countries.enumerationsOptions}
					name={'countryCode'}
					size={'large'}
					loading={countries?.isLoading}
					required
					disabled
				/>
				<Field
					component={InputNumberField}
					label={`${t('loc:Jednotková cena SMS')} ${currencySymbol ? `(${currencySymbol})` : ''}`.trim()}
					placeholder={t('loc:Zadajte sumu')}
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
					className={'pb-0'}
					label={t('loc:Platnosť od')}
					placeholder={t('loc:Vyberte dátum')}
					name={'validFrom'}
					size={'large'}
					picker={'month'}
					disabled={disabledForm}
					required
					dateFormat={MONTH_NAME_YEAR_FORMAT}
					customOnChange={(value: Dayjs | null) => {
						change('validFrom', value ? dayjs(value).startOf('month').format(DEFAULT_DATE_INIT_FORMAT) : null)
					}}
					disabledDate={(current: Dayjs) => {
						// Can not select current month and previous months
						return current && current < dayjs().endOf('month')
					}}
				/>
				<span className={'text-notino-grayDark text-xs'}>{t('loc:Platnosť sa vždy ráta od prvého dňa v mesiaci')}</span>
				{!disabledForm && (
					<div className={cx('flex w-full mt-6 gap-2 flex-wrap', { 'justify-between': smsUnitPriceID, 'justify-center': !smsUnitPriceID })}>
						{smsUnitPriceID && (
							<DeleteButton
								onConfirm={onDelete}
								entityName={''}
								type={'default'}
								className='w-full xl:w-auto xl:min-w-40'
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								id={formFieldID(FORM.SMS_UNIT_PRICES_FORM, DELETE_BUTTON_ID)}
							/>
						)}
						<Button
							className={'noti-btn w-full xl:w-auto xl:min-w-40'}
							size='middle'
							type='primary'
							htmlType='submit'
							disabled={submitting || pristine}
							loading={submitting}
							icon={smsUnitPriceID ? <EditIcon /> : <CreateIcon />}
							id={formFieldID(FORM.SMS_UNIT_PRICES_FORM, SUBMIT_BUTTON_ID)}
						>
							{smsUnitPriceID ? t('loc:Uložiť') : STRINGS(t).createRecord(t('loc:cenu'))}
						</Button>
					</div>
				)}
			</div>
		</Form>
	)
}

const form = reduxForm<ISmsUnitPricesForm, ComponentProps>({
	form: FORM.SMS_UNIT_PRICES_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationSmsUnitPricesFn,
	onSubmitFail: showErrorNotification
})(withPromptUnsavedChanges(SmsUnitPricesForm))

export default form
