import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useParams } from 'react-router'

// utils
import { FORM } from '../../../utils/enums'

// atoms, pages, components, assets
import CheckboxGroupField from '../../../atoms/CheckboxGroupField'

// schemas
import { ISalonIdsForm, validationSalonIdsSyncFn } from '../../../schemas/reservation'

type ComponentProps = {
	label?: string
	optionsData: any
}

type Props = InjectedFormProps<ISalonIdsForm, ComponentProps> & ComponentProps

const SalonIdsForm: FC<Props> = (props) => {
	const { handleSubmit, label, optionsData } = props
	const { salonID }: any = useParams()

	const salonIDs = optionsData.map((salon: any) => ({
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
