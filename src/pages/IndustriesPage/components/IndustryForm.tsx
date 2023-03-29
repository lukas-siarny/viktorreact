import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Row } from 'antd'
import { DataNode } from 'antd/lib/tree'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// components
import CheckboxGroupNestedField from './CheckboxGroupNestedField'

// utils
import { FORM, PERMISSION, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'
import Permissions from '../../../utils/Permissions'

// schema
import { IIndustryForm, validationIndustryFn } from '../../../schemas/industry'

type ComponentProps = {
	dataTree?: DataNode[] | null
	disabledForm?: boolean
	isLoadingTree?: boolean
}

type Props = InjectedFormProps<IIndustryForm, ComponentProps> & ComponentProps

const IndustryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, dataTree, disabledForm, isLoadingTree } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			{!isLoadingTree && <Field name={'categoryIDs'} component={CheckboxGroupNestedField} dataTree={dataTree} disabled={disabledForm} />}
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
								loading={submitting || isLoadingTree}
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
})(withPromptUnsavedChanges(IndustryForm))

export default form
