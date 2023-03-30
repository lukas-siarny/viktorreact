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
import { FORM, PERMISSION, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { formFieldID, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// redux
import { RootState } from '../../../reducers'

// types
import { IIndustriesForm } from '../../../types/interfaces'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CategoryIcon } from '../../../assets/icons/categories-24-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

type ComponentProps = {
	selectedCategoryIDs?: string[]
	disabledForm?: boolean
	onShowEventsListPopover: (id: string) => void
}

type Props = InjectedFormProps<IIndustriesForm, ComponentProps> & ComponentProps

const IndustriesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, onShowEventsListPopover, disabledForm } = props

	const categories = useSelector((state: RootState) => state.categories.categories)
	const services = useSelector((state: RootState) => state.service.services)

	const categoriesOptions = categories.data?.map((category) => {
		const rootServicesCategory = services?.data?.groupedServicesByCategory?.find((serviceCategory) => serviceCategory.category?.id === category.id)
		const selectedServices = getServicesCategoryKeys(rootServicesCategory ? [rootServicesCategory] : []).length

		return {
			id: category.id,
			value: category.id,
			label: category.name,
			image: category.image?.resizedImages?.small,
			disabled: disabledForm,
			extraAction: {
				action: () => onShowEventsListPopover(category.id),
				label: `${t('loc:Priradiť služby')} (${selectedServices})`,
				popconfirm: !pristine,
				icon: <ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
			}
		}
	})

	return (
		<Form layout={'vertical'} className={'form w-full'} onSubmitCapture={handleSubmit}>
			<h3 className={'mb-0 mt-0 flex items-center space-'}>
				<CategoryIcon className={'text-notino-black mr-2'} />
				{t('loc:Odvetvia a služby')}
			</h3>
			<Divider className={'mb-3 mt-3'} />
			<Field name={'categoryIDs'} component={CheckboxGroupImageField} required options={categoriesOptions} label={t('loc:Vyberte odvetvia a služby, ktoré ponúkate')} />
			<div className={'content-footer'}>
				<Row justify='center'>
					<Permissions
						allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								id={formFieldID(FORM.INDUSTRIES, SUBMIT_BUTTON_ID)}
								type={'primary'}
								size={'middle'}
								icon={<EditIcon />}
								htmlType={'submit'}
								className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
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
})(withPromptUnsavedChanges(IndustriesForm))

export default form
