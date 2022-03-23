import React, { FC } from 'react'
import { reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// interfaces
import { IOpenHoursNoteForm } from '../../types/interfaces'

// utils
import { FORM, STRINGS } from '../../utils/enums'

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
				datePlaceholder={[t('loc:Od'), t('loc:Do')]}
				dateLabel={t('loc:Dátum')}
				textAreaPlaceholder={STRINGS(t).enter(t('loc:poznámku'))}
				textAreaLabel={t('loc:Poznámka')}
				size={'large'}
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
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateOpenHoursNoteForm
})(OpenHoursNoteForm)

export default form
