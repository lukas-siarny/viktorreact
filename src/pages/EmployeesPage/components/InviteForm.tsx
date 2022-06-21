import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import InputField from '../../../atoms/InputField'

// interfaces
import { IInviteEmployeeForm } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'

// validate
import validateInviteFrom from './validateInviteFrom'

type ComponentProps = {}

type Props = InjectedFormProps<IInviteEmployeeForm, ComponentProps> & ComponentProps

const InviteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<p className={'base-regular mb-7'}>{t('loc:Uveďte adresu, na ktorú odošleme link pre pozvanie zamestnanca do tímu.')}</p>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} focused />
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Odoslať email')}
			</Button>
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
})(InviteForm)

export default form
