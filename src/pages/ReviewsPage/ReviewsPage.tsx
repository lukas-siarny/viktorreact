import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ReviewsFilter, { IUsersFilter } from './components/ReviewsFilter'

// utils
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'
import { getReviews } from '../../reducers/reviews/reviewsActions'
import salonsReducer from '../../reducers/salons/salonsReducer'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_BROWSING]

const ReviewsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const reviews = useSelector((state: RootState) => state.reviews.reviews)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'toxicityScore:DESC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.REVIEWS_FILTER, { search: query.search }))
		dispatch(getReviews({ page: query.page, limit: query.limit, order: query.order, search: query.search }))
	}, [dispatch, query.page, query.limit, query.search, query.order])

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

	const handleSubmit = (values: IUsersFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'userName',
			key: 'userName',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Salón'),
			dataIndex: 'salon',
			key: 'salon',
			ellipsis: true,
			width: '15%',
			render: (value) => {
				return value?.name || value?.id || '-'
			}
		},
		{
			title: t('loc:Rating'),
			dataIndex: 'rating',
			key: 'rating',
			ellipsis: true,
			width: '25%'
		},
		{
			title: t('loc:Toxicita'),
			dataIndex: 'toxicityScore',
			key: 'toxicityScore',
			ellipsis: true,
			width: '15%',
			sorter: true,
			sortOrder: setOrder(query.order, 'toxicityScore'),
			render: (value, record) => <>{value}</>
		},
		{
			title: t('loc:Status'),
			dataIndex: 'verificationStatus',
			key: 'verificationStatus',
			ellipsis: true,
			width: '15%',
			onCell: (value) => {
				return value
			}
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam recenzií')
			}
		]
	}

	console.log({ data: reviews })

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={reviews?.isLoading}>
							<ReviewsFilter onSubmit={handleSubmit} />
							<CustomTable
								className='table-fixed'
								onChange={onChangeTable}
								columns={columns}
								dataSource={reviews?.data?.reviews}
								// rowClassName={'clickable-row'}
								twoToneRows
								rowKey='id'
								scroll={{ x: 800 }}
								/* onRow={(record) => ({
									onClick: () => {
										history.push(getLinkWithEncodedBackUrl(t('paths:users/{{userID}}', { userID: record.id })))
									}
								})} */
								useCustomPagination
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

export default compose(withPermissions(permissions))(ReviewsPage)
