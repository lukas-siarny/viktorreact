import React, { FC } from 'react'
import { reduxForm, InjectedFormProps, Field } from 'redux-form'
import { Form, Button, Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// validations
import validateDeclinedNoteForm from './validateDeclinedNoteForm'

// utils
import { FORM, STRINGS } from '../../../utils/enums'

// validate
import TextareaField from '../../../atoms/TextareaField'

// types
import { IDeclinedNoteForm } from '../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IDeclinedNoteForm, ComponentProps> & ComponentProps

const DeclinedNoteForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row>
				<Col span={24}>
					<Field component={TextareaField} name={'note'} placeholder={t('loc:Sem napíšte dôvod zamietnutia')} label={'Poznámka'} />
				</Col>
			</Row>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Odoslať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IDeclinedNoteForm, ComponentProps>({
	form: FORM.DECLINED_NOTE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateDeclinedNoteForm
})(DeclinedNoteForm)

export default form
