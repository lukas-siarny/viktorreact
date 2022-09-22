import React, { CSSProperties, FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { WrappedFieldProps, change } from 'redux-form'
import { isEmpty, isEqual, get, map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Form, Upload, UploadProps, Image, Popconfirm, Divider, Button } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'
import cx from 'classnames'

// utils
import { uploadImage } from '../utils/request'
import { formFieldID, getImagesFormValues, getMaxSizeNotifMessage, ImgUploadParam, splitArrayByCondition } from '../utils/helper'
import showNotifications from '../utils/tsxHelpers'
import { MSG_TYPE, NOTIFICATION_TYPE, UPLOAD_IMG_CATEGORIES, IMAGE_UPLOADING_PROP } from '../utils/enums'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as EyeIcon } from '../assets/icons/eye-icon.svg'
import { ReactComponent as BinIcon } from '../assets/icons/bin-icon.svg'
import { ReactComponent as DownloadIcon } from '../assets/icons/download-icon.svg'
import { ReactComponent as PdfIcon } from '../assets/icons/pdf-icon.svg'

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

const isFilePDF = (fileUrl?: string): string | undefined => {
	if (!fileUrl) {
		return undefined
	}

	return fileUrl.endsWith('.pdf') ? 'application/pdf' : undefined
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
			const splitted = splitArrayByCondition(values, (item: any) => item.type !== 'application/pdf')
			const sorted = [...splitted[0], ...splitted[1]]

			setImages(splitted[0])
			input.onChange(sorted)

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

	const renderGalleryImage = (originNode: ReactElement, file: UploadFile, fileList: object[], actions: { download: any; preview: any; remove: any }) => (
		<div className={'ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card p-0'}>
			<div className={'ant-upload-list-item-info flex items-center justify-center'}>
				{file.type !== 'application/pdf' ? (
					<Image src={file.thumbUrl} alt={file.name} fallback={file.url} className='ant-upload-list-item-image' />
				) : (
					<div className={'flex items-center justify-center'}>
						<PdfIcon />
						{file.name}
					</div>
				)}
			</div>
			<span className={'ant-upload-list-item-actions w-full h-full'}>
				<div className={'w-full flex items-center h-1/2'}>
					<Button
						className={'flex items-center justify-center w-1/2 m-0 p-0'}
						href={`${file.url}?response-content-disposition=attachment`}
						target='_blank'
						rel='noopener noreferrer'
						type={'link'}
						htmlType={'button'}
						title='Download file'
						download
					>
						<span role='img' aria-label='download' className='anticon anticon-download w-full'>
							<DownloadIcon width={24} />
						</span>
					</Button>
					<Divider className={'m-0 p-0 h-full'} type='vertical' />
					<Button
						type={'link'}
						htmlType={'button'}
						className={'flex items-center justify-center w-1/2 m-0 p-0'}
						onClick={() => actions.preview()}
						target='_blank'
						rel='noopener noreferrer'
						title='Preview file'
					>
						<span role='img' aria-label='eye' className='anticon anticon-eye w-full'>
							<EyeIcon width={24} />
						</span>
					</Button>
				</div>
				<Divider className={'m-0 p-0'} type='horizontal' />
				<div className={'w-full flex items-center h-1/2'}>
					<Popconfirm
						placement={'top'}
						title={t('loc:Naozaj chcete odstrániť súbor?')}
						okButtonProps={{
							type: 'default',
							className: 'noti-btn'
						}}
						cancelButtonProps={{
							type: 'primary',
							className: 'noti-btn'
						}}
						okText={t('loc:Zmazať')}
						onConfirm={() => actions.remove()}
						cancelText={t('loc:Zrušiť')}
						disabled={disabled}
					>
						<button
							title='Remove file'
							type='button'
							className='ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn flex items-center justify-center w-1/2'
						>
							<span role='img' aria-label='delete' tabIndex={-1} className='anticon anticon-delete w-full'>
								<BinIcon width={24} />
							</span>
						</button>
					</Popconfirm>
					<Divider className={'m-0 p-0 h-full'} type='vertical' />
				</div>
			</span>
		</div>
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
			itemRender={renderGalleryImage}
			fileList={input.value || []}
			onPreview={(file) => setPreviewUrl({ url: file.url || get(imagesUrls, `current.[${file.uid}].url`), type: file.type || isFilePDF(file.url) })}
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
			setImages(input.value.filter((file: any) => file.type !== 'application/pdf' || !!isFilePDF(file.url)))
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
						current: images?.findIndex((image: any) => image?.url === previewUrl?.url),
						countRender: (current: number, total: number) => `${current}/${total}`
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
