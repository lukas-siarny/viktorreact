import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, FieldArray, isDirty } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Spin } from 'antd'
import { useSelector } from 'react-redux'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import SelectField from '../../../atoms/SelectField'
import TextareaField from '../../../atoms/TextareaField'

// components
import Localizations from '../../../components/Localizations'
import DeleteButton from '../../../components/DeleteButton'
import PopConfirmComponent from '../../../components/PopConfirmComponent'

// validate
import validateCategoryFrom from './validateCategoryFrom'

// utils
import { validationString, checkUploadingBeforeSubmit } from '../../../utils/helper'
import { FORM, PERMISSION, STRINGS, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// reducers
import { RootState } from '../../../reducers'

// types
import { NameLocalizationsItem } from '../../../types/interfaces'

type ComponentProps = {
	deleteCategory: Function
	createCategory: (rootParentId: string, parentId: string, parentTitle: string, childrenLength: number, level: number) => void
	closeCategoryForm: (e?: React.MouseEvent<HTMLElement> | undefined) => void
}

export interface ICategoryForm {
	name: string
	id: string
	orderIndex: number
	parentId: string
	rootParentId: string | undefined | null
	childrenLength: number
	nameLocalizations: NameLocalizationsItem[]
	descriptionLocalizations: NameLocalizationsItem[]
	image: any
	categoryParameterID: string
}

const fixLength100 = validationString(VALIDATION_MAX_LENGTH.LENGTH_100)
const fixLength1500 = validationString(VALIDATION_MAX_LENGTH.LENGTH_1500)

type Props = InjectedFormProps<ICategoryForm, ComponentProps> & ComponentProps

const permissions: PERMISSION[] = [PERMISSION.ENUM_EDIT]

const CategoryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, deleteCategory, createCategory, closeCategoryForm, pristine } = props

	const values = useSelector((state: RootState) => state.form[FORM.CATEGORY].values)
	const categoriesParameters = useSelector((state: RootState) => state.categoryParams.parameters)
	const category = useSelector((state: RootState) => state.categories.category)
	const isFormDirty = useSelector(isDirty(FORM.CATEGORY))

	const renderFormTitle = () => {
		if (values?.id) {
			return t('loc:Upraviť kategóriu')
		}
		if (values?.parentTitle) {
			return `${t('loc:Vytvoriť podkategóriu pre')} - ${values?.parentTitle}`
		}
		return t('loc:Vytvoriť kategóriu')
	}

	const documentFooter = document.getElementById('content-footer-container') || document.body

	const renderCreatSubcategoryButton = () => {
		if (isFormDirty) {
			return (
				<PopConfirmComponent
					placement={'left'}
					title={t('loc:Máte neuložené zmeny vo formulári. Želáte si pokračovať ďalej?')}
					onConfirm={() => createCategory(values?.parentId, values?.id, values?.name, values?.childrenLength, (values?.level ?? 0) + 1)}
					okText={t('loc:Pokračovať')}
					getPopupContainer={() => documentFooter}
					allowedButton={
						<Button className={'noti-btn m-regular w-full 2xl:w-auto max-w-full min-w-0'} icon={<CreateIcon />} type={'dashed'} size='middle'>
							{t('loc:Vytvoriť podkategóriu')}
						</Button>
					}
				/>
			)
		}
		return (
			<Button
				className={'noti-btn m-regular w-full 2xl:w-auto max-w-full min-w-0'}
				type={'dashed'}
				size='middle'
				icon={<CreateIcon />}
				onClick={() => createCategory(values?.parentId, values?.id, values?.name, values?.childrenLength, (values?.level ?? 0) + 1)}
			>
				{t('loc:Vytvoriť podkategóriu')}
			</Button>
		)
	}

	return (
		<Form layout={'vertical'} className={'w-full top-0 sticky overflow-hidden'} onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)}>
			<Spin wrapperClassName={'w-full'} spinning={category.isLoading || categoriesParameters.isLoading}>
				<Col className={'flex'}>
					<Row className={'w-full h-full block'} justify='center'>
						<h3 className={'mb-0 mt-3 relative pr-7'}>
							{renderFormTitle()}
							{isFormDirty ? (
								<PopConfirmComponent
									placement={'left'}
									title={t('loc:Máte neuložené zmeny vo formulári. Želáte si pokračovať ďalej?')}
									onConfirm={closeCategoryForm}
									okText={t('loc:Pokračovať')}
									getPopupContainer={() => documentFooter}
									allowedButton={
										<Button className='absolute top-1 right-0 p-0 border-none shadow-none'>
											<CloseIcon />
										</Button>
									}
								/>
							) : (
								<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={closeCategoryForm}>
									<CloseIcon />
								</Button>
							)}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Row className={'w-full'}>
							<FieldArray
								key='nameLocalizations'
								name='nameLocalizations'
								className='w-full'
								component={Localizations}
								placeholder={t('loc:Zadajte názov')}
								horizontal
								ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
								customValidate={fixLength100}
								mainField={
									<Field
										className='mb-0 pb-0'
										component={InputField}
										label={t('loc:Názov kategórie (EN)')}
										placeholder={t('loc:Zadajte názov')}
										key='nameLocalizations[0].value'
										name='nameLocalizations[0].value'
										required
										validate={fixLength100}
									/>
								}
								noSpace
							/>
							{values?.level === 2 ? (
								<>
									<Field
										className={'w-full mb-2'}
										component={SelectField}
										options={categoriesParameters.enumerationsOptions}
										label={t('loc:Parameter')}
										placeholder={t('loc:Vyberte parameter')}
										name={'categoryParameterID'}
										loading={categoriesParameters.isLoading}
										allowClear
									/>
									<FieldArray
										key='descriptionLocalizations'
										name='descriptionLocalizations'
										component={Localizations}
										placeholder={t('loc:Zadajte názov')}
										horizontal
										fieldComponent={TextareaField}
										ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
										customValidate={fixLength1500}
										customRows={4}
										className={'w-full'}
										mainField={
											<Field
												className='mb-0 pb-0'
												component={TextareaField}
												label={t('loc:Popis kategórie (EN)')}
												placeholder={t('loc:Zadajte popis')}
												key='descriptionLocalizations[0].value'
												name='descriptionLocalizations[0].value'
												maxLength={VALIDATION_MAX_LENGTH.LENGTH_1500}
												rows={4}
											/>
										}
										noSpace
									/>
								</>
							) : undefined}
						</Row>
						{values?.level === 0 ? (
							<Row className={'mb-4'}>
								<Field
									component={ImgUploadField}
									name='image'
									label={t('loc:Obrázok')}
									maxCount={1}
									signUrl={URL_UPLOAD_IMAGES}
									category={UPLOAD_IMG_CATEGORIES.CATEGORY_IMAGE}
									required
								/>
								<Field
									component={ImgUploadField}
									name='icon'
									label={t('loc:Ikona')}
									maxCount={1}
									signUrl={URL_UPLOAD_IMAGES}
									category={UPLOAD_IMG_CATEGORIES.CATEGORY_ICON}
									required
								/>
							</Row>
						) : undefined}

						<div className={'flex justify-between flex-wrap gap-2 mt-6'}>
							<div className='flex gap-2 flex-wrap w-full 2xl:w-auto'>
								{!values?.deletedAt ? (
									<Permissions allowed={permissions}>
										<Button
											className={'noti-btn w-full 2xl:w-auto max-w-full min-w-0'}
											size='middle'
											type='primary'
											htmlType='submit'
											disabled={submitting || pristine}
											loading={submitting}
											icon={values?.id ? <EditIcon /> : <CreateIcon />}
										>
											{values?.id ? t('loc:Uložiť') : STRINGS(t).createRecord(t('loc:kategóriu'))}
										</Button>
									</Permissions>
								) : undefined}
								{values?.id && values?.level < 2 && !values?.deletedAt ? renderCreatSubcategoryButton() : undefined}
							</div>
							{values?.id && !values?.deletedAt ? (
								<Permissions allowed={permissions}>
									<DeleteButton
										onConfirm={() => deleteCategory(values?.id, false)}
										entityName={''}
										className={'w-full 2xl:w-auto max-w-full min-w-0'}
										type={'default'}
										getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
									/>
								</Permissions>
							) : undefined}
						</div>
					</Row>
				</Col>
			</Spin>
		</Form>
	)
}

const form = reduxForm<ICategoryForm, ComponentProps>({
	form: FORM.CATEGORY,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCategoryFrom
})(withPromptUnsavedChanges(CategoryForm))

export default form
