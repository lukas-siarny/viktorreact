import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Spin } from 'antd'
import { useNavigate } from 'react-router'
import { ColumnProps } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'

// utils
import { formatDateByLocale } from '../../utils/helper'

// assets
import { ReactComponent as DocumentIcon } from '../../assets/icons/document-icon.svg'

// types
import { IBreadcrumbs, MyDocumentDetail } from '../../types/interfaces'
import { RootState } from '../../reducers'

// redux
import { getUserDocuments } from '../../reducers/users/userActions'

const commonBadgeSyles = 'text-xs leading-4 font-medium h-6 px-2 inline-flex items-center truncate rounded-full'

const MyDocumentsPage = () => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const userDocuments = useSelector((state: RootState) => state.user.userDocuments)

	useEffect(() => {
		if (authUser?.data?.id) {
			dispatch(getUserDocuments(authUser.data.id))
		}
	}, [dispatch, authUser?.data?.id])

	const columns: ColumnProps<MyDocumentDetail>[] = [
		{
			title: t('loc:Názov dokumentu'),
			dataIndex: 'name',
			key: 'name',
			width: '40%',
			ellipsis: true,
			render: (value) => {
				return (
					<div className={'flex items-center gap-3'}>
						<DocumentIcon className={'text-notino-gray flex-shrink-0'} />
						<span className={'truncate font-semibold text-notino-black'}>{value}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Stav'),
			dataIndex: 'readAt',
			key: 'readAt',
			width: '40%',
			ellipsis: true,
			render: (_value, record) => {
				const isNew = !record.readAt

				return isNew ? (
					<span className={`${commonBadgeSyles} bg-notino-pink text-notino-white`}>{t('loc:Nové')}</span>
				) : (
					<span className={`${commonBadgeSyles} bg-notino-grayLighter text-notino-gray-darker`}>{formatDateByLocale(record.readAt)}</span>
				)
			}
		},
		{
			title: t('loc:Platnosť od'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			align: 'right',
			width: '20%',
			ellipsis: true,
			render: (_value, record) => {
				return <span className={'text-notino-grayDark'}>{formatDateByLocale(record.createdAt, true)}</span>
			}
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [{ name: t('loc:Dokumenty') }]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>

			<div className='content-body medium no-padding overflow-hidden'>
				<Spin spinning={userDocuments.isLoading}>
					<CustomTable
						className='table-my-documents'
						columns={columns}
						dataSource={userDocuments.data?.documents}
						rowClassName={'clickable-row'}
						rowKey='id'
						onRow={(record) => ({
							onClick: () => {
								navigate(t('paths:my-documents/{{documentID}}', { documentID: record.id }))
							}
						})}
						pagination={false}
					/>
				</Spin>
			</div>
		</>
	)
}

export default MyDocumentsPage
