import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { WrappedFieldProps } from 'redux-form'
import { get, isEmpty, isEqual } from 'lodash'
import { useTranslation } from 'react-i18next'
import Cropper from 'react-easy-crop'
import cx from 'classnames'

// ant
import { Button, Form, Modal, Slider, Upload } from 'antd'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'

// utils
import { NOTIFICATION_TYPE } from '../utils/enums'
import { getAccessToken } from '../utils/auth'
// eslint-disable-next-line import/no-cycle
import { getMaxSizeNotifMessage } from './FileUploadField'

// assets
import { ReactComponent as UnassignIcon } from '../assets/icons/unassign-icon.svg'
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as AssignIcon } from '../assets/icons/assign-icon.svg'
// eslint-disable-next-line import/no-cycle
import showNotifications from '../utils/tsxHelpers'

const { Item } = Form

export interface IImgUploadFieldValue {
	id: number
	name: string
	url: string
}

type Props = WrappedFieldProps &
	FormItemProps & {
		action: string
		pathToFolder: string
		accept?: string
		staticMode?: boolean
		/** Max file size in Bytes */
		maxFileSize: number
		cropModalTitle?: string
		stampMode?: boolean
		enablePreview?: boolean
	}

const pkg = 'antd-img-crop'
const MEDIA_CLASS = `${pkg}-media`
const ZOOM_STEP = 0.05

const cropperWrapStyle: any = {
	height: 'calc(100vh - 380px)',
	minHeight: 200,
	maxHeight: 600,
	position: 'relative'
}

const ImgUploadField: FC<Props> = (props) => {
	const {
		label,
		input,
		required,
		meta: { error, touched },
		action,
		pathToFolder,
		accept,
		staticMode,
		maxFileSize,
		cropModalTitle,
		stampMode,
		enablePreview
	} = props

	const [t] = useTranslation()
	const [showCropper, setShowCropper] = useState<any>(null)
	const [visiblePreview, setVisiblePreview] = useState(false)
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)

	const cropPixelsRef = useRef<any>()
	const fileRef = useRef<RcFile>()
	const successRef = useRef<any>()
	const failRef = useRef<any>()

	let aspectWrap = 1
	let acceptWrap = accept || 'image/png, image/jpeg'
	let messageWrap: any
	let maxPreviewWidth = 800

	// zoom
	const minZoom = 1
	const maxZoom = 5
	const isMinZoom = zoom - ZOOM_STEP < minZoom
	const isMaxZoom = zoom + ZOOM_STEP > maxZoom

	if (stampMode) {
		aspectWrap = 6.1 / 3.2
		acceptWrap = 'image/png, image/jpeg'
		messageWrap = t('loc:Umiestnite pečiatku s podpisom do modrého rámu.')
		maxPreviewWidth = 600
	}

	const accessToken = getAccessToken()
	const signedUrl = get(input, 'value.url') ? `${get(input, 'value.url')}?t=${accessToken}` : undefined

	const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken])
	const data = useMemo(() => ({ pathToFolder }), [pathToFolder])

	const fileList = useMemo(
		() =>
			input.value
				? [
						{
							...input.value,
							url: signedUrl
						}
				  ]
				: [],
		[input.value, signedUrl]
	)

	const showUploadList = useMemo(
		() => ({
			showRemoveIcon: !staticMode,
			showPreviewIcon: !!enablePreview
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	const onChange = useCallback(
		async (info: UploadChangeParam<UploadFile<any>>) => {
			if (info.file.status === 'error') {
				// NOTE: if uploaded file has a bad format (eg. txt)
				showNotifications(info.file.response?.messages, NOTIFICATION_TYPE.NOTIFICATION)
			}
			if (info.file.status === 'done') {
				const value = {
					id: get(info.file.response, 'file.id'),
					name: get(info.file.response, 'file.displayName'),
					url: `/api/v1/static/${get(info.file.response, 'file.path')}`
				}
				input.onChange(value)
			}
			if (info.file.status === 'uploading' || info.file.status === 'success') {
				input.onChange(info.file)
			}
			if (isEmpty(info.fileList)) {
				input.onChange(null)
			}
		},
		[input]
	)

	const handleCancel = () => {
		setShowCropper(null)
		setZoom(1)
		failRef.current()
	}

	const handleOk = async () => {
		setShowCropper(null)
		setZoom(1)

		const naturalImg = document.querySelector(`.${MEDIA_CLASS}`) as HTMLImageElement
		const { naturalWidth, naturalHeight } = naturalImg

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		// create a max canvas to cover the source image after rotated
		const maxLen = Math.sqrt(naturalWidth ** 2 + naturalHeight ** 2)
		canvas.width = maxLen
		canvas.height = maxLen

		// draw the source image in the center of the max canvas
		const left = (maxLen - naturalWidth) / 2
		const top = (maxLen - naturalHeight) / 2
		ctx?.drawImage(naturalImg, left, top)

		// shrink the max canvas to the crop area size, then align two center points
		const maxImgData = ctx?.getImageData(0, 0, maxLen, maxLen)
		// eslint-disable-next-line object-curly-newline
		const { width, height, x, y } = cropPixelsRef.current
		canvas.width = width
		canvas.height = height
		if (maxImgData) {
			ctx?.putImageData(maxImgData, Math.round(-left - x), Math.round(-top - y))
		}

		// get the new image
		const { type, name, uid } = fileRef.current as RcFile
		canvas.toBlob(
			async (blob) => {
				const newFile: any = new File([blob] as any, name, { type })
				newFile.uid = uid
				successRef.current(newFile, [newFile])
			},
			type,
			1
		)
	}

	const handleCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
		cropPixelsRef.current = croppedAreaPixels
	}

	const handleCropChange = (crp: any) => setCrop(crp)

	const handleZoomChange = (zoooom: number) => setZoom(zoooom)

	// NOTE: Prebrata logika pre zoom slider: https://github.com/nanxiaobei/antd-img-crop/blob/master/src/index.jsx#L195
	const subZoomVal = useCallback(() => {
		if (!isMinZoom) {
			setZoom(zoom - ZOOM_STEP)
		}
	}, [isMinZoom, zoom])

	const addZoomVal = useCallback(() => {
		if (!isMaxZoom) {
			setZoom(zoom + ZOOM_STEP)
		}
	}, [isMaxZoom, zoom])

	return (
		<Item
			className={cx('img-upload-field', { 'hide-overlay': staticMode })}
			label={label}
			required={required}
			style={{ width: '100%' }}
			help={touched && error}
			validateStatus={touched && error ? 'error' : undefined}
		>
			{staticMode && !input.value && '-'}
			<Upload
				className={'-mb-2'}
				headers={headers}
				action={action}
				accept={acceptWrap}
				data={data}
				// NOTE: Ak má používatel právo na úpravu napr. "Firmy" automaticky má právo aj nahrať "Pečiatku"
				// openFileDialogOnClick={hasPermission}
				fileList={fileList}
				onChange={onChange}
				onPreview={() => setVisiblePreview(true)}
				beforeUpload={(file: RcFile) =>
					new Promise((resolve, reject) => {
						if (file.size >= maxFileSize) {
							const messages = [getMaxSizeNotifMessage(maxFileSize)]
							showNotifications(messages, NOTIFICATION_TYPE.NOTIFICATION)
							reject()
						} else {
							fileRef.current = file
							successRef.current = resolve
							failRef.current = reject
							const reader = new FileReader()
							reader.addEventListener('load', () => setShowCropper(reader.result))
							reader.readAsDataURL(file)
						}
					})
				}
				showUploadList={showUploadList}
				listType='picture-card'
			>
				{!staticMode && (
					<div>
						<UploadIcon className={`text-xl ${touched && error ? 'text-red-600' : 'text-gray-600'}`} />
						<div className={`text-sm ${touched && error ? 'text-red-600' : 'text-gray-600'}`}>{t('loc:Nahrať')}</div>
					</div>
				)}
			</Upload>
			{showCropper && (
				<Modal
					className={'img-upload-field-modal top-4 modal-w-600'}
					visible
					getContainer={() => document.body}
					onCancel={handleCancel}
					onOk={handleOk}
					title={cropModalTitle || t('loc:Nahrajte pečiatku')}
				>
					<>
						{messageWrap && <div className={'mb-6'}>{messageWrap}</div>}
						<div style={cropperWrapStyle}>
							<Cropper
								image={showCropper}
								crop={crop}
								zoom={zoom}
								showGrid={false}
								aspect={aspectWrap}
								maxZoom={5}
								onCropChange={handleCropChange}
								onCropComplete={handleCropComplete}
								onZoomChange={handleZoomChange}
								classes={{
									mediaClassName: MEDIA_CLASS,
									cropAreaClassName: cx('img-upload-field-area', { 'stamp-mode': stampMode }),
									containerClassName: 'rounded'
								}}
							/>
						</div>
						<div className='flex justify-between items-center mt-4'>
							<Button onClick={subZoomVal} disabled={isMinZoom} shape={'circle'} size={'small'} className='tp-btn' icon={<UnassignIcon />} />
							<Slider className={'w-full mx-3'} min={minZoom} max={maxZoom} step={ZOOM_STEP} value={zoom} onChange={handleZoomChange} />
							<Button onClick={addZoomVal} disabled={isMaxZoom} shape={'circle'} size={'small'} className='tp-btn' icon={<AssignIcon />} />
						</div>
						<div className={'text-center -mt-1-5'}>Veľkosť obrázka</div>
					</>
				</Modal>
			)}
			<Modal
				// NOTE: Sirka modalu sa prisposobuje sirke obrazku ale len v obmedzenom intervale
				className={'modal-w-fit-content px-4'}
				style={{ minWidth: 240, maxWidth: maxPreviewWidth }}
				bodyStyle={{ minWidth: 240, maxWidth: maxPreviewWidth }}
				visible={visiblePreview}
				onCancel={() => setVisiblePreview(false)}
				footer={null}
			>
				<img className={'w-full'} src={signedUrl} alt='preview' />
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
