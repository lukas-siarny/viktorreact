import React, { FC } from 'react'
import { reduxForm, InjectedFormProps, Field } from 'redux-form'
import { Form, Button, Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// validations
import validateNoteForm from './validateNoteForm'

// utils
import { FORM, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { formFieldID } from '../../../../utils/helper'

// validate
import TextareaField from '../../../../atoms/TextareaField'

// types
import { INoteForm } from '../../../../types/interfaces'

type ComponentProps = {
	fieldPlaceholderText?: string
}

type Props = InjectedFormProps<INoteForm, ComponentProps> & ComponentProps

const NoteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, fieldPlaceholderText } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row>
				<Col span={24}>
					<Field
						component={TextareaField}
						name={'note'}
						placeholder={fieldPlaceholderText}
						label={t('loc:Poznámka')}
						maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
						showLettersCount
					/>
				</Col>
			</Row>
			<Button
				id={formFieldID(FORM.NOTE, SUBMIT_BUTTON_ID)}
				className='noti-btn'
				block
				size='large'
				type='primary'
				htmlType='submit'
				disabled={submitting}
				loading={submitting}
			>
				{t('loc:Odoslať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<INoteForm, ComponentProps>({
	form: FORM.NOTE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateNoteForm
})(NoteForm)

export default form
