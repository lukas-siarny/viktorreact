import React, { FC } from 'react'
import { reduxForm, InjectedFormProps, submit } from 'redux-form'
import { Form, Button, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import SalonRolesField from '../../../atoms/SalonRolesField'

// interfaces
import { ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM, PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// schema
import { validationEditEmployeeRoleFn, IEditEmployeeRoleForm } from '../../../schemas/role'

// assets
import { ReactComponent as KeyIcon } from '../../../assets/icons/key-icon.svg'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	hasPermissionToEdit?: boolean
	salonRolesOptions?: ISelectOptionItem[]
	permissionTooltip?: string | null
}

type Props = InjectedFormProps<IEditEmployeeRoleForm, ComponentProps> & ComponentProps

const EditEmployeeRoleForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine, hasPermissionToEdit, salonRolesOptions, permissionTooltip } = props

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<div className={'mx-9'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<KeyIcon className={'text-notino-black mr-2'} />
					{t('loc:Oprávnenie')}
				</h3>
				<Divider className={'mb-3 mt-3'} />
				<div className={'flex w-full flex-col md:flex-row md:gap-2'}>
					<Permissions
						allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_ROLE_UPDATE]}
						render={(hasPermission, { openForbiddenModal }) => {
							return (
								<>
									<SalonRolesField
										options={salonRolesOptions || []}
										rolesDescriptions={roles.rolesDescriptions || []}
										name={'roleID'}
										size={'large'}
										loading={roles?.isLoading}
										className={'flex-1'}
										disabled={!hasPermission || !hasPermissionToEdit}
										tooltip={permissionTooltip}
										required
									/>
									<Button
										type={'primary'}
										size={'middle'}
										htmlType={'submit'}
										className={'self-start noti-btn m-regular md:mt-5'}
										disabled={submitting || pristine}
										onClick={(e) => {
											if (hasPermission && hasPermissionToEdit) {
												submit(FORM.EDIT_EMPLOYEE_ROLE)
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
									>
										{t('loc:Upraviť rolu')}
									</Button>
								</>
							)
						}}
					/>
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<IEditEmployeeRoleForm, ComponentProps>({
	form: FORM.EDIT_EMPLOYEE_ROLE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validationEditEmployeeRoleFn
})(EditEmployeeRoleForm)

export default form
