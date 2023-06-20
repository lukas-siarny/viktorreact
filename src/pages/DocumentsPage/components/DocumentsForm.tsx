import React, { FC, useMemo } from 'react'
import { destroy, Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { formFieldID, optionRenderWithIcon, validationRequired, checkUploadingBeforeSubmit, getMimeTypeName } from '../../../utils/helper'
import { FILE_FILTER_DATA_TYPE, FORM, SUBMIT_BUTTON_ID, UPLOAD, UPLOAD_IMG_CATEGORIES, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// components
import { languageOptions } from '../../../components/LanguagePicker'

// atoms
import FileUploadField from '../../../atoms/FileUploadField'
import SelectField from '../../../atoms/SelectField'
import TextareaField from '../../../atoms/TextareaField'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-modal.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-icon.svg'

// reducers
import { RootState } from '../../../reducers'

// schemas
import { IDocumentForm, validationDocumentFn } from '../../../schemas/document'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<any>>
	disabledForm?: boolean
}

type Props = InjectedFormProps<IDocumentForm, ComponentProps> & ComponentProps

const DocumentsForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, pristine, visible, setVisible } = props
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)
	const formValues: Partial<IDocumentForm> = useSelector((state: RootState) => getFormValues(FORM.DOCUMENTS_FORM)(state))
	const mimeType = getMimeTypeName(formValues?.assetType?.extra?.mimeTypes, formValues?.assetType?.extra?.fileType)

	return (
		<Modal
			className='rounded-fields'
			title={formValues?.id ? t('loc:Aktualizovať dokument') : t('loc:Nahrať dokument')}
			centered
			open={visible}
			destroyOnClose
			footer={null}
			onCancel={() => {
				dispatch(destroy(FORM.DOCUMENTS_FORM))
				setVisible(false)
			}}
			closeIcon={<CloseIcon />}
			width={394}
			maskClosable={false}
			keyboard={false}
		>
			<Spin spinning={submitting}>
				<Form onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)} layout={'vertical'} className={'form'}>
					<Field
						component={SelectField}
						name={'assetType'}
						label={t('loc:Vyberte typ dokumentu')}
						placeholder={t('loc:Typ dokumentu')}
						allowClear
						size={'large'}
						filterOptions
						required
						onDidMountSearch
						labelInValue
						readOnly={formValues?.id}
						options={assetTypes?.options}
						loading={assetTypes?.isLoading}
						disabled={assetTypes?.isLoading}
					/>
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithIcon(itemData, <GlobeIcon />)}
						name={'languageCode'}
						label={t('loc:Vyberte jazyk')}
						placeholder={t('loc:Jazyk')}
						allowClear
						size={'large'}
						filterOptions
						required
						readOnly={formValues?.id}
						onDidMountSearch
						options={languageOptions}
					/>
					<Field
						component={FileUploadField}
						name={'files'}
						label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: mimeType?.formattedNames || '.pdf' })}
						accept={mimeType?.formattedMimeTypes || 'application/pdf'}
						maxCount={UPLOAD.MAX_COUNT}
						type={'file'}
						category={mimeType?.fileType === FILE_FILTER_DATA_TYPE.DOC ? UPLOAD_IMG_CATEGORIES.ASSET_DOC_TYPE : UPLOAD_IMG_CATEGORIES.ASSET_IMAGE_TYPE}
						multiple
						handleUploadOutside={false}
						disabled={submitting || !formValues?.assetType}
						validate={validationRequired}
						required
					/>
					{/* // Message ffield nebude pre dokumenty typu IMAGE dostupný */}
					{formValues?.assetType?.extra?.fileType === FILE_FILTER_DATA_TYPE.IMAGE ? undefined : (
						<Field
							name={'message'}
							label={t('loc:Sprievodná správa')}
							placeholder={t('loc:Zadajte sprievodnú správu')}
							className={'pb-4'}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_255}
							showLettersCount
							component={TextareaField}
						/>
					)}
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
			</Spin>
		</Modal>
	)
}

const form = reduxForm<IDocumentForm, ComponentProps>({
	form: FORM.DOCUMENTS_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validationDocumentFn
})(DocumentsForm)

export default form
