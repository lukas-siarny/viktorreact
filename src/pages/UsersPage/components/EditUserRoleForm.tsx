import React, { FC } from 'react'
import { reduxForm, InjectedFormProps, submit, Field } from 'redux-form'
import { Form, Button, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import SelectField from '../../../atoms/SelectField'

// utils
import { FORM, ADMIN_PERMISSIONS, STRINGS } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// assets
import { ReactComponent as KeyIcon } from '../../../assets/icons/key-icon.svg'

// reducers
import { RootState } from '../../../reducers'

// schema
import { IEditUserRoleForm, validationEditUserRoleFn } from '../../../schemas/role'

type ComponentProps = {}

type Props = InjectedFormProps<IEditUserRoleForm, ComponentProps> & ComponentProps

const EditUserRoleForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, pristine } = props

	const roles = useSelector((state: RootState) => state.roles.systemRoles)

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
						allowed={ADMIN_PERMISSIONS}
						render={(hasPermission, { openForbiddenModal }) => (
							<>
								<Field
									component={SelectField}
									className={'flex-1'}
									options={roles?.data}
									label={t('loc:Rola')}
									placeholder={t('loc:Vyberte rolu')}
									name={'roleID'}
									size={'large'}
									loading={roles?.isLoading}
									required
								/>
								<Button
									type={'primary'}
									size={'middle'}
									htmlType={'submit'}
									className={'self-start noti-btn m-regular md:mt-5'}
									disabled={submitting || pristine}
									onClick={(e) => {
										if (hasPermission) {
											submit(FORM.EDIT_USER_ROLE)
										} else {
											e.preventDefault()
											openForbiddenModal()
										}
									}}
								>
									{STRINGS(t).edit(t('loc:rolu'))}
								</Button>
							</>
						)}
					/>
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<IEditUserRoleForm, ComponentProps>({
	form: FORM.EDIT_USER_ROLE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validationEditUserRoleFn
})(EditUserRoleForm)

export default form
