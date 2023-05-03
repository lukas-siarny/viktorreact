import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import cx from 'classnames'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ADMIN_PERMISSIONS, PERMISSION, REVIEW_VERIFICATION_STATUS, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { Columns, IBreadcrumbs } from '../../types/interfaces'

// assets

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'

const getRowId = (verificationStatus: string, id: string) => `${verificationStatus}_${id}`

const DocumentsPage = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	// TODO: logika na otvorenie modalu so selectom krajiny ak nie je picknuta
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	// TODO: dokumenty
	const reviews = useSelector((state: RootState) => state.reviews.reviews)

	const [query, setQuery] = useQueryParams({
		limit: NumberParam(),
		page: NumberParam(1),
		order: StringParam('toxicityScore:DESC')
	})

	const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isLoading = isSubmitting || reviews?.isLoading

	const fetchDocuments = useCallback(async () => {
		// TODO: get action
	}, [dispatch, selectedCountry])

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

	// Delete document
	// const deleteReview = async (reviewID: string) => {
	// 	if (isSubmitting) {
	// 		return
	// 	}
	// 	try {
	// 		setIsSubmitting(true)
	// 		await deleteReq('/api/b2b/admin/reviews/{reviewID}', { reviewID })
	// 		fetchDocuments()
	// 	} catch (error: any) {
	// 		// eslint-disable-next-line no-console
	// 		console.error(error.message)
	// 	} finally {
	// 		setIsSubmitting(false)
	// 	}
	// }

	const getColumns = () => {
		const columns: Columns = [
			{
				title: t('loc:Názov typu dokumentu'),
				dataIndex: 'name',
				key: 'name',
				ellipsis: true,
				render: (value) => value || '-'
			},
			{
				title: t('loc:Dátum poslednej aktualizácie'),
				dataIndex: 'updatedAt',
				key: 'updatedAt',
				ellipsis: true,
				render: (value) => (value ? formatDateByLocale(value) : '-')
			}
		]

		return columns
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Prehľad dokumentov')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<Spin spinning={isLoading}>
							<CustomTable
								className='table-fixed table-expandable'
								onChange={onChangeTable}
								columns={getColumns()}
								dataSource={reviews?.data?.reviews}
								rowKey={(record) => getRowId(record.verificationStatus, record.id)}
								twoToneRows
								pagination={{
									pageSize: reviews?.data?.pagination?.limit,
									total: reviews?.data?.pagination?.totalCount,
									current: reviews?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: reviews?.isLoading
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}
// TODO: sprait opravnenia
export default compose(withPermissions([...ADMIN_PERMISSIONS, PERMISSION.REVIEW_READ]))(DocumentsPage)
