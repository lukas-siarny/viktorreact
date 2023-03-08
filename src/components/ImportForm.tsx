import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'

// utils
import { useDispatch } from 'react-redux'
import { showErrorNotification, validationRequired } from '../utils/helper'
import { FORM, UPLOAD_STATUS } from '../utils/enums'

// types
import { IDataUploadForm } from '../types/interfaces'

// atoms, pages, components, assets
import FileUploadField from '../atoms/FileUploadField'
import UploadSuccess from './UploadSuccess'
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
	setUploadStatus: React.Dispatch<React.SetStateAction<UPLOAD_STATUS | undefined>>
	uploadStatus: UPLOAD_STATUS | undefined
	title: string
	label: string
	accept: string
	disabledForm?: boolean
	inModal?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const ImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, pristine, inModal = true, visible, setVisible, setUploadStatus, uploadStatus, title, label, accept } = props
	const resetUploadForm = () => {
		setUploadStatus(undefined)
		dispatch(reset(FORM.IMPORT_FORM))
	}

	const importForm = (
		<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
			<Field
				component={FileUploadField}
				name={'file'}
				label={label}
				accept={accept}
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

	return inModal ? (
		<Modal
			className='rounded-fields'
			title={title}
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
			<Spin spinning={uploadStatus === UPLOAD_STATUS.UPLOADING}>
				{uploadStatus === UPLOAD_STATUS.SUCCESS ? <UploadSuccess onUploadAgain={resetUploadForm} /> : <>{importForm}</>}
			</Spin>
		</Modal>
	) : (
		<>{importForm}</>
	)
}

const form = reduxForm<IDataUploadForm, ComponentProps>({
	form: FORM.IMPORT_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(ImportForm)

export default form
