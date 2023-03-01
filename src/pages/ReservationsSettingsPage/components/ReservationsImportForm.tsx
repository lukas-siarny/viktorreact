import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form } from 'antd'

import { showErrorNotification, validationRequired } from '../../../utils/helper'
import { FORM } from '../../../utils/enums'
import { IDataUploadForm } from '../../../types/interfaces'
import FileUploadField from '../../../atoms/FileUploadField'

type ComponentProps = {
	disabledForm?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const ReservationsImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, disabledForm, pristine } = props

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Field
				component={FileUploadField}
				name={'file'}
				label={t('loc:Vyberte súbor vo formáte .xlsx / .csv')}
				accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.ics'}
				maxCount={1}
				type={'file'}
				disabled={submitting}
				handleUploadOutside
				validate={validationRequired}
				required
			/>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={disabledForm || submitting || pristine} loading={submitting}>
				{t('loc:Importovať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IDataUploadForm, ComponentProps>({
	form: FORM.RESERVATION_IMPORT_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(ReservationsImportForm)

export default form
