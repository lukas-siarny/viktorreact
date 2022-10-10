import React, { CSSProperties, FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WrappedFieldProps, change } from 'redux-form'
import { isEmpty, isEqual, get, map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Form, Upload, UploadProps, Image, Popconfirm, Button, Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import cx from 'classnames'

// utils
import { uploadImage } from '../utils/request'
import { formFieldID, getImagesFormValues, getMaxSizeNotifMessage, ImgUploadParam, splitArrayByCondition } from '../utils/helper'
import showNotifications from '../utils/tsxHelpers'
import { MSG_TYPE, NOTIFICATION_TYPE, UPLOAD_IMG_CATEGORIES, IMAGE_UPLOADING_PROP } from '../utils/enums'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as EyeIcon } from '../assets/icons/eye-icon.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'
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
		draggable?: boolean
		selectable?: boolean
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
		uploaderClassName = '',
		draggable = false,
		selectable = false
	} = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const imagesUrls = useRef<ImgUploadParam>({})
	const [previewUrl, setPreviewUrl] = useState<IPreviewFile | null>(null)
	const [images, setImages] = useState<any[]>([])
	const [selectedValues, setSelectedValues] = useState<CheckboxValueType[]>([])

	useEffect(() => {
		if (!isEmpty(input.value)) {
			// filter application/pdf file
			setImages(input.value.filter((file: any) => file.type !== 'application/pdf' || !!isFilePDF(file.url)))
			// set selected images in gallery
			const selected: string[] = []
			input.value?.forEach((file: any) => file?.isCover && selected.push(file?.uid))
			setSelectedValues(selected)
		}
	}, [input.value])

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
		<>
			<div className={'ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card p-0'}>
				<div className={'ant-upload-list-item-info flex items-center justify-center'}>
					{file.type === 'application/pdf' || !!isFilePDF(file.url) ? (
						<div className={'flex items-center justify-center'}>
							<PdfIcon />
							{file.name}
						</div>
					) : (
						<Image src={file.thumbUrl || file.url} alt={file.name} fallback={file.url} className='ant-upload-list-item-image' />
					)}
				</div>
				<span className={'ant-upload-list-item-actions w-full h-full'}>
					<div className={'w-full flex items-center h-full'}>
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
								className='ant-btn ant-btn-text ant-btn-sm ant-btn-icon-only ant-upload-list-item-card-actions-btn flex items-center justify-center fixed top-1 right-1 z-50'
							>
								<span role='img' aria-label='delete' tabIndex={-1} className='anticon anticon-delete w-full h-full'>
									<RemoveIcon className='remove-icon-image' width={18} />
								</span>
							</button>
						</Popconfirm>
						<Button
							type={'link'}
							htmlType={'button'}
							className={'flex items-center justify-center m-0 p-0 w-full h-full'}
							onClick={() => actions.preview()}
							target='_blank'
							rel='noopener noreferrer'
							title='Preview file'
						>
							<span role='img' aria-label='eye' className='anticon anticon-eye w-6'>
								<EyeIcon width={24} />
							</span>
						</Button>
					</div>
				</span>
			</div>
			{selectable && (
				<div className={'w-full flex items-center justify-center'}>
					<Checkbox key={file?.uid} value={file?.uid} />
				</div>
			)}
		</>
	)

	const DragableUploadListItem = (originNode: ReactElement, file: UploadFile, fileList: object[], actions: any, moveRow: any) => {
		const type = 'DragableUploadList'
		const ref = useRef(null)
		const index = fileList.indexOf(file)
		const [{ isOver, dropClassName }, drop] = useDrop({
			accept: type,
			collect: (monitor) => {
				const { index: dragIndex } = monitor.getItem() || {}
				if (dragIndex === index) {
					return {}
				}
				return {
					isOver: monitor.isOver(),
					dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
				}
			},
			drop: (item: any) => {
				moveRow(item?.index, index)
			}
		})
		const [, drag] = useDrag({
			type,
			item: { index },
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			})
		})
		drop(drag(ref))
		return (
			<div
				ref={ref}
				className={cx('upload-draggable-list-item w-full h-full', {
					[`${dropClassName}`]: isOver
				})}
			>
				{renderGalleryImage(originNode, file, fileList, actions)}
			</div>
		)
	}

	const moveRow = (dragIndex: number, hoverIndex: number) => {
		const dragRow = images[dragIndex]
		input.onChange(
			update([...images], {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragRow]
				]
			})
		)
	}

	const selectImage = (checkedValue: CheckboxValueType[]) => {
		const updatedImages = images.map((image) => {
			if (checkedValue.includes(image?.uid)) {
				return { ...image, isCover: true }
			}
			return { ...image, isCover: false }
		})
		input.onChange([...updatedImages])
	}

	const openPdf = () => {
		// open application pdf
		if (previewUrl?.type === 'application/pdf') {
			window.open(previewUrl.url)
			setPreviewUrl(null)
		}
	}

	const uploader = (
		<DndProvider backend={HTML5Backend}>
			<Checkbox.Group value={selectedValues} onChange={selectImage}>
				<Upload
					id={formFieldID(form, input.name)}
					className={cx(uploaderClassName, '-mb-2', { 'draggable-upload': draggable, 'selectable-upload': selectable })}
					accept={accept}
					disabled={disabled}
					onChange={onChange}
					listType='picture-card'
					multiple={multiple}
					customRequest={(options: any) => {
						dispatch(change(form, IMAGE_UPLOADING_PROP, true))
						uploadImage(options, signUrl, category, imagesUrls)
					}}
					itemRender={(originNode, file, currFileList, actions) =>
						draggable ? DragableUploadListItem(originNode, file, currFileList, actions, moveRow) : renderGalleryImage(originNode, file, currFileList, actions)
					}
					// itemRender={renderGalleryImage}
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
								showNotifications(
									[{ type: MSG_TYPE.ERROR, message: t('loc:Nahrajte maximálne {{maxCount}} súborov', { maxCount }) }],
									NOTIFICATION_TYPE.NOTIFICATION
								)
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
			</Checkbox.Group>
		</DndProvider>
	)

	return (
		<Item
			className={`${className ?? 'w-full'} noti-upload-item`}
			label={label}
			required={required}
			help={touched && error ? error : undefined}
			validateStatus={touched && error ? 'error' : undefined}
		>
			{staticMode && !input.value && '-'}
			{uploader}
			{!!previewUrl && (
				<>
					<div className={cx('download', { hidden: !previewUrl, fixed: previewUrl })}>
						<Button
							className={'w-full h-full m-0 p-0'}
							href={`${previewUrl?.url}?response-content-disposition=attachment`}
							target='_blank'
							rel='noopener noreferrer'
							type={'link'}
							htmlType={'button'}
							title='Download file'
							download
						>
							<span role='img' aria-label='download' className='w-full h-full flex items-center justify-center'>
								<DownloadIcon width={24} />
							</span>
						</Button>
					</div>
					<div className={'hidden'}>
						<Image.PreviewGroup
							preview={{
								visible: !!previewUrl && (previewUrl?.type !== 'application/pdf' || !isFilePDF(previewUrl?.url)),
								onVisibleChange: () => setPreviewUrl(null),
								current: images?.findIndex((image: any) => image?.url === previewUrl?.url)
							}}
						>
							{map(images, (image) => (
								<Image key={image.url} src={image.url} fallback={image.thumbUrl} />
							))}
						</Image.PreviewGroup>
					</div>
				</>
			)}
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
