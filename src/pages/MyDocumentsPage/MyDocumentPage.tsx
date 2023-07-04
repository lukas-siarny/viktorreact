import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

// types
import { IBreadcrumbs, MyDocumentDetail } from '../../types/interfaces'
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// assets
import { ReactComponent as AttachIcon } from '../../assets/icons/attach-icon.svg'

// utils
import { formatDateByLocale } from '../../utils/helper'
import { patchReq } from '../../utils/request'

// redux
import { getCurrentUser, getUserDocuments } from '../../reducers/users/userActions'

const MyDocumentPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { documentID } = useParams<{ documentID?: string }>()

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const [documentData, setDocumentData] = useState<MyDocumentDetail | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const userID = authUser?.data?.id

	useEffect(() => {
		;(async () => {
			if (userID && documentID) {
				setIsLoading(true)
				try {
					const { data } = await dispatch(getUserDocuments(userID))
					const document = data?.documents.find((d) => d.id === documentID)
					if (document) {
						setDocumentData(document)
					} else {
						navigate('/404')
					}
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e)
				} finally {
					setIsLoading(false)
				}
			}
		})()
	}, [dispatch, navigate, userID, documentID])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Dokumenty'),
				link: t('paths:my-documents')
			},
			{
				name: documentData?.name || ''
			}
		]
	}

	const markAsRead = async (fileID: string) => {
		if (documentData?.readAt) {
			return
		}

		if (documentID && userID) {
			try {
				await patchReq('/api/b2b/admin/users/{userID}/documents/{documentID}/mark-as-read', { userID, documentID }, { fileIDs: [fileID] })
				// refresh documents to prevent another markAsRead action for already read document
				await dispatch(getUserDocuments(userID))
				// refresh current user to update badge in My profile menu
				dispatch(getCurrentUser())
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:my-documents')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body medium'>
					<h4 className={'text-notino-black text-lg mb-6'}>{documentData?.name}</h4>
					<p className={'text-notino-grayDarker whitespace-pre-wrap'}>{documentData?.message}</p>
					<p className={'text-notino-grayDarker mb-6'}>
						{t('loc:Platnosť od')}: {formatDateByLocale(documentData?.createdAt)}
					</p>
					<div className={'border-t border-t-notino-grayLight pt-4 flex flex-col items-start'} style={{ borderTopStyle: 'solid' }}>
						{documentData?.files.map((file) => {
							return (
								<a
									key={file.id}
									href={file.original}
									target='_blank'
									rel='noreferrer'
									onClick={() => markAsRead(file.id)}
									className={'text-notino-pink hover:text-notino-black inline-flex items-center gap-2'}
								>
									<AttachIcon className={'flex-shrink-0 text-notino-black'} />
									{file.fileName}
								</a>
							)
						})}
					</div>
				</div>
			</Spin>
		</>
	)
}

export default MyDocumentPage
