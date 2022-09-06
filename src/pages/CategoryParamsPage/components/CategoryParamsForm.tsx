import React, { FC, useMemo } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Space, Button } from 'antd'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import InputsArrayField from '../../../atoms/InputsArrayField'

// components
import DeleteButton from '../../../components/DeleteButton'
import Localizations from '../../../components/Localizations'

// utils
import { showErrorNotification, validationString } from '../../../utils/helper'
import { FORM, MAX_VALUES_PER_PARAMETER, PARAMETERS_VALUE_TYPES, STRINGS } from '../../../utils/enums'
import { EMPTY_NAME_LOCALIZATIONS } from '../../../components/LanguagePicker'

// validate
import validateCategoryParamsForm from './validateCategoryParamsForm'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon-16.svg'

// types
import { ICategoryParamForm } from '../../../types/interfaces'

const { Item } = Form

const maxLength100 = validationString(100)

type ComponentProps = {
	onDelete?: () => void
}

type Props = InjectedFormProps<ICategoryParamForm, ComponentProps> & ComponentProps

const LocalizationsArray = (props: any) => {
	const { fields, required, label, addBtnLabel, maxCount = MAX_VALUES_PER_PARAMETER, nestedFieldName, placeholder, emptyValue } = props

	const buttonAdd = (
		<Button onClick={() => fields.push(emptyValue)} icon={<PlusIcon className={'text-notino-black'} />} className={'noti-btn mt-2'} type={'default'} size={'small'}>
			{addBtnLabel}
		</Button>
	)

	return (
		<Item required={required}>
			<div className={'flex flex-col gap-4 w-full'}>
				{fields.map((field: any, index: any) => {
					const key = `${field}.${nestedFieldName}`

					return (
						<FieldArray
							key={key}
							name={key}
							className={'w-full mb-0'}
							otherFieldsClass='mr-8'
							component={Localizations}
							placeholder={placeholder}
							horizontal
							ignoreFieldIndex={0}
							customValidate={maxLength100}
							mainField={
								<div key={index} className={'flex gap-2 items-center'}>
									<Field
										className='mb-0 flex-1'
										component={InputField}
										label={label}
										placeholder={placeholder}
										key={`${key}[0].value`}
										name={`${key}[0].value`}
										required
										validate={maxLength100}
									/>
									<DeleteButton
										className={'bg-red-100 mt-5'}
										onClick={() => fields.remove(index)}
										onlyIcon
										smallIcon
										noConfirm
										size={'small'}
										disabled={fields.length === 1}
									/>
								</div>
							}
						/>
					)
				})}
			</div>
			{maxCount ? fields.length < maxCount && buttonAdd : buttonAdd}
		</Item>
	)
}

const CategoryParamsForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, pristine, submitting, onDelete, change } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.CATEGORY_PARAMS]?.values)
	const entityName = useMemo(() => t('loc:parameter'), [t])

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<div>
					<h3 className={'mb-0 flex items-center'}>{t('loc:Parameter')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Row justify={'space-between'} className={'w-full'}>
						<FieldArray
							key='nameLocalizations'
							name='nameLocalizations'
							component={Localizations}
							placeholder={t('loc:Zadajte názov')}
							horizontal
							ignoreFieldIndex={0}
							customValidate={maxLength100}
							className='w-7/12 mb-0'
							mainField={
								<Field
									className='mb-0'
									component={InputField}
									label={t('loc:Názov (EN)')}
									placeholder={t('loc:Zadajte názov')}
									key='nameLocalizations[0].value'
									name='nameLocalizations[0].value'
									required
									validate={maxLength100}
								/>
							}
						/>
						<Field
							id='value-type-switch'
							customOnChange={() =>
								change('valueType', formValues?.valueType === PARAMETERS_VALUE_TYPES.TIME ? PARAMETERS_VALUE_TYPES.ENUM : PARAMETERS_VALUE_TYPES.TIME)
							}
							checked={formValues?.valueType === PARAMETERS_VALUE_TYPES.TIME}
							component={SwitchField}
							name={'valueType'}
							key={'valueType'}
							label={t('loc:Hodnoty sú uvedené v minútach')}
							className='w-2/5 mb-0 mt-3-5'
							size={'small'}
						/>
					</Row>
				</div>
				<div>
					<h3 className={'mb-0 flex items-center'}>{t('loc:Hodnoty')}</h3>
					<Divider className={'mb-3 mt-3'} />
					{formValues?.valueType === PARAMETERS_VALUE_TYPES.TIME ? (
						<FieldArray
							component={InputsArrayField}
							name={'values'}
							placeholder={t('loc:Zadajte hodnotu v minútach')}
							entityName={t('loc:hodnotu')}
							label={t('loc:Hodnoty (min)')}
							nestedFieldName='value'
							maxCount={MAX_VALUES_PER_PARAMETER}
							inputSize={'middle'}
							type='number'
							emptyValue={{ value: null }}
							required
						/>
					) : (
						<FieldArray
							name={'localizedValues'}
							component={LocalizationsArray}
							placeholder={t('loc:Zadajte hodnotu')}
							required
							addBtnLabel={t('loc:Pridať hodnotu')}
							label={t('loc:Hodnota (EN)')}
							nestedFieldName={'valueLocalizations'}
							emptyValue={{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }}
						/>
					)}
				</div>
			</Space>
			<div className={'content-footer pt-0'}>
				<Row className={`w-full ${onDelete ? 'justify-between' : 'justify-center'}`}>
					{onDelete && (
						<DeleteButton
							className={'mt-2-5 w-52 xl:w-60'}
							onConfirm={onDelete}
							entityName={t('loc:parameter')}
							type={'default'}
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
						/>
					)}
					<Button
						type={'primary'}
						block
						size={'middle'}
						className={'noti-btn m-regular mt-2-5 w-52 xl:w-60'}
						htmlType={'submit'}
						disabled={submitting || pristine}
						loading={submitting}
					>
						{onDelete ? STRINGS(t).save(entityName) : STRINGS(t).createRecord(entityName)}
					</Button>
				</Row>
			</div>
		</Form>
	)
}

const form = reduxForm<ICategoryParamForm, ComponentProps>({
	form: FORM.CATEGORY_PARAMS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateCategoryParamsForm
})(CategoryParamsForm)

export default form
