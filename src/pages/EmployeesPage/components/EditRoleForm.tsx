import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import SelectField from '../../../atoms/SelectField'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'

// validate
import validateEditRoleFrom from './validateEditRoleFrom'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const EditRoleForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Field
				component={SelectField}
				options={roles?.data}
				label={t('loc:Rola')}
				placeholder={t('loc:Vyberte rolu')}
				name={'roleID'}
				size={'large'}
				loading={roles?.isLoading}
				required
			/>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Upraviť rolu')}
			</Button>
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
