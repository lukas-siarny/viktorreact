import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'
import { useDispatch } from 'react-redux'

// utils
import { formFieldID, showErrorNotification, validationRequired } from '../../../utils/helper'
import { FORM, IMPORT_TYPE, REQUEST_STATUS, SUBMIT_BUTTON_ID } from '../../../utils/enums'

// types
import { IDataUploadForm } from '../../../types/interfaces'

// atoms, pages, components, assets
import FileUploadField from '../../../atoms/FileUploadField'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-modal.svg'
import RequestSuccess from '../../../components/RequestSuccess'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<any>>
	setRequestStatus: (status?: REQUEST_STATUS) => void
	requestStatus: REQUEST_STATUS | undefined
	accept: string
	disabledForm?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const ImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, pristine, visible, setVisible, setRequestStatus, requestStatus, accept } = props
	const resetUploadForm = () => {
		setRequestStatus(undefined)
		dispatch(reset(FORM.DOCUMENTS_FORM))
	}

	const importForm = (
		<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
			<Field
				component={FileUploadField}
				name={'file'}
				label={t('loc:Vyberte súbor vo formáte .pdf')}
				accept={accept}
				maxCount={100}
				type={'file'}
				disabled={submitting}
				handleUploadOutside
				validate={validationRequired}
				required
			/>
			<Button
				id={formFieldID(FORM.DOCUMENTS_FORM, SUBMIT_BUTTON_ID)}
				className='noti-btn'
				block
				size='large'
				type='primary'
				htmlType='submit'
				disabled={disabledForm || submitting || pristine}
				loading={submitting}
			>
				{t('loc:Nahrať')}
			</Button>
		</Form>
	)

	return (
		<Modal
			className='rounded-fields'
			title={t('loc:Nahrať dokument')}
			centered
			open={visible}
			destroyOnClose
			footer={null}
			onCancel={() => {
				resetUploadForm()
				setVisible(false)
			}}
			closeIcon={<CloseIcon />}
			width={394}
			maskClosable={false}
			keyboard={false}
		>
			<Spin spinning={requestStatus === REQUEST_STATUS.SUBMITTING}>
				{requestStatus === REQUEST_STATUS.SUCCESS ? <RequestSuccess onRequestAgain={resetUploadForm} /> : <>{importForm}</>}
			</Spin>
		</Modal>
	)
}

const form = reduxForm<IDataUploadForm, ComponentProps>({
	form: FORM.DOCUMENTS_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(ImportForm)

export default form
