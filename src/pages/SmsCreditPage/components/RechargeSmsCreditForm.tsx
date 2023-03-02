import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, FormProps, Row } from 'antd'
import { useDispatch } from 'react-redux'

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

// assets
import { ReactComponent as CoinsIcon } from '../../../assets/icons/coins.svg'

type ComponentProps = FormProps & {}

type Props = InjectedFormProps<IRechargeSmsCreditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const RechargeSmsCreditForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine } = props
	const dispatch = useDispatch()

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-0 flex items-center'}>
						<CoinsIcon className={'text-notino-black mr-2'} /> {t('loc:Dobiť kredit')}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field
						component={InputNumberField}
						label={t('loc:Zadajte sumu, ktorú chcete salónu dobiť (Kč)')}
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
						placeholder={t('loc:Zadajte poznámku')}
						maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
						showLettersCount
						name={'note'}
						size={'large'}
					/>
					<Button
						id={formFieldID(FORM.RECHARGE_SMS_CREDIT, SUBMIT_BUTTON_ID)}
						type={'primary'}
						size={'middle'}
						className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
						htmlType={'submit'}
						// icon={<EditIcon />}
						onClick={(e) => {
							/* if (hasPermission) {
								dispatch(submit(FORM.CUSTOMER))
							} else {
								e.preventDefault()
								openForbiddenModal()
							} */
							dispatch(submit(FORM.RECHARGE_SMS_CREDIT))
						}}
						disabled={submitting || pristine}
						loading={submitting}
					>
						{t('loc:Potvrdiť')}
					</Button>
				</Row>
			</Col>
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
