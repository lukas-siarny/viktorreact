import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row, Spin, Typography } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useParams } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import FlagIcon from '../../components/FlagIcon'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, LANGUAGE, PAGINATION, ROW_GUTTER_X_DEFAULT, DEFAULT_LANGUAGE } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { Columns, IBreadcrumbs } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'
import useBackUrl from '../../hooks/useBackUrl'

// redux
import { getAssetTypes, getDocumentsByAssetType } from '../../reducers/documents/documentActions'

// schemas
import { documentsAssetTypesPageURLQueryParamsSchema } from '../../schemas/queryParams'

const { Paragraph } = Typography

const DocumentsByAssetTypePage = () => {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const { assetType } = useParams<Required<{ assetType: ASSET_TYPE }>>()
	const documentsByAssetType = useSelector((state: RootState) => state.documents.documentsByAssetType)
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)
	const fileName = assetTypes?.data?.assetTypes.find((item) => item.key === assetType)?.name
	const isLoading = documentsByAssetType?.isLoading
	const [backUrl] = useBackUrl(t('paths:documents'))

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
				name: fileName || ''
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

	const columns: Columns = [
		{
			title: t('loc:Názov typu dokumentu'),
			dataIndex: ['assetType', 'name'],
			key: 'name',
			ellipsis: true,
			render: (value, record) => {
				return (
					<div className={'flex items-center'}>
						<FlagIcon countryCode={record.languageCode?.toLowerCase()} />
						<span>{value}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Sprievodná správa'),
			dataIndex: 'message',
			key: 'message',
			width: '20%',
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
			render: (value) => (value ? formatDateByLocale(value) : '-')
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
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={isLoading}>
							<CustomTable
								className='table-fixed table-expandable'
								onChange={onChangeTable}
								columns={columns}
								dataSource={documentsByAssetType.data?.documents || []}
								twoToneRows
								rowKey='id'
								pagination={{
									pageSize: documentsByAssetType?.data?.pagination?.limit,
									total: documentsByAssetType?.data?.pagination?.totalCount,
									current: documentsByAssetType?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: documentsByAssetType?.isLoading
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}
export default compose(withPermissions([...ADMIN_PERMISSIONS]))(DocumentsByAssetTypePage)
