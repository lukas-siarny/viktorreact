import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps, submit } from 'redux-form'
import { Form, Button, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import SelectField from '../../../atoms/SelectField'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'

// utils
import { FORM, PERMISSION, SALON_PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// validate
import validateEditRoleFrom from './validateEditRoleFrom'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const EditRoleForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine } = props

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<div className={'mx-9'}>
				<h3>{t('loc:Oprávnenie')}</h3>
				<Divider className={'mb-3 mt-3'} />
				<div className={'flex w-full flex-col md:flex-row md:gap-2'}>
					<Field
						component={SelectField}
						options={roles?.data}
						label={t('loc:Rola')}
						placeholder={t('loc:Vyberte rolu')}
						name={'roleID'}
						size={'large'}
						loading={roles?.isLoading}
						className={'flex-1'}
						required
					/>
					<Permissions
						allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.USER_ROLE_EDIT]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								type={'primary'}
								size={'middle'}
								htmlType={'submit'}
								className={'self-start noti-btn m-regular md:mt-5'}
								disabled={submitting || pristine}
								onClick={(e) => {
									if (hasPermission) {
										submit(FORM.EDIT_EMPLOYEE_ROLE)
									} else {
										e.preventDefault()
										openForbiddenModal()
									}
								}}
							>
								{t('loc:Upraviť rolu')}
							</Button>
						)}
					/>
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<IInviteEmployeeForm, ComponentProps>({
	form: FORM.EDIT_EMPLOYEE_ROLE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateEditRoleFrom
})(EditRoleForm)

export default form
