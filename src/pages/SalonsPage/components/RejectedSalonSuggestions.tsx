import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../../components/CustomTable'
import RejectedSuggestionsFilter from './filters/RejectedSuggestionsFilter'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { normalizeDirectionKeys, setOrder, normalizeQueryParams, getLinkWithEncodedBackUrl } from '../../../utils/helper'
import { history } from '../../../utils/history'

// reducers
import { RootState } from '../../../reducers'
import { getRejectedSuggestions } from '../../../reducers/salons/salonsActions'

// types
import { ISearchFilter, Columns } from '../../../types/interfaces'

const RejectedSalonSuggestions = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salons = useSelector((state: RootState) => state.salons.rejectedSuggestions)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'salonName:ASC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.FILTER_REJECTED_SUGGESTIONS, { search: query.search }))
		dispatch(getRejectedSuggestions({ page: query.page, limit: query.limit, order: query.order, search: query.search }))
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

	const handleSubmit = (values: ISearchFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(normalizeQueryParams(newQuery))
	}

	const columns: Columns = [
		{
			title: t('loc:Salón'),
			className: 'heading-4 text-left',
			children: [
				{
					title: t('loc:Názov'),
					dataIndex: 'salonName',
					key: 'salonName',
					ellipsis: true,
					sorter: true,
					sortOrder: setOrder(query.order, 'salonName')
				},
				{
					title: t('loc:Adresa'),
					dataIndex: 'address',
					key: 'address',
					ellipsis: true,
					sorter: false
				},
				{
					title: t('loc:Email'),
					dataIndex: 'salonMail',
					key: 'salonMail',
					ellipsis: true,
					sorter: false
				}
			]
		},
		{
			title: t('loc:Používateľ'),
			className: 'heading-4 text-left',
			children: [
				{
					title: t('loc:Meno a Priezvisko'),
					dataIndex: 'userLastName',
					key: 'userLastName',
					ellipsis: true,
					sorter: true,
					sortOrder: setOrder(query.order, 'userLastName')
				},
				{
					title: t('loc:Email'),
					dataIndex: 'userEmail',
					key: 'userEmail',
					ellipsis: true,
					sorter: true,
					sortOrder: setOrder(query.order, 'userEmail')
				},
				{
					title: t('loc:Telefón'),
					dataIndex: 'userPhone',
					key: 'userPhone',
					ellipsis: true,
					sorter: false
				}
			]
		}
	]

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={salons?.isLoading}>
						<RejectedSuggestionsFilter onSubmit={handleSubmit} total={salons?.data?.pagination?.totalCount} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={salons?.tableData}
							rowClassName={'clickable-row'}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								onClick: () => {
									history.push(getLinkWithEncodedBackUrl(t('paths:salons/{{salonID}}', { salonID: record.salonID })))
								}
							})}
							useCustomPagination
							pagination={{
								pageSize: salons?.data?.pagination?.limit,
								total: salons?.data?.pagination?.totalCount,
								current: salons?.data?.pagination?.page,
								disabled: salons?.isLoading,
								onChange: onChangePagination
							}}
						/>
					</Spin>
				</div>
			</Col>
		</Row>
	)
}
export default RejectedSalonSuggestions