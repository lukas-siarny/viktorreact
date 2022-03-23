import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import InputField from '../../atoms/InputField'

// interfaces
import { IOpenHoursNoteForm } from '../../types/interfaces'

// utils
import { FORM } from '../../utils/enums'

// components
import OpenHoursNoteFields from './OpenHoursNoteFields'

// validate
import validateOpenHoursNoteForm from './validateOpenHoursNoteForm'

type ComponentProps = {}

type Props = InjectedFormProps<IOpenHoursNoteForm, ComponentProps> & ComponentProps

const OpenHoursNoteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<OpenHoursNoteFields
				// placeholder={[t('loc:Vyberte termín od'), t('loc:Vyberte termín do')]}
				datePlaceholder={[t('loc:Od'), t('loc:Do')]}
				dateLabel={'Datum'}
				textAreaPlaceholder='test'
				textAreaLabel='Poznamka'
				size={'large'}
			/>
		</Form>
	)
}

const form = reduxForm<IOpenHoursNoteForm, ComponentProps>({
	form: FORM.OPEN_HOURS_NOTE,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateOpenHoursNoteForm
})(OpenHoursNoteForm)

export default form
