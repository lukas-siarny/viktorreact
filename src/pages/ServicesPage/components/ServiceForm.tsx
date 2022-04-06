import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { FieldArray, InjectedFormProps, reduxForm, Field, isPristine } from 'redux-form'
import { Form, notification, Spin, Divider, Row, Col, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// atoms
import { IServiceForm } from '../../../types/interfaces'
import SelectField from '../../../atoms/SelectField'
import validateServiceForm from './validateServiceForm'
import InputField from '../../../atoms/InputField'
import TextareaField from '../../../atoms/TextareaField'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
// import ProductDetailLocalizations from './ProductDetailLocalizations'
// import ProductPrices from './ProductPrices'
import DeleteButton from '../../../components/DeleteButton'
import CategoryFields from './CategoryFields'

// reducers
import { RootState } from '../../../reducers'
import { getSalons } from '../../../reducers/salons/salonsActions'

// utils
import { scrollToFirstError } from '../../../utils/helper'
import { FORM, NOTIFICATION_TYPE, PERMISSION, STRINGS } from '../../../utils/enums'
import { deleteReq } from '../../../utils/request'
import { history } from '../../../utils/history'

type ComponentProps = {
	serviceID?: number
}
type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

const ServiceForm = (props: Props) => {
	const { serviceID, handleSubmit } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])
	const serviceLoading = useSelector((state: RootState) => state.service.service.isLoading) // update
	const categoriesLoading = useSelector((state: RootState) => state.categories.categories.isLoading) // update

	const isPristineForm: boolean = useSelector((state: RootState) => isPristine(FORM.SERVICE_FORM)(state))
	const [isRemoving, setIsRemoving] = useState(false)

	const isLoading = serviceLoading || categoriesLoading || isRemoving
	const submitting = false

	const onConfirmDelete = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq(`/api/b2b/admin/services/{serviceID}`, { serviceID: serviceID || -1 }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setIsRemoving(false)
			const url = t('paths:services')
			history.push(url)
		} catch (e) {
			setIsRemoving(false)
		}
	}

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			const { data, salonsOptions } = await dispatch(getSalons(page, undefined, undefined, search, undefined, undefined))
			return { pagination: data?.pagination?.page, data: salonsOptions }
		},
		[dispatch]
	)

	const variableDuration = form?.values?.variableDuration
	const variablePrice = form?.values?.variablePrice

	return (
		<Spin tip={STRINGS(t).loading} spinning={isLoading}>
			<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
				<CategoryFields />
				<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} />
				<Field component={TextareaField} label={t('loc:Popis')} placeholder={t('loc:Zadajte popis')} name={'description'} size={'large'} />
				<Field
					className='m-0'
					label={t('loc:Salón')}
					component={SelectField}
					allowClear
					placeholder={t('loc:Salón')}
					name='salonID'
					showSearch
					onSearch={searchSalon}
					onDidMountSearch
					size={'large'}
				/>
				<Divider />
				<Row gutter={8}>
					<Col span={variableDuration ? 12 : 24}>
						<Field
							component={InputNumberField}
							label={variableDuration ? t('loc:Trvanie od') : t('loc:Trvanie')}
							placeholder={t('loc:min')}
							name='durationFrom'
							precision={0}
							step={1}
							maxChars={3}
							size={'large'}
						/>
					</Col>

					{variableDuration && (
						<Col span={12}>
							<Field
								component={InputNumberField}
								label={t('loc:Trvanie do')}
								placeholder={t('loc:min')}
								name='durationTo'
								precision={0}
								step={1}
								maxChars={3}
								size={'large'}
							/>
						</Col>
					)}
				</Row>
				<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={'variableDuration'} size={'middle'} />
				<Divider />
				<Row gutter={8}>
					<Col span={variablePrice ? 12 : 24}>
						<Field
							component={InputNumberField}
							label={variablePrice ? t('loc:Cena od') : t('loc:Cena')}
							// placeholder={t('loc:min')}
							name='priceFrom'
							precision={2}
							step={1}
							maxChars={5}
							size={'large'}
						/>
					</Col>
					{variablePrice && (
						<Col span={12}>
							<Field
								component={InputNumberField}
								label={t('loc:Cena do')}
								// placeholder={t('loc:min')}
								name='priceTo'
								precision={2}
								step={1}
								maxChars={5}
								size={'large'}
							/>
						</Col>
					)}
				</Row>
				<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={'variablePrice'} size={'middle'} />
				<Divider />
				<Field
					className='m-0'
					component={ImgUploadField}
					name='gallery'
					label={t('loc:Referenčné obrázky')}
					signUrl='/api/b2b/admin/files/sign-urls'
					multiple
					required
					maxCount={10}
					category='SALON'
				/>
				<Row className='bg-notino-white mt-3 px-3 py-3 sticky bottom-0' id={'content-footer-container'}>
					<Col span={12} className={'text-left'}>
						{serviceID ? (
							<DeleteButton
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								onConfirm={onConfirmDelete}
								entityName={t('loc:službu')}
								permissions={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT]}
							/>
						) : null}
					</Col>
					<Col span={12} className={'text-right'}>
						<Button
							type={'primary'}
							className={'noti-btn'}
							htmlType={'submit'}
							icon={serviceID ? <EditIcon /> : <CreateIcon />}
							disabled={submitting || isPristineForm}
							loading={submitting}
						>
							{serviceID ? STRINGS(t).save(t('loc:službu')) : STRINGS(t).createRecord(t('loc:službu'))}
						</Button>
					</Col>
				</Row>
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
