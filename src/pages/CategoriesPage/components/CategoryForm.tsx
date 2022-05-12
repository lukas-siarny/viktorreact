import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, FieldArray } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// enums
import { FORM, URL_UPLOAD_IMAGES } from '../../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import Localizations from '../../../components/Localizations'
import DeleteButton from '../../../components/DeleteButton'

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
	const { handleSubmit, submitting, deleteCategory, createCategory, closeCategoryForm } = props

	const values = useSelector((state: RootState) => state.form[FORM.CATEGORY].values)
	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 relative pr-7'}>
						{values?.id ? t('loc:Upraviť kategóriu') : `${t('loc:Vytvoriť kategóriu')}${values?.parentTitle ? ` - ${values?.parentTitle}` : ''}`}
						<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={closeCategoryForm}>
							<CloseIcon />
						</Button>
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<FieldArray
						key='nameLocalizations'
						name='nameLocalizations'
						component={Localizations}
						placeholder={t('loc:Zadajte názov')}
						horizontal
						ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
						customValidate={fixLength100}
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
						<Field className='m-0' component={ImgUploadField} name='image' label={t('loc:Obrázok')} maxCount={1} signUrl={URL_UPLOAD_IMAGES} category='SALON' />
					) : undefined}
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

						{values?.id && values?.level < 2 && !values?.deletedAt ? (
							<Button className={'noti-btn'} size='middle' onClick={() => createCategory(values?.id, values?.name, values?.childrenLength, values?.level || 0 + 1)}>
								{t('loc:Vytvoriť podkategóriu')}
							</Button>
						) : undefined}

						{!values?.deletedAt ? (
							<Button className={'noti-btn'} size='middle' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
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
