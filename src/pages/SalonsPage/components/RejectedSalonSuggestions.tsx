import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useNavigate } from 'react-router-dom'

// components
import CustomTable from '../../../components/CustomTable'
import RejectedSuggestionsFilter from './filters/RejectedSuggestionsFilter'

// utils
import { FORM, ROW_BUTTON_WITH_ID, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { formFieldID, getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../../utils/helper'
import { deleteReq } from '../../../utils/request'

// reducers
import { RootState } from '../../../reducers'
import { getRejectedSuggestions } from '../../../reducers/salons/salonsActions'

// types
import { Columns, ISearchFilter } from '../../../types/interfaces'

// assets
import { ReactComponent as IconCheck } from '../../../assets/icons/checker-icon.svg'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../../hooks/useQueryParams'

const RejectedSalonSuggestions: FC = () => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		limit: NumberParam(),
		page: NumberParam(1),
		order: StringParam('userLastName:ASC')
	})
	const salons = useSelector((state: RootState) => state.salons.rejectedSuggestions)
	const [submitting, setSubmitting] = useState(false)

	const loading = salons?.isLoading || submitting

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
		setQuery(newQuery)
	}

	const markRejectedSalonAsDone = async (salonID: string) => {
		try {
			setSubmitting(true)
			await deleteReq('/api/b2b/admin/salons/{salonID}/rejected-suggestions', { salonID })
			dispatch(getRejectedSuggestions({ page: query.page, limit: query.limit, order: query.order, search: query.search }))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Salón'),
			className: 'heading-4 text-left',
			children: [
				{
					title: <span id={'sortby-title'}>{t('loc:Názov salónu')}</span>,
					dataIndex: 'salonName',
					key: 'salonName',
					ellipsis: true,
					sorter: true,
					sortOrder: setOrder(query.order, 'salonName')
				},
				{
					title: t('loc:Adresa salónu'),
					dataIndex: 'address',
					key: 'address',
					ellipsis: true,
					sorter: false
				},
				{
					title: t('loc:Email salónu'),
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
					title: t('loc:Email používateľa'),
					dataIndex: 'userEmail',
					key: 'userEmail',
					ellipsis: true,
					sorter: true,
					sortOrder: setOrder(query.order, 'userEmail')
				},
				{
					title: t('loc:Telefón používateľa'),
					dataIndex: 'userPhone',
					key: 'userPhone',
					ellipsis: true,
					sorter: false
				}
			]
		},
		{
			key: 'ctaButton',
			width: 150,
			children: [
				{
					title: t('loc:Označiť ako vybavené'),
					dataIndex: 'salonID',
					key: 'markAsDone',
					fixed: salons?.tableData?.length ? 'right' : undefined,
					ellipsis: true,
					width: 150,
					render: (_value, record) => (
						<Button
							type={'primary'}
							onClick={(e) => {
								e.stopPropagation()
								markRejectedSalonAsDone(record?.salonID)
							}}
							icon={<IconCheck style={{ width: 12, height: 12 }} />}
							size={'small'}
							disabled={loading}
							className={'noti-btn m-regular w-full hover:shadow-none focus:shadow-none'}
							id={formFieldID(ROW_BUTTON_WITH_ID(record.id))}
						>
							{t('loc:Vybavené')}
						</Button>
					)
				}
			]
		}
	]

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={loading}>
						<RejectedSuggestionsFilter onSubmit={handleSubmit} total={salons?.data?.pagination?.totalCount} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={salons?.tableData}
							rowClassName={'clickable-row'}
							rowKey={'id'}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								onClick: () => {
									navigate(getLinkWithEncodedBackUrl(t('paths:salons/{{salonID}}', { salonID: record.salonID })))
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
