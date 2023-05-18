import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import cx from 'classnames'
import { useParams } from 'react-router'
import { showErrorNotification } from '../utils/helper'
import { FORM, SHORTCUT_DAYS_OPTIONS } from '../utils/enums'

// types
import { IDataUploadForm } from '../types/interfaces'

// atoms, pages, components, assets
import CheckboxGroupField from '../atoms/CheckboxGroupField'
import { RootState } from '../reducers'

type ComponentProps = {
	placeholder?: string
}

// TODO: pridat zod validaciu nad ides
type Props = InjectedFormProps<any, ComponentProps> & ComponentProps

const SalonIdsForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, pristine, placeholder } = props
	const { salonID }: any = useParams()
	const authUser = useSelector((state: RootState) => state.user.authUser)

	const salonIDs = authUser?.data?.salons.map((salon) => ({
		label: salon.name,
		value: salon.id,
		disabled: salon.id === salonID
	}))

	return (
		<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
			<Field
				className={'p-0 m-0'}
				component={CheckboxGroupField}
				name={'salonIDs'}
				label={placeholder}
				options={salonIDs}
				size={'small'}
				// horizontal
				// hideChecker
				// optionRender={checkboxOptionRender}
			/>
		</Form>
	)
}

const form = reduxForm<any, ComponentProps>({
	form: FORM.SALON_IDS_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(SalonIdsForm)

export default form
