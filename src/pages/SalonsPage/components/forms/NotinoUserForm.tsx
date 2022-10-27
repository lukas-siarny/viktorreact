import React, { FC, useCallback } from 'react'
import { reduxForm, InjectedFormProps, Field } from 'redux-form'
import { Form, Button, Col, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// validations
import { useDispatch } from 'react-redux'
import validateNoteForm from './validateNoteForm'

// utils
import { FILTER_ENTITY, FORM, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'

// validate
import TextareaField from '../../../../atoms/TextareaField'

// types
import { INoteForm } from '../../../../types/interfaces'
import SelectField from '../../../../atoms/SelectField'
import searchWrapper from '../../../../utils/filters'

type ComponentProps = {
	fieldPlaceholderText?: string
}

type Props = InjectedFormProps<INoteForm, ComponentProps> & ComponentProps

const NotinoUserForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, fieldPlaceholderText } = props

	const dispatch = useDispatch()

	const searchNotinoUsers = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.NOTINO_USER)
		},
		[dispatch]
	)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row>
				<Col span={24}>
					<Field
						component={SelectField}
						options={[]} // TODO:
						label={t('loc:Priradiť Notino používateľa')}
						placeholder={t('loc:Vyberte používateľa')}
						name={'user'} // TODO: zistit atribut name
						size={'large'}
						showSearch
						onSearch={searchNotinoUsers}
						// loading={languages.isLoading} // TODO:
						allowInfinityScroll
						allowClear
						filterOption={false}
						onDidMountSearch
					/>
				</Col>
			</Row>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Odoslať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<any, ComponentProps>({
	form: FORM.NOTINO_USER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true
	// validate: validateNoteForm
})(NotinoUserForm)

export default form
