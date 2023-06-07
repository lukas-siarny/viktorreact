import React, { FC, useMemo, useRef } from 'react'
import { WrappedFieldProps } from 'redux-form'
import { get, isEmpty, isEqual } from 'lodash'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Form, Upload, UploadProps } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'

import { NOTIFICATION_TYPE, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_FILE } from '../utils/enums'
import { getAccessToken } from '../utils/auth'
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import showNotifications from '../utils/tsxHelpers'
import { formFieldID, formatFileFormValues, getMaxSizeNotifMessage, ImgUploadParam } from '../utils/helper'
import { uploadFiles } from '../utils/request'

const { Item } = Form

export interface IFileUploadFieldValue {
	id: string
	name: string
	url: string
}

type Props = WrappedFieldProps &
	FormItemProps &
	UploadProps & {
		category: UPLOAD_IMG_CATEGORIES
		pathToFolder: string
		staticMode?: boolean
		// handleUploadOutside - len zobrazi nahrate subory z pocitaca, o upload je potrebne sa postarat mimo komponentu, len pre FE nahravanie
		handleUploadOutside?: boolean
		// /** Max file size in Bytes */
		maxFileSize: number
	}

/**
 * Umožňuje nahrať jeden súbor, nový súbor nahradí pôvodný
 */
const FileUploadField: FC<Props> = (props) => {
	const {
		label,
		input,
		required,
		meta: { error, touched, form },
		action,
		pathToFolder,
		staticMode,
		accept,
		maxFileSize,
		handleUploadOutside = true,
		disabled,
		className,
		multiple,
		maxCount,
		category
	} = props

	const [t] = useTranslation()
	const imagesUrls = useRef<ImgUploadParam>({})

	const onChange = async (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === 'error') {
			// NOTE: if uploaded file has a bad format (eg. txt)
			showNotifications(info.file.response?.messages, NOTIFICATION_TYPE.NOTIFICATION)
		}
		if (info.file.status === 'done') {
			const values = formatFileFormValues(info.fileList, imagesUrls.current)
			if (multiple) {
				input.onChange(values)
			} else {
				const value = {
					id: get(info.file.response, 'file.id'),
					name: get(info.file.response, 'file.displayName'),
					url: `/api/v1/static/${get(info.file.response, 'file.path')}`
				}
				input.onChange(value)
			}
		}
		if (info.file.status === 'uploading') {
			input.onChange(info.fileList)
		}
		if (info.file.status === 'removed') {
			input.onChange(null)
		}
		if (isEmpty(info.fileList)) {
			input.onChange(multiple ? [] : null)
		}
	}

	const showUploadList = useMemo(
		() => ({
			showRemoveIcon: !staticMode,
			showPreviewIcon: !handleUploadOutside
		}),
		[staticMode, handleUploadOutside]
	)

	const uploader = (
		<Upload
			className={'-mb-2'}
			headers={{
				Authorization: `Bearer ${getAccessToken()}`
			}}
			action={action}
			customRequest={(options) => {
				if (handleUploadOutside) {
					// FE upload (nezavola sa BE). Sluzi len pre !SINGLE! upload multiple nebude fungovat
					input.onChange([options.file])
				} else {
					// BE upload ktory podpise url na s3 - funguje aj multiple
					uploadFiles(options, URL_UPLOAD_FILE, category, imagesUrls)
				}
			}}
			accept={accept}
			disabled={disabled}
			data={{ pathToFolder }}
			onChange={onChange}
			beforeUpload={(file) => {
				if (file.size >= maxFileSize) {
					const messages = [getMaxSizeNotifMessage(maxFileSize)]
					showNotifications(messages, NOTIFICATION_TYPE.NOTIFICATION)
					return false
				}
				return true
			}}
			showUploadList={showUploadList}
			fileList={input.value || []}
			listType='picture-card'
			id={formFieldID(form, input.name)}
			multiple={multiple}
			maxCount={maxCount}
		>
			{!staticMode && (
				<div>
					<UploadIcon className={`text-xl  ${touched && error ? 'text-red-600' : 'text-gray-600'}`} />
					<div className={`text-sm upload-input ${touched && error ? 'text-red-600' : 'text-gray-600'}`}>{handleUploadOutside ? t('loc:Vybrať') : t('loc:Nahrať')}</div>
				</div>
			)}
		</Upload>
	)

	return (
		<Item
			className={cx(className, 'file-upload-field', { 'hide-overlay': staticMode, disabled })}
			label={label}
			required={required}
			style={{ width: '100%' }}
			help={touched && error}
			validateStatus={touched && error ? 'error' : undefined}
		>
			{staticMode && !input.value && '-'}
			{uploader}
		</Item>
	)
}

// NOTE: Prevent voči animácii po submitnutí formulára
export default React.memo(FileUploadField, (prevProps, nextProps) => {
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
