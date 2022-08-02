import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Space, Button } from 'antd'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import InputsArrayField from '../../../atoms/InputsArrayField'
import PhoneArrayField from '../../../atoms/PhoneArrayField'
import SelectField from '../../../atoms/SelectField'

// components
import Localizations from '../../../components/Localizations'

// utils
import { showErrorNotification, validationString } from '../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// types
import { ISupportContactForm } from '../../../types/interfaces'

// validate
import validateCategoryParamsForm from './validateCategoryParamsForm'

// reducers
import { RootState } from '../../../reducers'

const fixLength100 = validationString(100)

type ComponentProps = {
	parameterID?: number
}

type Props = InjectedFormProps<ISupportContactForm, ComponentProps> & ComponentProps

const CategoryParamsForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, pristine, submitting, parameterID = 0 } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.CATEGORY_PARAMS]?.values)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>{t('loc:Parameter')}</h3>
						<Divider className={'mb-3 mt-3'} />
						<Row justify={'space-between'} className={'w-full'}>
							<FieldArray
								key='nameLocalizations'
								name='nameLocalizations'
								component={Localizations}
								placeholder={t('loc:Zadajte názov')}
								horizontal
								ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
								customValidate={fixLength100}
								className='w-7/12'
								mainField={
									<Field
										className='mb-0'
										component={InputField}
										label={t('loc:Názov (EN)')}
										placeholder={t('loc:Zadajte názov')}
										key='nameLocalizations[0].value'
										name='nameLocalizations[0].value'
										required
										validate={fixLength100}
									/>
								}
							/>
							<Field component={SwitchField} name={'valuesInMinutes'} label={t('loc:Hodnoty sú uvedené v minútach')} className='w-2/5 mb-0 mt-3-5' size={'small'} />
						</Row>
						<h3 className={'mb-0 flex items-center'}>{t('loc:Hodnoty parametra')}</h3>
						<Divider className={'mb-3 mt-3'} />
						{formValues?.valuesInMinutes ? (
							<FieldArray
								component={InputsArrayField}
								name={'values'}
								placeholder={t('loc:Zadajte hodnotu v minútach')}
								entityName={t('loc:hodnotu')}
								label={t('loc:Hodnoty (min)')}
								nestedFieldName='value'
								maxCount={20}
								inputSize={'middle'}
								required
							/>
						) : (
							<FieldArray
								key={'values[0].valueLocalizations'}
								name={'values[0].valueLocalizations'}
								component={Localizations}
								placeholder={t('loc:Zadajte hodnotu')}
								horizontal
								ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
								customValidate={fixLength100}
								mainField={
									<Field
										className='mb-0'
										component={InputField}
										label={t('loc:Hodnota (EN)')}
										placeholder={t('loc:Zadajte hodnotu')}
										key={'values[0].valueLocalizations[0].value'}
										name={'values[0].valueLocalizations[0].value'}
										required
										validate={fixLength100}
									/>
								}
							/>
						)}
					</Col>
				</Row>
			</Space>
			<div className={'content-footer pt-0'}>
				<Row className={'justify-center w-full'}>
					<Button
						type={'primary'}
						block
						size={'middle'}
						className={'noti-btn m-regular mt-2-5 w-52 xl:w-60'}
						htmlType={'submit'}
						disabled={submitting || pristine}
						loading={submitting}
					>
						{t('loc:Uložiť')}
					</Button>
				</Row>
			</div>
		</Form>
	)
}

const form = reduxForm<ISupportContactForm, ComponentProps>({
	form: FORM.CATEGORY_PARAMS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateCategoryParamsForm
})(CategoryParamsForm)

export default form
