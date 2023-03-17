import React, { FC } from 'react'
import { reduxForm, InjectedFormProps, Field } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// utils
import { FORM, STRINGS, VALIDATION_MAX_LENGTH } from '../../utils/enums'

// validate, interfaces
import { IOpenHoursNoteForm, validationOpenHoursNoteFn } from '../../schemas/openHoursNote'

// atoms
import TextareaField from '../../atoms/TextareaField'

type ComponentProps = {}

type Props = InjectedFormProps<IOpenHoursNoteForm, ComponentProps> & ComponentProps

const OpenHoursNoteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Field
				component={TextareaField}
				name={'openingHoursNote'}
				placeholder={STRINGS(t).enter(t('loc:poznámku'))}
				label={t('loc:Poznámka')}
				size={'large'}
				required
				maxLength={VALIDATION_MAX_LENGTH.LENGTH_200}
				showLettersCount
			/>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{STRINGS(t).save(t('loc:poznámku'))}
			</Button>
		</Form>
	)
}

const form = reduxForm<IOpenHoursNoteForm, ComponentProps>({
	form: FORM.OPEN_HOURS_NOTE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationOpenHoursNoteFn
})(OpenHoursNoteForm)

export default form
