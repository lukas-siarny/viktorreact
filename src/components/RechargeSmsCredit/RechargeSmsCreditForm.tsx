import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, FormProps, Row, Spin } from 'antd'

// utils
import { FORM, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../utils/enums'
import { formFieldID, showErrorNotification, validationNumberMin, validationRequiredNumber } from '../../utils/helper'
import { withPromptUnsavedChanges } from '../../utils/promptUnsavedChanges'

// assets
import { ReactComponent as CoinsIcon } from '../../assets/icons/coins.svg'

// atoms
import TextareaField from '../../atoms/TextareaField'
import InputNumberField from '../../atoms/InputNumberField'

// Schema
import { IRechargeSmsCreditForm, validationRechargeSmsCreditFn } from '../../schemas/rechargeSmsCredit'

type ComponentProps = FormProps & {
	description?: React.ReactNode
	currencySymbol: string
	loading?: boolean
}

type Props = InjectedFormProps<IRechargeSmsCreditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const RechargeSmsCreditForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, currencySymbol, loading, description } = props

	const isLoading = submitting || loading

	return (
		<div className='content-body small'>
			<Spin spinning={!!isLoading}>
				<Col className={'flex'}>
					<Row className={'mx-9 w-full h-full block'} justify='center'>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<CoinsIcon className={'text-notino-black mr-2'} /> {t('loc:Dobiť kredit')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						{description}
						<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
							<Field
								component={InputNumberField}
								label={`${t('loc:Zadajte sumu, ktorú chcete salónu nakreditovať')} ${currencySymbol ? `(${currencySymbol})` : ''}`.trim()}
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
						</Form>
					</Row>
				</Col>
			</Spin>
		</div>
	)
}

const form = reduxForm<IRechargeSmsCreditForm, ComponentProps>({
	form: FORM.RECHARGE_SMS_CREDIT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationRechargeSmsCreditFn
})(withPromptUnsavedChanges(RechargeSmsCreditForm))

export default form
