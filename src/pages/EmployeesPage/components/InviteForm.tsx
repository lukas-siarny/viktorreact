import React, { FC, useEffect } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'

// assets
import SalonRolesField from '../../../atoms/SalonRolesField'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// utils
import { FORM } from '../../../utils/enums'

// validate
import validateInviteFrom from './validateInviteFrom'

// reducers
import { getSalonRoles } from '../../../reducers/roles/rolesActions'

type ComponentProps = {}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const InviteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const dispatch = useDispatch()

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	useEffect(() => {
		dispatch(getSalonRoles())
	}, [dispatch])

	return (
		<>
			<Form layout='vertical' onSubmitCapture={handleSubmit}>
				<p className={'base-regular mb-7'}>{t('loc:Uveďte adresu, na ktorú odošleme link pre pozvanie zamestnanca do tímu.')}</p>
				<SalonRolesField options={roles?.data || []} name={'roleID'} loading={roles?.isLoading} required />
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
			</Form>
		</>
	)
}

const form = reduxForm<IInviteEmployeeForm, ComponentProps>({
	form: FORM.INVITE_EMPLOYEE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateInviteFrom
})(InviteForm)

export default form
