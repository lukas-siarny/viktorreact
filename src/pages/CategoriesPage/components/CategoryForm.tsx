import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, FieldArray, isDirty } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// enums
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import Localizations from '../../../components/Localizations'
import DeleteButton from '../../../components/DeleteButton'
import PopConfirmComponent from '../../../components/PopConfirmComponent'

// validate
import validateCategoryFrom from './validateCategoryFrom'

// utils
import { validationString } from '../../../utils/helper'

// redux
import { RootState } from '../../../reducers'

type ComponentProps = {
	deleteCategory: any
	createCategory: any
	closeCategoryForm: any
}

type NameLocalizationsItem = {
	language: string
	value: string
}

export interface ICategoryForm {
	name: string
	id: number
	orderIndex: number
	parentId: number
	childrenLength: number
	nameLocalizations: NameLocalizationsItem[]
	image: any
}

const fixLength100 = validationString(100)

type Props = InjectedFormProps<ICategoryForm, ComponentProps> & ComponentProps

const CategoryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, deleteCategory, createCategory, closeCategoryForm, pristine } = props

	const values = useSelector((state: RootState) => state.form[FORM.CATEGORY].values)
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
					onConfirm={() => createCategory(values?.id, values?.name, values?.childrenLength, values?.level || 0 + 1)}
					okText={t('loc:Pokračovať')}
					getPopupContainer={() => documentFooter}
					allowedButton={
						<Button className={'noti-btn'} size='middle'>
							{t('loc:Vytvoriť podkategóriu')}
						</Button>
					}
				/>
			)
		}
		return (
			<Button className={'noti-btn'} size='middle' onClick={() => createCategory(values?.id, values?.name, values?.childrenLength, values?.level || 0 + 1)}>
				{t('loc:Vytvoriť podkategóriu')}
			</Button>
		)
	}

	const localizationInputCss = values?.level === 0 ? 'w-2/3' : 'w-full'

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
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
					<Row justify={'space-between'} className={'w-full'}>
						<FieldArray
							key='nameLocalizations'
							name='nameLocalizations'
							component={Localizations}
							placeholder={t('loc:Zadajte názov')}
							horizontal
							ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
							customValidate={fixLength100}
							className={localizationInputCss}
							mainField={
								<Field
									className='mb-0'
									component={InputField}
									label={t('loc:Názov kategórie (en)')}
									placeholder={t('loc:Zadajte názov')}
									key='nameLocalizations[0].value'
									name='nameLocalizations[0].value'
									required
									validate={fixLength100}
								/>
							}
						/>
						{values?.level === 0 ? (
							<Field
								className='w-1/4'
								component={ImgUploadField}
								name='image'
								label={t('loc:Obrázok')}
								maxCount={1}
								signUrl={URL_UPLOAD_IMAGES}
								category={UPLOAD_IMG_CATEGORIES.CATEGORY}
								required
							/>
						) : undefined}
					</Row>
					<div className={'flex justify-between flex-wrap gap-2'}>
						{values?.id && !values?.deletedAt ? (
							<DeleteButton
								onConfirm={() => deleteCategory(values?.id, false)}
								entityName={''}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						) : undefined}

						{values?.id && values?.deletedAt && !values?.isParentDeleted ? (
							<Button className={'noti-btn'} size='middle' onClick={() => deleteCategory(values?.id, true)}>
								{t('loc:Obnoviť')}
							</Button>
						) : undefined}

						{values?.id && values?.level < 2 && !values?.deletedAt ? renderCreatSubcategoryButton() : undefined}

						{!values?.deletedAt ? (
							<Button className={'noti-btn'} size='middle' type='primary' htmlType='submit' disabled={submitting || pristine} loading={submitting}>
								{t('loc:Uložiť')}
							</Button>
						) : undefined}
					</div>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<ICategoryForm, ComponentProps>({
	form: FORM.CATEGORY,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCategoryFrom
})(CategoryForm)

export default form
