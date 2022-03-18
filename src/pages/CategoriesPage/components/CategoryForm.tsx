import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row } from 'antd'

// enums
import { FORM } from '../../../utils/enums'

// atoms
import InputField from '../../../atoms/InputField'

// validate
import validateCategoryFrom from './validateCategoryFrom'

type ComponentProps = {}

export interface ICategoryForm {
	name: string
}

type Props = InjectedFormProps<ICategoryForm, ComponentProps> & ComponentProps

const CategoryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'w-full mx-9 h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Vytvoriť novú kategóriu')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<Field component={InputField} label={t('loc:Name')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} required />
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
