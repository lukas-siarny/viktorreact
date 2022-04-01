import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { FieldArray, InjectedFormProps, reduxForm, Field, isPristine } from 'redux-form'
import { Form, notification, Spin, Divider, Row, Col, Button } from 'antd'
import { useSelector } from 'react-redux'

// assets
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// atoms
import { IServiceForm } from '../../../types/interfaces'
import SelectField from '../../../atoms/SelectField'
import validateServiceForm from './validateServiceForm'
import DeleteButton from '../../../components/DeleteButton'

// components
// import ProductDetailLocalizations from './ProductDetailLocalizations'
// import ProductPrices from './ProductPrices'

// reducers
import { RootState } from '../../../reducers'

// utils
import { scrollToFirstError } from '../../../utils/helper'
import { FORM, NOTIFICATION_TYPE, STRINGS } from '../../../utils/enums'
import { deleteReq } from '../../../utils/request'
import { history } from '../../../utils/history'

type ComponentProps = {
	serviceID?: number
}
type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

const ServiceForm = (props: Props) => {
	const { serviceID } = props
	const [t] = useTranslation()
	const { handleSubmit } = props
	const serviceLoading = useSelector((state: RootState) => state.service.services.isLoading) // update
	const isPristineForm: boolean = useSelector((state: RootState) => isPristine(FORM.SERVICE_FORM)(state))
	const [isRemoving, setIsRemoving] = useState(false)

	const isLoading = serviceLoading || isRemoving
	const submitting = false

	const onConfirmDelete = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			// await deleteReq(`/api/admin/products/${productID}`, undefined, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setIsRemoving(false)
			const url = t('paths:services')
			history.push(url)
		} catch (e) {
			setIsRemoving(false)
		}
	}

	return (
		<Spin tip={STRINGS(t).loading} spinning={isLoading}>
			<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
				create page
				{/* <h2>{t('loc:Všeobecné údaje')}</h2>
				<FieldArray key='productLocalization' name='productLocalization' component={ProductDetailLocalizations} />
				<h2>{t('loc:Doplňujúce údaje')}</h2>
				<Field component={SelectField} placeholder={t('loc:Vyberte kategóriu')} name='category' options={PRODUCT_CATEGORY_OPTIONS} label={t('loc:Kategória')} required />
				<Field
					className='m-0'
					component={SignedImageUploadField}
					name='gallery'
					label={t('loc:Fotogaléria')}
					sighUrl='/api/admin/upload/sign'
					multiple
					required
					maxCount={10}
				/>
				<Divider />
				<h2>{t('loc:Cena')}</h2>
				<FieldArray key='priceVariants' name='priceVariants' component={ProductPrices} />
				<Row className='bg-gray-100 mt-6 -mb-4 -ml-4 -mr-4 px-4 py-3 sticky bottom-0 rounded-b-md' id={'content-footer-container'}>
					<Col span={12} className={'text-left'}>
						{productID ? (
							<DeleteButton
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								onConfirm={onConfirmDelete}
								entityName={t('loc:produkt')}
							/>
						) : null}
					</Col>

					<Col span={12} className={'text-right'}>
						<Button
							type={'primary'}
							className={'b-btn'}
							htmlType={'submit'}
							icon={productID ? <EditIcon /> : <CreateIcon />}
							disabled={submitting || isPristineForm}
							loading={submitting}
						>
							{productID ? STRINGS(t).save(t('loc:produkt')) : STRINGS(t).createRecord(t('loc:produkt'))}
						</Button>
					</Col>
				</Row> */}
			</Form>
		</Spin>
	)
}

const form = reduxForm<IServiceForm, ComponentProps>({
	form: FORM.SERVICE_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateServiceForm,
	onSubmitFail: (errors, dispatch, submitError, props) => {
		if (errors && props.form) {
			scrollToFirstError(errors, props.form)
			notification.error({
				message: i18next.t('loc:Chybne vyplnený formulár'),
				description: i18next.t('loc:Skontrolujte správnosť vyplnených polí vo formulári')
			})
		}
	}
})(ServiceForm)

export default form
