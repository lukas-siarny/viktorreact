import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// utils
import { FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// atoms
import SelectField from '../../../atoms/SelectField'
import TextareaField from '../../../atoms/TextareaField'

// reducers
import { RootState } from '../../../reducers'

// validations
import { optionRenderWithImage } from '../../../utils/helper'

// assets
import { ReactComponent as CategoryIcon } from '../../../assets/icons/categories-icon.svg'
import { IRequestNewServiceForm, validationRequestNewServiceFn } from '../../../schemas/service'

type ComponentProps = {}

type Props = InjectedFormProps<IRequestNewServiceForm, ComponentProps> & ComponentProps

const RequestNewService = (props: Props) => {
	const { handleSubmit, submitting } = props
	const [t] = useTranslation()

	const categories = useSelector((state: RootState) => state.categories.categories)

	return (
		<Spin spinning={submitting}>
			<p className={'base-regular my-4'}>{t('loc:Ak pre nejaké odvetvie chýba služba, ktorú chcete poskytovať, vyplňte formulár.')}</p>
			<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
				<Row>
					<Col span={24}>
						<Field
							label={t('loc:Odvetvie')}
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
							allowClear
							placeholder={t('loc:Vyberte odvetvie')}
							name='rootCategoryID'
							options={categories.enumerationsOptions}
							loading={categories.isLoading}
							required
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Field
							component={TextareaField}
							name={'description'}
							placeholder={t('loc:Zadajte popis')}
							label={t('loc:Popis')}
							required
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_3000}
							showLettersCount
							rows={8}
						/>
					</Col>
				</Row>
				<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
					{t('loc:Odoslať')}
				</Button>
			</Form>
		</Spin>
	)
}

const form = reduxForm<IRequestNewServiceForm, ComponentProps>({
	form: FORM.REQUEST_NEW_SERVICE_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationRequestNewServiceFn
})(RequestNewService)

export default form
