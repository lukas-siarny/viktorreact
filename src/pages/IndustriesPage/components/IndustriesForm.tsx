import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Form, Row } from 'antd'
import { useSelector } from 'react-redux'

// components
import i18next from 'i18next'
import CheckboxGroupImageField from './CheckboxGroupImageField'
import { getServicesCategoryKeys } from '../IndustryPage'

// validate
import validateCategoryFrom from './validateIndustriesFrom'

// utils
import { FORM, PERMISSION, SALON_PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { showErrorNotification } from '../../../utils/helper'

// redux
import { RootState } from '../../../reducers'

// types
import { IIndustriesForm } from '../../../types/interfaces'

// assets
import { ReactComponent as CategoryIcon } from '../../../assets/icons/categories-24-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

type ComponentProps = {
	selectedCategoryIDs?: string[]
	disabledForm?: boolean
	onShowMore: (id: string) => void
}

type Props = InjectedFormProps<IIndustriesForm, ComponentProps> & ComponentProps

const IndustriesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, onShowMore, disabledForm } = props

	const categories = useSelector((state: RootState) => state.categories.categories)
	const services = useSelector((state: RootState) => state.service.services)

	const categoriesOptions = categories.data?.map((category) => {
		const rootServicesCategory = services?.data?.groupedServicesByCategory?.find((serviceCategory) => serviceCategory.category?.id === category.id)
		const selectedServices = getServicesCategoryKeys(rootServicesCategory ? [rootServicesCategory] : []).length

		return {
			id: category.id,
			value: category.id,
			label: category.name,
			image: category.image?.original,
			disabled: disabledForm,
			extraAction: {
				action: () => onShowMore(category.id),
				label: `${t('loc:Priradiť služby')} (${selectedServices})`,
				popconfirm: !pristine,
				icon: <ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
			}
		}
	})

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<h3 className={'mb-0 mt-0 flex items-center'}>
				<CategoryIcon className={'text-notino-black mr-2'} />
				{t('loc:Odvetvia')}
			</h3>
			<Divider className={'mb-3 mt-3'} />
			<Field name={'categoryIDs'} component={CheckboxGroupImageField} required options={categoriesOptions} label={t('loc:Vyberte odvetvia, ktoré ponúkate')} />
			<div className={'content-footer'}>
				<Row justify='center'>
					<Permissions
						allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								type={'primary'}
								size={'middle'}
								htmlType={'submit'}
								className={'noti-btn m-regular w-52 xl:w-60'}
								disabled={submitting || pristine}
								loading={submitting}
								onClick={(e) => {
									if (hasPermission) {
										submit(FORM.INDUSTRIES)
									} else {
										e.preventDefault()
										openForbiddenModal()
									}
								}}
							>
								{t('loc:Uložiť odvetvia')}
							</Button>
						)}
					/>
				</Row>
			</div>
		</Form>
	)
}

const form = reduxForm<IIndustriesForm, ComponentProps>({
	form: FORM.INDUSTRIES,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: (errors, dispatch, submitError, props) =>
		showErrorNotification(errors, dispatch, submitError, props, {
			message: i18next.t('loc:Chybne vyplnený formulár'),
			description: i18next.t('loc:Vyberte aspoň jedno odvetvie')
		}),
	validate: validateCategoryFrom
})(IndustriesForm)

export default form