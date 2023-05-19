import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

// utils
import { FORM } from '../utils/enums'

// atoms, pages, components, assets
import CheckboxGroupField from '../atoms/CheckboxGroupField'

// types
import { RootState } from '../reducers'

// schemas
import { ISalonIdsForm, validationSalonIdsSyncFn } from '../schemas/reservation'

type ComponentProps = {
	label?: string
}

type Props = InjectedFormProps<ISalonIdsForm, ComponentProps> & ComponentProps

const SalonIdsForm: FC<Props> = (props) => {
	const { handleSubmit, label } = props
	const { salonID }: any = useParams()
	const authUser = useSelector((state: RootState) => state.user.authUser)

	const salonIDs = authUser?.data?.salons.map((salon) => ({
		label: salon.name,
		value: salon.id,
		disabled: salon.id === salonID
	}))

	return (
		<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
			<Field className={'p-0 m-0'} component={CheckboxGroupField} name={'salonIDs'} label={label} options={salonIDs} />
		</Form>
	)
}

const form = reduxForm<ISalonIdsForm, ComponentProps>({
	form: FORM.SALON_IDS_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationSalonIdsSyncFn
})(SalonIdsForm)

export default form
