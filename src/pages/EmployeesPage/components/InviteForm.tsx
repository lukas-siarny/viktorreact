import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SalonRolesField from '../../../atoms/SalonRolesField'

// interfaces
import { ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'

// validate
import { IInviteEmployeeForm, validationInviteEmployeeFn } from '../../../schemas/employee'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	salonRolesOptions?: ISelectOptionItem[]
}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const InviteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, salonRolesOptions } = props

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<p className={'base-regular mb-7'}>{t('loc:Uveďte adresu, na ktorú odošleme link pre pozvanie zamestnanca do tímu.')}</p>
			<SalonRolesField
				options={salonRolesOptions || []}
				rolesDescriptions={roles.rolesDescriptions || []}
				name={'roleID'}
				size={'large'}
				loading={roles?.isLoading}
				className={'flex-1'}
				required
			/>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
		</Form>
	)
}

const form = reduxForm<IInviteEmployeeForm, ComponentProps>({
	form: FORM.INVITE_EMPLOYEE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validationInviteEmployeeFn
})(InviteForm)

export default form
