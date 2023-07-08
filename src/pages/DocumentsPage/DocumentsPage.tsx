import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Collapse, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { ColumnProps } from 'antd/lib/table'
import { useNavigate } from 'react-router'
import { destroy, initialize } from 'redux-form'
import cx from 'classnames'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import FlagIcon from '../../components/FlagIcon'
import DocumentsForm from './components/DocumentsForm'
import CustomPagination from '../../components/CustomPagination'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, FORM, LANGUAGE, PAGINATION } from '../../utils/enums'
import { formatDateByLocale, getExpandIcon, getRelativeTimeValue } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { withPermissions } from '../../utils/Permissions'
import { LOCALES } from '../../components/LanguagePicker'

// reducers
import { getAssetTypes, getDocuments, IDocumentAssetTypeItem, IDocumentLangaugeItem, setDocumentsActiveKeys } from '../../reducers/documents/documentActions'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as UploadIcon } from '../../assets/icons/upload-icon.svg'
import { ReactComponent as RefreshIcon } from '../../assets/icons/refresh-icon.svg'

// hooks
import useQueryParams, { formatObjToQuery } from '../../hooks/useQueryParamsZod'

// schemas
import { documentsPageURLQueryParamsSchema, IDocumentsAssetTypesPageURLQueryParams } from '../../schemas/queryParams'
import { IDocumentForm } from '../../schemas/document'

const { Panel } = Collapse

const DocumentsPage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const navigate = useNavigate()
	const documents = useSelector((state: RootState) => state.documents.documents)
	const [visible, setVisible] = useState(false)
	const isLoading = documents?.isLoading

	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov')
			}
		]
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === documents?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	useEffect(() => {
		dispatch(getAssetTypes())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		dispatch(getDocuments(query))
	}, [dispatch, query])

	const getColumns = useCallback(
		(assetType: IDocumentAssetTypeItem['assetType']): ColumnProps<IDocumentLangaugeItem>[] => [
			{
				title: t('loc:Jazyk'),
				dataIndex: 'languageCode',
				key: 'languageCode',
				width: '33.333%',
				ellipsis: true,
				render: (_value, record) => {
					return (
						<div className={cx('flex items-center gap-2 text-notino-black', { 'opacity-50': record.isEmpty })}>
							<FlagIcon countryCode={record.languageCode.toLowerCase() as LANGUAGE} />
							{LOCALES[record.languageCode as LANGUAGE]?.countryCode?.toUpperCase()}
							{!record.isEmpty && <span className={'truncate text-xxs text-notino-grayDarker'}>{t('loc:pozrieť detail')}</span>}
						</div>
					)
				}
			},
			{
				title: t('loc:Dokument nahratý pred'),
				dataIndex: 'createdAt',
				key: 'createdAt',
				width: '33.333%',
				ellipsis: true,
				render: (_value, record) =>
					record.createdAt ? (
						<span
							className={
								'text-xxs leading-3 font-medium h-4 px-2 min-w-11 justify-center inline-flex items-center truncate rounded-full bg-notino-grayLight text-notino-gray-darker'
							}
						>
							{getRelativeTimeValue(record.createdAt)}
						</span>
					) : null
			},
			{
				title: t('loc:Dátum poslednej aktualizácie'),
				dataIndex: 'lastUpdatedAt',
				key: 'lastUpdatedAt',
				className: 'text-xs',
				width: '33.333%',
				ellipsis: true,
				render: (_value, record) => (record.lastUpdatedAt ? formatDateByLocale(record.lastUpdatedAt) : null)
			},
			{
				dataIndex: '',
				align: 'right',
				width: '240px',
				render(val, record) {
					return (
						<Button
							onClick={(e) => {
								e.stopPropagation()
								setVisible(true)
								dispatch(
									initialize(FORM.DOCUMENTS_FORM, {
										assetType: {
											key: assetType.key,
											value: assetType.key,
											label: assetType.name,
											extra: {
												mimeTypes: assetType.mimeTypes,
												fileType: assetType.fileType
												/* maxFilesCount: assetType.maxFilesCount // todo */
											}
										},
										languageCode: record.languageCode,
										id: record.id
									})
								)
							}}
							type='primary'
							htmlType='button'
							size={'small'}
							className={'noti-btn w-full'}
							icon={record.isEmpty ? <UploadIcon className={'w-4 h-4'} /> : <RefreshIcon className={'w-4 h-4'} />}
						>
							<span className={'pl-4'}>{record.isEmpty ? t('loc:Nahrať dokument') : t('loc:Aktualizovať dokument')}</span>
						</Button>
					)
				}
			}
		],
		[dispatch, t]
	)

	const fileUploadSubmit = async (values: IDocumentForm) => {
		try {
			const fileIDs = values?.files?.map((item) => item.id)
			await postReq('/api/b2b/admin/documents/', undefined, {
				languageCode: values?.languageCode as any,
				fileIDs: fileIDs as any,
				message: values?.message || null,
				assetType: values?.assetType.value as ASSET_TYPE
			})
			setVisible(false)
			dispatch(destroy(FORM.DOCUMENTS_FORM))
			dispatch(getDocuments(query))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return (
		<>
			<div className={'collapsed-tables-list'}>
				<div className={'collapsed-tables-list-inner-wrapper'}>
					<Spin spinning={isLoading} />
					<Row>
						<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
					</Row>
					<h2 className={'text-2xl mb-4 mt-8'}>{t('loc:Prehľad dokumentov')}</h2>
					<div className={'content-body transparent-background'}>
						<div className={'services-collapse-wrapper'}>
							<Collapse
								bordered={false}
								activeKey={documents.documentsActiveKeys || []}
								onChange={(newKeys) => dispatch(setDocumentsActiveKeys(typeof newKeys === 'string' ? [newKeys] : newKeys))}
								expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive)}
							>
								{documents.tableData?.map((assetType) => {
									return (
										<Panel key={assetType.assetType.key} className={'panel panel-category'} header={<h4>{assetType.assetType.name}</h4>}>
											<CustomTable<IDocumentLangaugeItem>
												className={'table-fixed noti-collapse-panel-table bordered'}
												wrapperClassName={'overflow-hidden'}
												columns={getColumns(assetType.assetType)}
												dataSource={assetType.langauges}
												pagination={false}
												rowKey={'id'}
												rowClassName={(record) => cx('h-10', { 'clickable-row': !record.isEmpty })}
												scroll={{ x: 800 }}
												onRow={(record) => ({
													onClick: () => {
														if (!record.isEmpty) {
															navigate({
																pathname: t('paths:documents/{{assetType}}', { assetType: assetType.assetType.key }),
																search: formatObjToQuery<IDocumentsAssetTypesPageURLQueryParams>({
																	languageCode: record.languageCode
																})
															})
														}
													}
												})}
											/>
										</Panel>
									)
								})}
							</Collapse>
						</div>
						<div className={'content-footer collapsed-tables-list-footer'} id={'content-footer-container'}>
							<CustomPagination
								pageSize={documents?.data?.pagination?.limit}
								total={documents?.data?.pagination?.totalCount}
								current={documents?.data?.pagination?.page}
								onChange={onChangePagination}
								disabled={documents?.isLoading}
								showSizeChanger={false}
							/>
						</div>
					</div>
				</div>
				<DocumentsForm visible={visible} setVisible={setVisible} onSubmit={fileUploadSubmit} />
			</div>
		</>
	)
}
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsPage)
