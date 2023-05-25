import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'
import { useDispatch } from 'react-redux'

// utils
import { formFieldID, showErrorNotification, validationRequired } from '../utils/helper'
import { FORM, IMPORT_TYPE, REQUEST_STATUS, SUBMIT_BUTTON_ID } from '../utils/enums'

// types
import { IDataUploadForm } from '../types/interfaces'

// atoms, pages, components, assets
import FileUploadField from '../atoms/FileUploadField'
import UploadSuccess from './RequestSuccess'
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon-modal.svg'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
	setRequestStatus: (status?: REQUEST_STATUS) => void
	requestStatus: REQUEST_STATUS | undefined
	title: string
	extraContent?: JSX.Element
	label: string
	accept: string
	disabledForm?: boolean
	type?: IMPORT_TYPE
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const ImportForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const {
		handleSubmit,
		submitting,
		disabledForm,
		pristine,
		visible,
		setVisible,
		setRequestStatus,
		requestStatus,
		title,
		label,
		accept,
		extraContent,
		type = IMPORT_TYPE.IMPORT
	} = props
	const resetUploadForm = () => {
		setRequestStatus(undefined)
		dispatch(reset(FORM.IMPORT_FORM))
	}
	console.log('importtype', type)
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
			{extraContent}
			<Button
				id={formFieldID(FORM.IMPORT_FORM, SUBMIT_BUTTON_ID)}
				className='noti-btn'
				block
				size='large'
				type='primary'
				htmlType='submit'
				disabled={disabledForm || submitting || pristine}
				loading={submitting}
			>
				{type === IMPORT_TYPE.IMPORT ? t('loc:Importovať') : t('loc:Nahrať')}
			</Button>
		</Form>
	)

	return (
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
			<Spin spinning={requestStatus === REQUEST_STATUS.SUBMITTING}>
				{requestStatus === REQUEST_STATUS.SUCCESS && type === IMPORT_TYPE.IMPORT ? <UploadSuccess onRequestAgain={resetUploadForm} /> : <>{importForm}</>}
			</Spin>
		</Modal>
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
