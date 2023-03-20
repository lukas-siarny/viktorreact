import React, { FC, useEffect } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Space, Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import PinField from '../../../atoms/PinField'

// shcemas
import { IActivationForm, validationFn as validateActivationForm } from '../../../schemas/activation'

// utils
import { FORM, PIN_LENGTH, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID } from '../../../utils/helper'

type ComponentProps = {}

type Props = InjectedFormProps<IActivationForm, ComponentProps> & ComponentProps

const ActivationForm: FC<Props> = (props) => {
	const { t } = useTranslation()
	const { handleSubmit, submitting, initialize } = props

	useEffect(() => {
		initialize({ code: undefined })
	}, [initialize])

	return (
		<Form onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction={'vertical'} size={16}>
				<Field component={PinField} name={'code'} length={PIN_LENGTH} formatPin={(char: string) => (char ? char.toUpperCase() : char)} />
				<Button
					id={formFieldID(FORM.ACTIVATION, SUBMIT_BUTTON_ID)}
					type={'primary'}
					block
					size={'large'}
					className={`noti-btn m-regular mb-4`}
					htmlType={'submit'}
					disabled={submitting}
					loading={submitting}
				>
					{t('loc:Aktivovať')}
				</Button>
			</Space>
		</Form>
	)
}

const form = reduxForm<IActivationForm, ComponentProps>({
	form: FORM.ACTIVATION,
	forceUnregisterOnUnmount: true,
	destroyOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	validate: validateActivationForm
})(ActivationForm)

export default form
