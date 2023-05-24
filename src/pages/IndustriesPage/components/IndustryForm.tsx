import React, { FC, useEffect, useState } from 'react'
import { Field, InjectedFormProps, reduxForm, submit, FieldArray, WrappedFieldArrayProps, getFormValues, change } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, CheckboxOptionType, Collapse, Form, Row } from 'antd'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// components

// utils
import { FORM, PERMISSION, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'
import Permissions from '../../../utils/Permissions'

// schema
import { IIndustryForm, validationIndustryFn } from '../../../schemas/industry'
import CheckboxGroupField from '../../../atoms/CheckboxGroupField'
import { IServicesSelectionData } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

const { Panel } = Collapse

type ComponentProps = {
	disabledForm?: boolean
	servicesSelectionData: IServicesSelectionData | null
}

type Props = InjectedFormProps<IIndustryForm, ComponentProps> & ComponentProps

type ExtraProps = {
	options: IServicesSelectionData[keyof IServicesSelectionData]['options']
	categoryID: string
	formValues?: IIndustryForm
}

const Extra: FC<ExtraProps> = React.memo((props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { options, categoryID, formValues } = props

	const selectedValues = formValues?.categoryIDs[categoryID].serviceCategoryIDs || []
	const visibleSelectedOptions = selectedValues?.filter((value) => options.find((option) => option.value === value))
	const areAllVisibleOptionsSelected = visibleSelectedOptions?.length === options.length
	const label = areAllVisibleOptionsSelected ? t('loc:Odznačiť všetko') : t('loc:Označiť všetko')

	const handleChange = () => {
		let newServiceCategoryIDs: string[] = []
		if (areAllVisibleOptionsSelected) {
			newServiceCategoryIDs = selectedValues?.filter((value) => !options.find((option) => option.value === value))
		} else {
			newServiceCategoryIDs = Array.from(new Set([...selectedValues, ...options.map((o) => o.value as string)]))
		}
		dispatch(change(FORM.INDUSTRY, `categoryIDs.${categoryID}.serviceCategoryIDs`, newServiceCategoryIDs))
	}

	return (
		<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
			<Button type={'ghost'} onClick={handleChange}>
				{label}
			</Button>
		</div>
	)
})

const IndustryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, disabledForm, servicesSelectionData } = props

	const [collapseActiveKeys, setCollapseActiveKeys] = useState<string[]>([])
	const formValues = useSelector((state: RootState) => getFormValues(FORM.INDUSTRY)(state)) as IIndustryForm

	useEffect(() => {
		setCollapseActiveKeys(Object.keys(servicesSelectionData || {}))
	}, [servicesSelectionData])

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Collapse
				className={cx('collapse-list')}
				bordered={false}
				activeKey={collapseActiveKeys}
				onChange={(key) => {
					if (typeof key === 'string') {
						setCollapseActiveKeys([key])
					} else {
						setCollapseActiveKeys(key)
					}
				}}
			>
				{Object.entries(servicesSelectionData || {})
					.sort((a, b) => a[1].orderIndex - b[1].orderIndex)
					.map(([categoryID, categoryData]) => {
						return (
							<Panel
								header={
									<div className={'flex align-center'}>
										<div className={'list-title leading-7'}>{categoryData.title}</div>
									</div>
								}
								key={categoryID}
								forceRender
								extra={<Extra categoryID={categoryID} options={categoryData.options} formValues={formValues} />}
							>
								<Field
									className={'p-0 m-0'}
									component={CheckboxGroupField}
									name={`categoryIDs[${categoryID}]serviceCategoryIDs`}
									options={categoryData.options}
									// disabled={loadingData}
								/>
							</Panel>
						)
					})}
			</Collapse>
			<div className={'content-footer'}>
				<Row justify='center'>
					<Permissions
						allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_CREATE, PERMISSION.SERVICE_DELETE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								id={formFieldID(FORM.INDUSTRY, SUBMIT_BUTTON_ID)}
								type={'primary'}
								size={'middle'}
								htmlType={'submit'}
								className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
								icon={<EditIcon />}
								disabled={submitting || pristine}
								loading={submitting}
								onClick={(e) => {
									if (hasPermission) {
										submit(FORM.INDUSTRY)
									} else {
										e.preventDefault()
										openForbiddenModal()
									}
								}}
							>
								{t('loc:Uložiť')}
							</Button>
						)}
					/>
				</Row>
			</div>
		</Form>
	)
}

const form = reduxForm<IIndustryForm, ComponentProps>({
	form: FORM.INDUSTRY,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationIndustryFn,
	onSubmitFail: showErrorNotification
})(/* withPromptUnsavedChanges(IndustryForm) */ IndustryForm)

export default React.memo(form)
