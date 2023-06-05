import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { formFieldID, optionRenderWithImage, showErrorNotification, validationRequired } from '../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, IMPORT_TYPE, REQUEST_STATUS, SUBMIT_BUTTON_ID } from '../../../utils/enums'

// types
import { IDataUploadForm } from '../../../types/interfaces'

// atoms, pages, components, assets
import FileUploadField from '../../../atoms/FileUploadField'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-modal.svg'
import RequestSuccess from '../../../components/RequestSuccess'
import SelectField from '../../../atoms/SelectField'
import { RootState } from '../../../reducers'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import TextareaField from '../../../atoms/TextareaField'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<any>>
	setRequestStatus: (status?: REQUEST_STATUS) => void
	requestStatus: REQUEST_STATUS | undefined
	accept: string
	disabledForm?: boolean
}

type Props = InjectedFormProps<IDataUploadForm, ComponentProps> & ComponentProps

const DocumentsForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, pristine, visible, setVisible, setRequestStatus, requestStatus, accept } = props
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)

	const resetUploadForm = () => {
		setRequestStatus(undefined)
		dispatch(reset(FORM.DOCUMENTS_FORM))
	}

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
				{requestStatus === REQUEST_STATUS.SUCCESS ? (
					<RequestSuccess onRequestAgain={resetUploadForm} />
				) : (
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
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'languageCode'}
							placeholder={t('loc:Jazyk')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
						<Field
							component={SelectField}
							name={'assetType'}
							placeholder={t('loc:Typ dokumentu')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={assetTypes?.options}
							loading={assetTypes?.isLoading}
							disabled={assetTypes?.isLoading}
						/>
						<Field name={'message'} label={t('loc:Sprievodná správa')} placeholder={t('loc:Zadajte sprievodnú správu')} className={'pb-0'} component={TextareaField} />
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
				)}
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
})(DocumentsForm)

export default form
