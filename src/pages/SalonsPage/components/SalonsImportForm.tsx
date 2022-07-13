import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form } from 'antd'

// atoms
import FileUploadField from '../../../atoms/FileUploadField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { FORM } from '../../../utils/enums'

// types
import { IDataUploadForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

type ComponentProps = {
	disabledForm?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const SalonsImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, disabledForm, pristine } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Field
				component={FileUploadField}
				name={'file'}
				label={t('loc:Vyberte súbor vo formáte .xls/.xlsx')}
				accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}
				maxCount={1}
				type={'file'}
				disabled={submitting}
				handleUploadOutside
				required
			/>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={disabledForm || submitting || pristine} loading={submitting}>
				{t('loc:Importovať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IDataUploadForm, ComponentProps>({
	form: FORM.SALON_IMPORTS_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateSalonForm
})(SalonsImportForm)

export default form
