import React, { FC, useMemo, useRef, useState } from 'react'
import { WrappedFieldProps } from 'redux-form'
import { isEmpty, isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Form, Upload, UploadProps, Modal } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg'

// utils
import { uploadFile, postReq } from '../utils/request'
import { getImagesFormValues, getMaxSizeNotifMessage, ImgUploadParam } from '../utils/helper'
import showNotifications from '../utils/tsxHelpers'
import { MSG_TYPE, NOTIFICATION_TYPE } from '../utils/enums'

const { Item } = Form

type Props = WrappedFieldProps &
	FormItemProps &
	UploadProps & {
		pathToFolder: string
		staticMode?: boolean
		// /** Max file size in Bytes */
		maxFileSize: number
		// endpoint which returns signed url for image upload
		signUrl: string
	}

// export type ImgUploadParam = { [key: string]: { uid: string } }

/**
 * Umoznuje nahrat obrazky na podpisanu url
 */
const ImgUploadField: FC<Props> = (props) => {
	const {
		label,
		input,
		required,
		meta: { error, touched },
		staticMode,
		accept = 'image/jpeg,image/png',
		maxFileSize,
		disabled,
		signUrl,
		multiple,
		maxCount = 20
	} = props

	const [t] = useTranslation()
	const imagesUrls = useRef<ImgUploadParam>({})
	const [previewUrl, setPreviewUrl] = useState('')
	const onChange = async (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === 'error') {
			showNotifications([{ type: MSG_TYPE.ERROR, message: info.file.error.message }], NOTIFICATION_TYPE.NOTIFICATION)
		}
		if (info.file.status === 'done' || info.file.status === 'removed') {
			const values = getImagesFormValues(info.fileList, imagesUrls.current)
			input.onChange(values)
		}
		if (info.file.status === 'uploading') {
			input.onChange(info.fileList)
		}
		if (isEmpty(info.fileList)) {
			input.onChange(null)
		}
	}

	const showUploadList = useMemo(
		() => ({
			showRemoveIcon: !staticMode,
			showPreviewIcon: true
		}),
		[staticMode]
	)

	const handleAction = async (file: any) => {
		const { uid, name, size, type } = file
		const files = [{ name, size, mimeType: type }]

		const { data } = await postReq(signUrl as any, undefined, { files })
		const imgData = data?.files?.[0]
		imagesUrls.current[uid] = { uid, ...imgData }

		return imgData.signedUrl
	}

	const uploader = (
		<Upload
			className={'-mb-2'}
			accept={accept}
			action={handleAction}
			disabled={disabled}
			onChange={onChange}
			listType='picture-card'
			multiple={multiple}
			customRequest={uploadFile}
			fileList={input.value || []}
			onPreview={(file) => setPreviewUrl(file.url || imagesUrls.current?.[file.uid]?.url)}
			maxCount={maxCount}
			showUploadList={showUploadList}
			beforeUpload={(file, fileList) => {
				if (file.size >= maxFileSize) {
					const messages = [getMaxSizeNotifMessage(maxFileSize)]
					showNotifications(messages, NOTIFICATION_TYPE.NOTIFICATION)
					return Upload.LIST_IGNORE
				}

				if (fileList.length > maxCount) {
					const { uid: uidCurrent } = file
					const { uid: uidLast } = fileList[fileList.length - 1]
					if (uidCurrent === uidLast)
						showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Nahrajte maximálne {{maxCount}} súborov', { maxCount }) }], NOTIFICATION_TYPE.NOTIFICATION)
					return Upload.LIST_IGNORE
				}
				return true
			}}
		>
			{!staticMode && input.value.length < maxCount && (
				<div>
					<UploadIcon className={`text-xl ${touched && error ? 'text-red-600' : 'text-gray-600'}`} />
					<div className={`text-sm ${touched && error ? 'text-red-600' : 'text-gray-600'}`}>{t('loc:Nahrať')}</div>
				</div>
			)}
		</Upload>
	)

	return (
		<Item className='w-full' label={label} required={required} help={touched && error ? error : undefined} validateStatus={touched && error ? 'error' : undefined}>
			{staticMode && !input.value && '-'}
			{uploader}
			<Modal visible={!!previewUrl} onCancel={() => setPreviewUrl('')} footer={null} closeIcon={<CloseIcon />}>
				<img key={previewUrl} className={'w-full'} src={previewUrl} alt='preview' />
			</Modal>
		</Item>
	)
}

// NOTE: Prevent voči animácii po submitnutí formulára
export default React.memo(ImgUploadField, (prevProps, nextProps) => {
	const theSameError = prevProps.meta.error === nextProps.meta.error
	const theSameTouched = prevProps.meta.touched === nextProps.meta.touched

	// NOTE: Shallow fast comparision
	if (!theSameError || !theSameTouched) {
		return false // Rerender
	}

	// NOTE: Deep slower comparision
	const theSameInput = isEqual(prevProps.input, nextProps.input)
	if (!theSameInput) {
		return false // Rerender
	}

	return true
})
