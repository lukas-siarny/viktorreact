import React, { FC, useMemo, useState } from 'react'
import { WrappedFieldProps } from 'redux-form'
import i18next from 'i18next'
import { get, isEmpty, isEqual } from 'lodash'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Form, Upload, UploadProps } from 'antd'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { FormItemProps } from 'antd/lib/form/FormItem'

import { MSG_TYPE, NOTIFICATION_TYPE } from '../utils/enums'
import { getAccessToken } from '../utils/auth'
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
// eslint-disable-next-line import/no-cycle
import showNotifications from '../utils/tsxHelpers'

const { Item } = Form

export interface IFileUploadFieldValue {
	id: string
	name: string
	url: string
}

type Props = WrappedFieldProps &
	FormItemProps &
	UploadProps & {
		pathToFolder: string
		staticMode?: boolean
		// handleUploadOutside - len zobrazi nahrate subory z pocitaca, o upload je potrebne sa postarat mimo komponentu
		handleUploadOutside?: boolean
		// /** Max file size in Bytes */
		maxFileSize: number
	}

export const getMaxSizeNotifMessage = (maxFileSize: any) => {
	let notifMaxSize
	if (maxFileSize >= 10 ** 6) {
		notifMaxSize = [maxFileSize / 10 ** 6, 'MB']
	} else {
		notifMaxSize = [maxFileSize / 10 ** 3, 'KB']
	}
	return {
		type: MSG_TYPE.ERROR,
		message: i18next.t('loc:Súbor je príliš veľký (max. {{size}} {{unit}})', {
			size: notifMaxSize[0],
			unit: notifMaxSize[1]
		})
	}
}

/**
 * Umožňuje nahrať jeden súbor, nový súbor nahradí pôvodný
 */
const FileUploadField: FC<Props> = (props) => {
	const {
		label,
		input,
		required,
		meta: { error, touched },
		action,
		pathToFolder,
		staticMode,
		accept,
		maxFileSize,
		handleUploadOutside = true,
		disabled
	} = props

	const [t] = useTranslation()

	const [loadedFile, setLoadedFile] = useState<string | RcFile | Blob>()

	const getFileList = () => {
		if (handleUploadOutside) {
			return loadedFile ? [loadedFile] : []
		}
		return input.value || []
	}

	const onChange = async (info: UploadChangeParam<UploadFile<any>>) => {
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
		if (info.file.status === 'removed') {
			input.onChange(null)
			setLoadedFile(undefined)
		}
		if (isEmpty(info.fileList)) {
			input.onChange(null)
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
			customRequest={
				handleUploadOutside
					? (options) => {
							setLoadedFile(options.file)
							input.onChange(options.file)
					  }
					: undefined
			}
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
			fileList={getFileList()}
			listType='picture-card'
		>
			{!staticMode && (
				<div>
					<UploadIcon className={`text-xl ${touched && error ? 'text-red-600' : 'text-gray-600'}`} />
					<div className={`text-sm ${touched && error ? 'text-red-600' : 'text-gray-600'}`}>{handleUploadOutside ? t('loc:Vybrať') : t('loc:Nahrať')}</div>
				</div>
			)}
		</Upload>
	)

	return (
		<Item
			className={cx('file-upload-field', { 'hide-overlay': staticMode, disabled })}
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
