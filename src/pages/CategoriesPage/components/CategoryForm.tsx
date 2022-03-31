import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, FieldArray } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, DatePicker } from 'antd'

// enums
import { useSelector } from 'react-redux'
import { FORM } from '../../../utils/enums'

// atoms
import InputField from '../../../atoms/InputField'

// components
import Localizations from '../../../components/Localizations'

// validate
import validateCategoryFrom from './validateCategoryFrom'
import DeleteButton from '../../../components/DeleteButton'
import { RootState } from '../../../reducers'

type ComponentProps = {
	deleteCategory: any
}

export interface ICategoryForm {
	name: string
	id: number
	orderIndex: number
	parentId: number
	childrenLength: number
}

type Props = InjectedFormProps<ICategoryForm, ComponentProps> & ComponentProps

const CategoryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, deleteCategory } = props

	const values = useSelector((state: RootState) => state.form[FORM.CATEGORY].values)

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>
						{values?.id ? t('loc:Upraviť kategóriu') : `${t('loc:Vytvoriť kategóriu')}${values?.parentTitle ? ` - ${values?.parentTitle}` : ''}`}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<FieldArray
						className={'mb-6'}
						key='nameLocalizations'
						name='nameLocalizations'
						component={Localizations}
						placeholder={t('loc:Zadajte názov')}
						horizontal
						hideLanguageField='en'
						mainField={
							<Field
								className='mb-0'
								component={InputField}
								label={t('loc:Názov kategórie (en)')}
								placeholder={t('loc:Zadajte názov')}
								key='name'
								name='nameLocalizations[0].value'
								required
							/>
						}
					/>
					{/* <Field component={InputField} label={t('loc:Názov kategórie')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} required /> */}
					<div className={'flex justify-between'}>
						<Button className={'noti-btn w-1/3'} block size='middle' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
							{t('loc:Uložiť')}
						</Button>
						{values?.id ? (
							<DeleteButton
								onConfirm={() => deleteCategory(values?.id)}
								entityName={''}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
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
