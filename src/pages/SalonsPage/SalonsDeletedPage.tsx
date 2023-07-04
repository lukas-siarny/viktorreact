import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, isPristine } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import SalonsDeletedFilter, { ISalonsDeletedFilter } from './components/filters/SalonsDeletedFilter'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT, SALONS_TAB_KEYS } from '../../utils/enums'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys } from '../../utils/helper'
import { SalonsPageCommonProps, getSalonsColumns } from './components/salonUtils'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { salonsDeletedPageURLQueryParamsSchema } from '../../schemas/queryParams'

type Props = SalonsPageCommonProps & {}

const SalonsDeletedPage: React.FC<Props> = (props) => {
	const { selectedCountry, changeSelectedCountry, t, dispatch, navigate } = props

	const salons = useSelector((state: RootState) => state.salons.salons)
	const categories = useSelector((state: RootState) => state.categories.categories)
	const isFormPristine = useSelector((state: RootState) => isPristine(FORM.SALONS_FILTER_DELETED)(state))

	const [query, setQuery] = useQueryParams(salonsDeletedPageURLQueryParamsSchema, {
		page: 1,
		order: 'createdAt:DESC'
	})

	const salonsColumns = useMemo(() => getSalonsColumns(query.order, categories.data), [query.order, categories.data])

	const columns = [
		salonsColumns.id({ width: '8%' }),
		salonsColumns.name({ width: '20%' }),
		salonsColumns.address({ width: '16%' }),
		salonsColumns.categories({ width: '16%' }),
		salonsColumns.deletedAt({ width: '16%' }),
		salonsColumns.fillingProgress({ width: '16%' }),
		salonsColumns.createdAt({ width: '20%' })
	]

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	useEffect(() => {
		const countryCode = isFormPristine ? selectedCountry : query.countryCode

		dispatch(
			initialize(FORM.SALONS_FILTER_DELETED, {
				search: query.search,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				categoryThirdLevelIDs: query.categoryThirdLevelIDs,
				countryCode
			})
		)
		dispatch(
			getSalons({
				page: query.page,
				limit: query.limit,
				search: query.search,
				order: query.order,
				countryCode,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				categoryThirdLevelIDs: query.categoryThirdLevelIDs,
				salonState: SALONS_TAB_KEYS.DELETED
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryFirstLevelIDs, query.countryCode, query.categoryThirdLevelIDs, selectedCountry])

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

	const handleSubmitDeleted = (values: ISalonsDeletedFilter) => {
		changeSelectedCountry(values?.countryCode || undefined)

		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<Spin spinning={salons?.isLoading}>
					<div className='content-body'>
						<SalonsDeletedFilter onSubmit={handleSubmitDeleted} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns || []}
							dataSource={salons?.data?.salons}
							scroll={{ x: 1000 }}
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

export default SalonsDeletedPage
