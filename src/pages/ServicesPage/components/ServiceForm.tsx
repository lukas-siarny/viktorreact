import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InjectedFormProps, reduxForm, Field } from 'redux-form'
import { Form, Spin, Divider, Row, Col, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

// assets
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// atoms
import SelectField from '../../../atoms/SelectField'
import validateServiceForm from './validateServiceForm'
import InputField from '../../../atoms/InputField'
import TextareaField from '../../../atoms/TextareaField'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import DeleteButton from '../../../components/DeleteButton'
import CategoryFields from './CategoryFields'

// reducers
import { RootState } from '../../../reducers'

// utils
import { showErrorNotification, validationNumberMin } from '../../../utils/helper'
import { FORM, NOTIFICATION_TYPE, PERMISSION, STRINGS, URL_UPLOAD_IMAGES, FILTER_ENTITY, UPLOAD_IMG_CATEGORIES } from '../../../utils/enums'
import { deleteReq } from '../../../utils/request'
import { history } from '../../../utils/history'
import searchWrapper from '../../../utils/filters'

// types
import { IServiceForm } from '../../../types/interfaces'

const numberMin0 = validationNumberMin(0)

type ComponentProps = {
	serviceID?: number
}
type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

const ServiceForm = (props: Props) => {
	const { serviceID, handleSubmit, pristine } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM].values)
	const employees = useSelector((state: RootState) => state.employees.employees)
	const serviceLoading = useSelector((state: RootState) => state.service.service.isLoading) // update
	const categoriesLoading = useSelector((state: RootState) => state.categories.categories.isLoading) // update

	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const isLoading = serviceLoading || categoriesLoading || isRemoving
	const submitting = false

	const variableDuration = formValues?.variableDuration
	const variablePrice = formValues?.variablePrice

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
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.SALON)
		},
		[dispatch]
	)

	const searchEmployees = useCallback(
		async (search: string, page: number) => {
			const salonID = formValues?.salonID
			return searchWrapper(dispatch, { page, search, salonID: salonID?.value ?? salonID } as any, FILTER_ENTITY.EMPLOYEE)
		},
		[dispatch, formValues]
	)

	return (
		<Spin tip={STRINGS(t).loading} spinning={isLoading}>
			<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
				<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} required />
				<Field component={TextareaField} label={t('loc:Popis')} placeholder={t('loc:Zadajte popis')} name={'description'} size={'large'} />
				<Field
					className='m-0'
					component={ImgUploadField}
					name='gallery'
					label={t('loc:Referenčné obrázky')}
					signUrl={URL_UPLOAD_IMAGES}
					multiple
					maxCount={10}
					category='SALON'
				/>
				<CategoryFields />
				<Field
					label={t('loc:Salón')}
					component={SelectField}
					allowClear
					placeholder={t('loc:Vyberte salón')}
					name='salonID'
					showSearch
					onSearch={searchSalon}
					onDidMountSearch
					required
					filterOption={false}
					allowInfinityScroll
				/>
				<Row gutter={8} align='middle'>
					<Col span={8}>
						<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={'variableDuration'} size={'middle'} />
					</Col>
					<Col span={variableDuration ? 8 : 16}>
						<Field
							component={InputNumberField}
							label={variableDuration ? t('loc:Trvanie od') : t('loc:Trvanie')}
							placeholder={t('loc:min')}
							name='durationFrom'
							precision={0}
							step={1}
							maxChars={3}
							size={'large'}
							validate={[numberMin0]}
							required
						/>
					</Col>

					{variableDuration && (
						<Col span={8}>
							<Field
								component={InputNumberField}
								label={t('loc:Trvanie do')}
								placeholder={t('loc:min')}
								name='durationTo'
								precision={0}
								step={1}
								maxChars={3}
								size={'large'}
								validate={[numberMin0]}
								required
							/>
						</Col>
					)}
				</Row>

				<Row gutter={8} align='middle'>
					<Col span={8}>
						<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={'variablePrice'} size={'middle'} />
					</Col>
					<Col span={variablePrice ? 8 : 16}>
						<Field
							component={InputNumberField}
							label={variablePrice ? t('loc:Cena od') : t('loc:Cena')}
							// TODO add currency
							// placeholder={t('loc:min')}
							name='priceFrom'
							precision={2}
							step={1}
							maxChars={5}
							size={'large'}
							validate={[numberMin0]}
							required
						/>
					</Col>
					{variablePrice && (
						<Col span={8}>
							<Field
								component={InputNumberField}
								label={t('loc:Cena do')}
								// TODO add currency
								// placeholder={t('loc:min')}
								name='priceTo'
								precision={2}
								step={1}
								maxChars={5}
								size={'large'}
								validate={[numberMin0]}
								required
							/>
						</Col>
					)}
				</Row>
				<div className={'flex w-full justify-between'}>
					<Field
						label={t('loc:Zamestnanci')}
						className={'w-4/5'}
						size={'large'}
						component={SelectField}
						allowClear
						placeholder={t('loc:Vyberte zamestnancov')}
						name={'employees'}
						onSearch={searchEmployees}
						filterOption={true}
						options={employees?.options}
						mode={'multiple'}
						showSearch
						allowInfinityScroll
						disabled={!formValues?.salonID}
					/>
					<Button type={'primary'} block size={'middle'} className={'noti-btn m-regular w-1/6 mt-4'} onClick={undefined} disabled={isEmpty(formValues?.employees)}>
						{formValues?.employees && formValues?.employees.length > 1 ? t('loc:Pridať zamestnancov') : t('loc:Pridať zamestnanca')}
					</Button>
				</div>

				<Divider />
				<Field
					className='m-0'
					component={ImgUploadField}
					name='gallery'
					label={t('loc:Referenčné obrázky')}
					signUrl={URL_UPLOAD_IMAGES}
					multiple
					maxCount={10}
					category={UPLOAD_IMG_CATEGORIES.SALON}
				/>
				<Row className={'content-footer'} id={'content-footer-container'}>
					<Col span={8}>
						{serviceID ? (
							<DeleteButton
								className={'noti-btn w-full'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								onConfirm={onConfirmDelete}
								entityName={t('loc:službu')}
								permissions={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_DELETE]}
							/>
						) : null}
					</Col>
					<Col span={8} offset={8}>
						<Button
							type={'primary'}
							className={'noti-btn w-full'}
							htmlType={'submit'}
							icon={serviceID ? <EditIcon /> : <CreateIcon />}
							disabled={submitting || pristine}
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
	onSubmitFail: showErrorNotification,
	validate: validateServiceForm
})(ServiceForm)

export default form
