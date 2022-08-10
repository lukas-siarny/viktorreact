import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Button, TablePaginationConfig } from 'antd'
import { compose } from 'redux'
import { find, join } from 'lodash'

// components
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { initialize } from 'redux-form'
import { SorterResult } from 'antd/lib/table/interface'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import CategoryParamsFilter from './components/CategoryParamsFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, STRINGS, DEFAULT_LANGUAGE, FORM } from '../../utils/enums'
import { history } from '../../utils/history'
import { withPermissions } from '../../utils/Permissions'
import { setOrder, transformToLowerCaseWithoutAccent, formatDateByLocale, normalizeDirectionKeys, sortTableData, getLinkWithEncodedBackUrl } from '../../utils/helper'

// reducers
import { getCategoryParameters } from '../../reducers/categoryParams/categoryParamsActions'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

const CategoryParamsPage = () => {
	const { t, i18n } = useTranslation()
	const dispatch = useDispatch()

	const parameters = useSelector((state: RootState) => state.categoryParams.parameters)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		order: withDefault(StringParam, 'name:ASC')
	})

	useEffect(() => {
		dispatch(getCategoryParameters())
	}, [dispatch])

	useEffect(() => {
		dispatch(
			initialize(FORM.COSMETICS_FILTER, {
				search: query.search
			})
		)
	}, [dispatch, query.search])

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

	const tableData = useMemo(() => {
		if (!parameters || !parameters.data) {
			return []
		}

		const source = query.search
			? parameters.data.filter((parameter) => {
					const name = transformToLowerCaseWithoutAccent(parameter.name)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return name.includes(searchedValue)
			  })
			: parameters.data

		// transform to table data
		return source.map((parameter) => {
			const values =
				parameter.values?.map((value) => {
					// value doesn't require translations
					if (value.value) return value.value
					// value in current language
					const translatedValue = (find(value.valueLocalizations, { language: i18n.language }) as any).value

					if (translatedValue) return translatedValue
					// fallback - DEFAULT_LANGUAGE
					return (find(value.valueLocalizations, { language: DEFAULT_LANGUAGE }) as any).value
				}) || []

			return {
				...parameter,
				key: parameter.id,
				values: join(values, ', ')
			}
		})
	}, [query.search, parameters, i18n])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam parametrov kategórií')
			}
		]
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			ellipsis: true,
			sortOrder: setOrder(query.order, 'name'),
			sorter: {
				compare: (a, b) => sortTableData(a.name?.toUpperCase(), b.name?.toUpperCase())
			},
			render: (value) => <span className='base-regular'>{value}</span>
		},
		{
			title: t('loc:Hodnoty'),
			dataIndex: 'values',
			key: 'values',
			ellipsis: true,
			render: (value) => <span className='base-regular'>{value}</span>
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sortOrder: setOrder(query.order, 'createdAt'),
			sorter: {
				compare: (a, b) => sortTableData(new Date(a.createdAt), new Date(b.createdAt))
			},
			render: (value) => formatDateByLocale(value)
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<CategoryParamsFilter
							total={parameters?.data?.length}
							onSubmit={(values: any) => setQuery({ ...query, search: values.search })}
							addButton={
								<Button
									onClick={() => {
										history.push(getLinkWithEncodedBackUrl(t('paths:category-parameters/create')))
									}}
									type='primary'
									htmlType='button'
									className={'noti-btn'}
									icon={<PlusIcon />}
								>
									{STRINGS(t).addRecord(t('loc:parameter'))}
								</Button>
							}
						/>
						<div className={'w-full flex'}>
							<CustomTable
								className='table-fixed'
								columns={columns}
								dataSource={tableData}
								rowClassName={'clickable-row'}
								onChange={onChangeTable}
								twoToneRows
								pagination={false}
								onRow={(record) => ({
									onClick: () => history.push(getLinkWithEncodedBackUrl(t('paths:category-parameters/{{parameterID}}', { parameterID: record.id })))
								})}
								loading={parameters.isLoading}
							/>
						</div>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CategoryParamsPage)
