import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin, Typography } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useParams } from 'react-router-dom'
import { destroy, initialize } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import FlagIcon from '../../components/FlagIcon'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, LANGUAGE, PAGINATION, DEFAULT_LANGUAGE, FORM, STRINGS } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'
import { LOCALES } from '../../components/LanguagePicker'

// reducers
import { RootState } from '../../reducers'

// types
import { Columns, IBreadcrumbs } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'
import useBackUrl from '../../hooks/useBackUrl'

// redux
import { getAssetTypes, getDocumentsByAssetType } from '../../reducers/documents/documentActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// schemas
import { documentsAssetTypesPageURLQueryParamsSchema } from '../../schemas/queryParams'
import DocumentsForm from './components/DocumentsForm'
import { IDocumentForm } from '../../schemas/document'
import { postReq } from '../../utils/request'

const { Paragraph } = Typography

const DocumentsByAssetTypePage = () => {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const { assetType } = useParams<Required<{ assetType: ASSET_TYPE }>>()

	const documentsByAssetType = useSelector((state: RootState) => state.documents.documentsByAssetType)
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)

	const [visible, setVisible] = useState(false)

	const [backUrl] = useBackUrl(t('paths:documents'))

	const assetTypeItem = assetTypes?.data?.assetTypes.find((item) => item.key === assetType)
	const assetTypeName = assetTypeItem?.name
	const isLoading = documentsByAssetType?.isLoading

	const [query, setQuery] = useQueryParams(documentsAssetTypesPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit,
		languageCode: (i18n.language || DEFAULT_LANGUAGE) as LANGUAGE
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov'),
				link: backUrl
			},
			{
				name: assetTypeName || ''
			}
		]
	}

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				order
			}
			setQuery(newQuery)
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === documentsByAssetType?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}
	useEffect(() => {
		dispatch(getAssetTypes())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (assetType) {
			dispatch(getDocumentsByAssetType({ ...query, assetType }))
		}
	}, [assetType, dispatch, query])

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
			if (assetType) {
				dispatch(getDocumentsByAssetType({ ...query, assetType }))
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Jazyk'),
			dataIndex: 'countryCode',
			key: 'countryCode',
			ellipsis: true,
			width: '15%',
			render: (value, record) => {
				return (
					<div className={'flex items-center'}>
						<FlagIcon countryCode={record.languageCode?.toLowerCase()} />
						{LOCALES[record.languageCode as LANGUAGE]?.countryCode?.toUpperCase()}
					</div>
				)
			}
		},
		{
			title: t('loc:Sprievodná správa'),
			dataIndex: 'message',
			key: 'message',
			width: '35%',
			render: (value) => (
				<Paragraph
					className={'m-0 whitespace-pre-wrap'}
					ellipsis={{
						rows: 1,
						expandable: true,
						symbol: t('loc:Zobraziť viac')
					}}
					title={value}
				>
					{value}
				</Paragraph>
			)
		},
		{
			title: t('loc:Dátum poslednej aktualizácie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			width: '250',
			render: (value) => (value ? formatDateByLocale(value, true) : null)
		},
		{
			title: t('loc:História aktualizácii dokumentov'),
			dataIndex: 'files',
			key: 'files',
			ellipsis: true,
			render: (value) => {
				return value.map((item: any) => {
					return (
						<Button
							key={item.id}
							className={'noti-btn text-notino-pink text-left p-0 hover:text-black'}
							href={item.original}
							target='_blank'
							rel='noopener noreferrer'
							type={'link'}
							htmlType={'button'}
							download
						>
							{item.fileName}
						</Button>
					)
				})
			}
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:documents')} />
			</Row>
			<h2 className={'text-2xl mb-4 mt-8'}>{t('loc:História aktualizácií dokumentu')}</h2>
			<div className='content-body transparent-background'>
				<Spin spinning={isLoading}>
					<div className={'flex items-center justify-between bg-notino-grayLighter p-4 min-h-16 '}>
						<h3 className={'mb-0 text-base text-bold'}>{assetTypeName}</h3>
						<Button
							onClick={(e) => {
								e.stopPropagation()
								setVisible(true)
								if (assetTypeItem) {
									dispatch(
										initialize(FORM.DOCUMENTS_FORM, {
											assetType: {
												key: assetTypeItem.key,
												value: assetTypeItem.key,
												label: assetTypeItem.name,
												extra: {
													mimeTypes: assetTypeItem.mimeTypes,
													fileType: assetTypeItem.fileType,
													maxFilesCount: assetTypeItem.maxFilesCount
												}
											},
											languageCode: query.languageCode,
											id: assetTypeItem.key
										})
									)
								}
							}}
							type='primary'
							htmlType='button'
							className={'noti-btn'}
							icon={<PlusIcon />}
						>
							{t('loc:Nahrať dokument')}
						</Button>
					</div>
					<CustomTable
						className='table-fixed noti-collapse-panel-table bordered'
						wrapperClassName={'noti-collapse-panel-table-wrapper'}
						onChange={onChangeTable}
						columns={columns}
						dataSource={documentsByAssetType.data?.documents || []}
						rowClassName={'h-10 py-3'}
						rowKey='id'
						useCustomPagination
						pagination={{
							pageSize: documentsByAssetType?.data?.pagination?.limit,
							total: documentsByAssetType?.data?.pagination?.totalCount,
							current: documentsByAssetType?.data?.pagination?.page,
							onChange: onChangePagination,
							disabled: documentsByAssetType?.isLoading
						}}
					/>
				</Spin>
				<DocumentsForm visible={visible} setVisible={setVisible} onSubmit={fileUploadSubmit} />
			</div>
		</>
	)
}
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsByAssetTypePage)
