import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useParams } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ADMIN_PERMISSIONS, ASSET_TYPE, PAGINATION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
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
import { getDocumentsByAssetType } from '../../reducers/documents/documentActions'

// schemas
import { documentsPageURLQueryParamsSchema } from '../../schemas/queryParams'

const DocumentsByAssetTypePage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { assetType } = useParams<Required<{ assetType: ASSET_TYPE }>>()
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const documentsByAssetType = useSelector((state: RootState) => state.documents.documentsByAssetType)
	const [query, setQuery] = useQueryParams(documentsPageURLQueryParamsSchema, {
		page: 1,
		limit: PAGINATION.limit
	})

	const isLoading = documentsByAssetType?.isLoading
	const [backUrl] = useBackUrl(t('paths:documents'))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov'),
				link: backUrl
			},
			{
				// TODO: zmenit podla nazvu dokuemntu
				name: t('loc:Prehľad dokumentov podľa typu')
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
			page
		}
		setQuery(newQuery)
	}

	useEffect(() => {
		if (assetType && selectedCountry) {
			dispatch(getDocumentsByAssetType({ ...query, countryCode: selectedCountry, assetType }))
		}
	}, [assetType, dispatch, query, selectedCountry])

	const columns: Columns = [
		{
			title: t('loc:Názov typu dokumentu'),
			dataIndex: ['assetType', 'name'],
			key: 'name',
			ellipsis: true,
			render: (value) => value || '-'
		},
		{
			title: t('loc:Dátum poslednej aktualizácie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			render: (value) => (value ? formatDateByLocale(value) : '-')
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:documents')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<Spin spinning={isLoading}>
							<CustomTable
								className='table-fixed table-expandable'
								onChange={onChangeTable}
								columns={columns}
								dataSource={documentsByAssetType.tableData}
								twoToneRows
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
