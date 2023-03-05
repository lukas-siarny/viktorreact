import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, FormProps } from 'antd'

// utils
import { FORM, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { formFieldID, showErrorNotification, validationNumberMin, validationRequiredNumber } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// types
import { IRechargeSmsCreditForm } from '../../../types/interfaces'
import InputNumberField from '../../../atoms/InputNumberField'

// validate
import validateRechargeCreditForm from './validateRechargeSmsCreditForm'

// atoms
import TextareaField from '../../../atoms/TextareaField'

type ComponentProps = FormProps & {
	currencySymbol?: string
}

type Props = InjectedFormProps<IRechargeSmsCreditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const RechargeSmsCreditForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, currencySymbol } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Field
				component={InputNumberField}
				label={`${t('loc:Zadajte sumu, ktorú chcete salónu dobiť')} ${currencySymbol ? `(${currencySymbol})` : ''}`.trim()}
				placeholder={t('loc:Zadajte sumu')}
				name={'amount'}
				precision={2}
				step={1}
				min={0}
				size={'large'}
				validate={[numberMin0, validationRequiredNumber]}
				required
			/>
			<Field
				component={TextareaField}
				label={t('loc:Poznámka')}
				placeholder={t('loc:Dobrý deň, pretože ste skvelý Partner, posielame vám kredity zdarma. Veríme, že padnú vhod.')}
				maxLength={VALIDATION_MAX_LENGTH.LENGTH_255}
				showLettersCount
				name={'transactionNote'}
				size={'large'}
				rows={8}
				className={'mb-4'}
			/>
			<Button
				id={formFieldID(FORM.RECHARGE_SMS_CREDIT, SUBMIT_BUTTON_ID)}
				type={'primary'}
				size={'middle'}
				className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
				htmlType={'submit'}
				disabled={submitting || pristine}
				loading={submitting}
			>
				{t('loc:Potvrdiť')}
			</Button>
			<p className={'text-notino-grayDark mb-0'}>{t('loc:Po potvrdení dostane salón notifikáciu o dobití kreditu.')}</p>
		</Form>
	)
}

const form = reduxForm<IRechargeSmsCreditForm, ComponentProps>({
	form: FORM.RECHARGE_SMS_CREDIT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateRechargeCreditForm
})(withPromptUnsavedChanges(RechargeSmsCreditForm))

export default form
