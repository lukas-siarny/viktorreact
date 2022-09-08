import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// interfaces
import { IInviteEmployeeForm, ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// validate
import validateInviteFrom from './validateInviteFrom'

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
			<Field
				component={SelectField}
				options={salonRolesOptions}
				label={t('loc:Rola')}
				placeholder={t('loc:Vyberte rolu')}
				name={'roleID'}
				size={'large'}
				loading={roles?.isLoading}
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
	validate: validateInviteFrom
})(withPromptUnsavedChanges(InviteForm))

export default form
