import React, { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react'
import { WrappedFieldProps, change } from 'redux-form'
import { isEmpty, isEqual, get, map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Form, Upload, UploadProps, Image } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'
import cx from 'classnames'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'

// utils
import { uploadImage } from '../utils/request'
import { formFieldID, getImagesFormValues, getMaxSizeNotifMessage, ImgUploadParam } from '../utils/helper'
import showNotifications from '../utils/tsxHelpers'
import { MSG_TYPE, NOTIFICATION_TYPE, UPLOAD_IMG_CATEGORIES, IMAGE_UPLOADING_PROP } from '../utils/enums'

const { Item } = Form

type Props = WrappedFieldProps &
	FormItemProps &
	UploadProps & {
		category: UPLOAD_IMG_CATEGORIES
		pathToFolder: string
		staticMode?: boolean
		// /** Max file size in Bytes */
		maxFileSize: number
		// endpoint which returns signed url for image upload
		signUrl: string
		className?: CSSProperties
		uploaderClassName?: string
	}

interface IPreviewFile {
	type: string | undefined
	url: string
}

/**
 * Umoznuje nahrat obrazky na podpisanu url
 */
const ImgUploadField: FC<Props> = (props) => {
	const {
		label,
		input,
		required,
		meta: { form, error, touched },
		staticMode,
		accept = 'image/jpeg,image/png',
		maxFileSize,
		disabled,
		signUrl,
		multiple,
		maxCount = 20,
		category,
		className = '',
		uploaderClassName = ''
	} = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const imagesUrls = useRef<ImgUploadParam>({})
	const [previewUrl, setPreviewUrl] = useState<IPreviewFile | null>(null)
	const [images, setImages] = useState<any[]>([])

	const onChange = async (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === 'error') {
			showNotifications([{ type: MSG_TYPE.ERROR, message: info.file.error.message }], NOTIFICATION_TYPE.NOTIFICATION)
			// remove current uploaded image due to error when uploading to aws
			const values = info.fileList
			values.pop()
			input.onChange(values)

			// uploading process finished
			dispatch(change(form, IMAGE_UPLOADING_PROP, false))
		}
		if (info.file.status === 'done' || info.file.status === 'removed') {
			const values = getImagesFormValues(info.fileList, imagesUrls.current)
			// order application/['pdf'] file type to end of array
			values.sort((a: any, b: any) => {
				if (!a.type || !b.type) {
					return 0
				}
				return a.type.length - b.type.length
			})
			input.onChange(values)

			// uploading process finished
			dispatch(change(form, IMAGE_UPLOADING_PROP, false))
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

	const uploader = (
		<Upload
			id={formFieldID(form, input.name)}
			className={cx(uploaderClassName, '-mb-2')}
			accept={accept}
			disabled={disabled}
			onChange={onChange}
			listType='picture-card'
			multiple={multiple}
			customRequest={(options: any) => {
				dispatch(change(form, IMAGE_UPLOADING_PROP, true))
				uploadImage(options, signUrl, category, imagesUrls)
			}}
			fileList={input.value || []}
			onPreview={(file) => setPreviewUrl({ url: file.url || get(imagesUrls, `current.[${file.uid}].url`), type: file.type })}
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

	useEffect(() => {
		if (!isEmpty(input.value)) {
			// filter application/pdf file
			setImages(input.value.filter((file: any) => file.type !== 'application/pdf'))
		}
	}, [input.value])

	const openPdf = () => {
		// open application pdf
		if (previewUrl?.type === 'application/pdf') {
			window.open(previewUrl.url)
			setPreviewUrl(null)
		}
	}

	return (
		<Item
			className={`${className ?? 'w-full'}`}
			label={label}
			required={required}
			help={touched && error ? error : undefined}
			validateStatus={touched && error ? 'error' : undefined}
		>
			{staticMode && !input.value && '-'}
			{uploader}
			<div className={'hidden'}>
				<Image.PreviewGroup
					preview={{
						visible: !!previewUrl && previewUrl?.type !== 'application/pdf',
						onVisibleChange: () => setPreviewUrl(null),
						current: images?.findIndex((image: any) => image?.url === previewUrl?.url)
					}}
				>
					{map(images, (image) => (
						<Image key={image.url} src={image.url} fallback={image.thumbUrl} />
					))}
				</Image.PreviewGroup>
			</div>
			{openPdf()}
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
