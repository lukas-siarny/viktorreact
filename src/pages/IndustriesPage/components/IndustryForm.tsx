import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Row } from 'antd'

// assets
import { DataNode } from 'antd/lib/tree'

// components
import CheckboxGroupNestedField from './CheckboxGroupNestedField'

// validate
import validateIndustryFrom from './validateIndustryFrom'

// utils
import { FORM, PERMISSION, SALON_PERMISSION } from '../../../utils/enums'
import { showErrorNotification } from '../../../utils/helper'

// redux
import Permissions from '../../../utils/Permissions'
import { IIndustryForm } from '../../../types/interfaces'

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
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			{!isLoadingTree && <Field name={'categoryIDs'} component={CheckboxGroupNestedField} dataTree={dataTree} disabled={disabledForm} />}
			<div className={'content-footer'}>
				<Row justify='center'>
					<Permissions
						allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.USER_ROLE_EDIT]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								type={'primary'}
								size={'middle'}
								htmlType={'submit'}
								className={'noti-btn m-regular w-52 xl:w-60'}
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
	validate: validateIndustryFrom,
	onSubmitFail: showErrorNotification
})(IndustryForm)

export default form
