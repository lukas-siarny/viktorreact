import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Spin, Tooltip } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, isPristine } from 'redux-form'

// components
import { Link } from 'react-router-dom'
import CustomTable from '../../components/CustomTable'

// utils<
import { FORM, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl, normalizeDirectionKeys } from '../../utils/helper'
import { SalonsPageCommonProps, getSalonsColumns } from './components/salonUtils'

// reducers
import { getSalonsToCheck } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { salonsToCheckPageURLQueryParamsSchema } from '../../schemas/queryParams'
import SalonsToCheckFilter, { ISalonsToCheckFilter } from './components/filters/SalonsToCheckFilter'

// types
import { Columns } from '../../types/interfaces'

type Props = SalonsPageCommonProps & {}

const salonsColumns = getSalonsColumns()

const SalonsToCheckPage: React.FC<Props> = (props) => {
	const { selectedCountry, changeSelectedCountry, dispatch, t, navigate } = props

	const salons = useSelector((state: RootState) => state.salons.salonsToCheck)
	const isFormPristine = useSelector((state: RootState) => isPristine(FORM.SALONS_FILTER_ACITVE)(state))

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const [query, setQuery] = useQueryParams(salonsToCheckPageURLQueryParamsSchema, {
		page: 1
	})

	useEffect(() => {
		const countryCode = isFormPristine ? selectedCountry : query.countryCode

		dispatch(
			initialize(FORM.SALONS_TO_CHECK_FILTER, {
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				createType: query.createType,
				assignedUserID: query.assignedUserID,
				countryCode
			})
		)
		dispatch(
			getSalonsToCheck({
				page: query.page,
				limit: query.limit,
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				createType: query.createType,
				assignedUserID: query.assignedUserID,
				countryCode
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		dispatch,
		query.page,
		query.limit,
		query.search,
		query.statuses_all,
		query.statuses_changes,
		query.statuses_published,
		query.createType,
		query.assignedUserID,
		query.countryCode,
		selectedCountry
	])

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

	const handleSubmitFilter = (values: ISalonsToCheckFilter) => {
		// update selected country globally based on filter
		changeSelectedCountry(values?.countryCode || undefined)

		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	const columns: Columns = [
		salonsColumns.id({ width: '8%' }),
		salonsColumns.name({ width: '15%' }),
		salonsColumns.address({ width: '15%' }),
		salonsColumns.isPublished({ width: '8%' }),
		salonsColumns.changes({ width: '10%' }),
		salonsColumns.createType({ width: '10%' }),
		salonsColumns.premiumSourceUserType({ width: '6%' }),
		salonsColumns.assignedUser({ width: '10%' }),
		salonsColumns.lastUpdatedAt({ width: '10%' }),
		salonsColumns.createdAt({ width: '10%' }),
		{
			title: t('loc:Skontroloval'),
			dataIndex: 'checker',
			key: 'checker',
			width: '8%',
			render: (value) => {
				if (value) {
					let name
					if (value.name) {
						name = <div className={'truncate'}>{value.name}</div>
					} else {
						const firstThree = value.id.substring(0, 3)
						const lastThree = value.id.substring(value.id.length - 3)

						name = <Tooltip title={value.id}>{`${firstThree}...${lastThree}`}</Tooltip>
					}

					return (
						<Link to={`${t('paths:users')}/${value.id}`} onClick={(e) => e.stopPropagation()} className={'text-notino-pink hover:text-black'}>
							{name}
						</Link>
					)
				}

				return '-'
			}
		},
		{
			title: t('loc:Dátum poslednej kontroly'),
			dataIndex: 'checkedAt',
			key: 'checkedAt',
			width: '8%',
			render: (value) => (value ? <div className={'truncate'}>{formatDateByLocale(value)}</div> : '-')
		}
	]

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<Spin spinning={salons?.isLoading}>
					<div className='content-body'>
						<SalonsToCheckFilter onSubmit={handleSubmitFilter} query={query} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns || []}
							dataSource={salons?.data?.salons}
							scroll={{ x: 1500 }}
							rowKey='id'
							rowClassName={'clickable-row'}
							twoToneRows
							useCustomPagination
							pagination={{
								pageSize: salons?.data?.pagination?.limit,
								total: salons?.data?.pagination?.totalCount,
								current: salons?.data?.pagination?.page,
								onChange: onChangePagination,
								disabled: salons?.isLoading
							}}
							onRow={(record) => ({
								onClick: () => {
									navigate(getLinkWithEncodedBackUrl(t('paths:salons/{{salonID}}', { salonID: record.id })))
								}
							})}
						/>
					</div>
				</Spin>
			</Col>
		</Row>
	)
}

export default SalonsToCheckPage
