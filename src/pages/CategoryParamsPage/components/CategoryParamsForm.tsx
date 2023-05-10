import React, { FC, useMemo } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import InputsArrayField from '../../../atoms/InputsArrayField'

// components
import DeleteButton from '../../../components/DeleteButton'
import Localizations from '../../../components/Localizations'

// utils
import { formFieldID, showErrorNotification, validationString } from '../../../utils/helper'
import { ADD_BUTTON_ID, DELETE_BUTTON_ID, FORM, MAX_VALUES_PER_PARAMETER, PARAMETERS_VALUE_TYPES, STRINGS, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { EMPTY_NAME_LOCALIZATIONS } from '../../../components/LanguagePicker'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// schema
import { validationCategoryParamsFn, ICategoryParamsForm } from '../../../schemas/categoryParams'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon-16.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

const { Item } = Form

const maxLength100 = validationString(100)

type ComponentProps = {
	onDelete?: () => void
	onDeleteValue: (categoryParameterValueID?: string, removeIndex?: (index: number) => void, index?: number) => Promise<void>
}

type Props = InjectedFormProps<ICategoryParamsForm, ComponentProps> & ComponentProps

const LocalizationsArray = (props: any) => {
	const { fields, required, label, addBtnLabel, maxCount = MAX_VALUES_PER_PARAMETER, nestedFieldName, placeholder, emptyValue, handleDelete } = props
	const buttonAdd = (
		<Button
			id={formFieldID(FORM.CATEGORY_PARAMS, ADD_BUTTON_ID)}
			onClick={() => fields.push(emptyValue)}
			icon={<PlusIcon className={'text-notino-black'} />}
			className={'noti-btn mt-2'}
			type={'default'}
			size={'small'}
		>
			{addBtnLabel}
		</Button>
	)

	return (
		<Item required={required}>
			<div className={'flex flex-col gap-4 w-full'}>
				{fields.map((field: any, index: any) => {
					const key = `${field}.${nestedFieldName}`
					const fieldData = fields.get(index)
					const onConfirm = async () => {
						if (handleDelete) {
							// fields.remove funkcia sa posiela cela hore aby tam v try-catchi sa pouzila v pripade len ak nenastane BE chyba a zamedzi tym zmazaniu itemu z array ak nastala BE chyba a item nebol zmazany na BE
							await handleDelete(fieldData.id, fields.remove, index)
						}
					}

					return (
						<FieldArray
							key={key}
							name={key}
							className={'w-full mb-0 pb-0'}
							otherFieldsClass='mr-8'
							component={Localizations}
							placeholder={placeholder}
							horizontal
							ignoreFieldIndex={0}
							customValidate={maxLength100}
							mainField={
								<div key={index}>
									<Field
										className='pb-0 flex-1'
										component={InputField}
										label={label}
										placeholder={placeholder}
										key={`${key}[0].value`}
										name={`${key}[0].value`}
										required
										style={{ width: 'calc(100% - 24px - 8px)' }} // 100% - icon width - padding between icon and input
										validate={maxLength100}
									/>
									<DeleteButton
										id={formFieldID(FORM.CATEGORY_PARAMS, `${DELETE_BUTTON_ID}-${index}`)}
										className={'bg-red-100 absolute h-8 right-0 top-[21px]'}
										onConfirm={onConfirm}
										onlyIcon
										smallIcon
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
	const { handleSubmit, pristine, submitting, onDelete, change, onDeleteValue } = props
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
									className='mb-0 pb-0'
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
							handleDelete={onDeleteValue}
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
							handleDelete={onDeleteValue}
							addBtnLabel={t('loc:Pridať hodnotu')}
							label={t('loc:Hodnota (EN)')}
							nestedFieldName={'valueLocalizations'}
							emptyValue={{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }}
						/>
					)}
				</div>
			</Space>
			<div className={'content-footer'} id={'content-footer-container'}>
				<div className={`flex flex-col gap-2 md:flex-row ${onDelete ? 'md:justify-between' : 'md:justify-center'}`}>
					{onDelete && (
						<DeleteButton
							className={'w-full md:w-auto md:min-w-50 xl:min-w-60'}
							onConfirm={onDelete}
							entityName={t('loc:parameter')}
							type={'default'}
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							id={formFieldID(FORM.CATEGORY_PARAMS, DELETE_BUTTON_ID)}
						/>
					)}
					<Button
						type={'primary'}
						size={'middle'}
						className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
						htmlType={'submit'}
						disabled={submitting || pristine}
						loading={submitting}
						icon={onDelete ? <EditIcon /> : <PlusIcon />}
						id={formFieldID(FORM.CATEGORY_PARAMS, SUBMIT_BUTTON_ID)}
					>
						{onDelete ? STRINGS(t).save(entityName) : STRINGS(t).createRecord(entityName)}
					</Button>
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<ICategoryParamsForm, ComponentProps>({
	form: FORM.CATEGORY_PARAMS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationCategoryParamsFn
})(withPromptUnsavedChanges(CategoryParamsForm))

export default form
