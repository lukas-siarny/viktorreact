import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'

// utils
import { showErrorNotification, validationRequired } from '../utils/helper'
import { FORM } from '../utils/enums'

// types
import { IDataUploadForm } from '../types/interfaces'

// atoms, pages, components, assets
import FileUploadField from '../atoms/FileUploadField'
import UploadSuccess from '../pages/SalonsPage/components/UploadSuccess'
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
	setUploadStatus: React.Dispatch<React.SetStateAction<'uploading' | 'success' | 'error' | undefined>>
	uploadStatus: 'uploading' | 'success' | 'error' | undefined
	title: string
	label: string
	accept: string
	disabledForm?: boolean
	inModal?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const ImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, disabledForm, pristine, inModal = true, visible, setVisible, setUploadStatus, uploadStatus, title, label, accept } = props
	const resetUploadForm = () => {
		setUploadStatus(undefined)
		reset(FORM.IMPORT_FORM)
	}

	const importForm = (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
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
			<Spin spinning={uploadStatus === 'uploading'}>{uploadStatus === 'success' ? <UploadSuccess onUploadAgain={resetUploadForm} /> : <>{importForm}</>}</Spin>
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
