import React, { FC, useEffect, useState } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import SalonRolesTooltip from '../../../components/SalonRolesTooltip'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'

// validate
import validateInviteFrom from './validateInviteFrom'

// reducers
import { RootState } from '../../../reducers'
import { getSalonRoles } from '../../../reducers/roles/rolesActions'

// assets
import { ReactComponent as InfoIcon16 } from '../../../assets/icons/info-icon-16.svg'

type ComponentProps = {}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const InviteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const dispatch = useDispatch()

	const [visibleRolesTooltip, setVisibleRolesTooltip] = useState(false)

	const roles = useSelector((state: RootState) => state.roles.salonRoles)

	useEffect(() => {
		dispatch(getSalonRoles())
	}, [dispatch])

	return (
		<>
			<Form layout='vertical' onSubmitCapture={handleSubmit}>
				<p className={'base-regular mb-7'}>{t('loc:Uveďte adresu, na ktorú odošleme link pre pozvanie zamestnanca do tímu.')}</p>
				<Field
					component={SelectField}
					options={roles?.data}
					label={
						<>
							{t('loc:Rola')} <InfoIcon16 style={{ marginBottom: 2 }} className={'ml-1 cursor-pointer'} onClick={() => setVisibleRolesTooltip(true)} />
						</>
					}
					placeholder={t('loc:Vyberte rolu')}
					name={'roleID'}
					size={'large'}
					loading={roles?.isLoading}
					required
				/>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
			</Form>
			<SalonRolesTooltip visible={visibleRolesTooltip} onCancel={() => setVisibleRolesTooltip(false)} />
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
