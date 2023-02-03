import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, TablePaginationConfig } from 'antd'
import { initialize } from 'redux-form'
import { SorterResult } from 'antd/lib/table/interface'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactsFilter, { ISupportContactsFilter } from './components/SupportContactsFilter'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, LANGUAGE, PERMISSION, ADMIN_PERMISSIONS, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { history } from '../../utils/history'
import i18n from '../../utils/i18n'
import { getLinkWithEncodedBackUrl, getCountryNameFromNameLocalizations, normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'

const permissions: PERMISSION[] = [...ADMIN_PERMISSIONS, PERMISSION.ENUM_EDIT]

const SupportContactsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		order: withDefault(StringParam, 'country:ASC')
	})

	useEffect(() => {
		dispatch(getSupportContacts())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.SUPPORT_CONTACTS_FILTER, { search: query.search }))
	}, [dispatch, query.search])

	const handleSubmit = (values: ISupportContactsFilter) => {
		const newQuery = {
			...query,
			...values
		}
		setQuery(newQuery)
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

	const tableData = useMemo(() => {
		if (!supportContacts || !supportContacts.tableData) {
			return []
		}

		return query.search
			? supportContacts.tableData.filter((country) => {
					const countryName = transformToLowerCaseWithoutAccent(
						getCountryNameFromNameLocalizations(country.country?.nameLocalizations, i18n.language as LANGUAGE) || country.country?.code
					)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return countryName.includes(searchedValue)
			  })
			: supportContacts.tableData
	}, [query.search, supportContacts])

	const columns: Columns = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			width: '30%',
			sortOrder: setOrder(query.order, 'country'),
			sorter: {
				compare: (a, b) => {
					const aValue = getCountryNameFromNameLocalizations(a?.country?.nameLocalizations, i18n.language as LANGUAGE) || a?.country?.code
					const bValue = getCountryNameFromNameLocalizations(b?.country?.nameLocalizations, i18n.language as LANGUAGE) || b?.country?.code
					return sortData(aValue, bValue)
				}
			},
			render: (value) => {
				const name = getCountryNameFromNameLocalizations(value.nameLocalizations, i18n.language as LANGUAGE) || value.code
				return (
					<div className={'flex items-center gap-2'}>
						{value.flag && <img src={value.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Mesto'),
			dataIndex: 'city',
			key: 'city',
			ellipsis: true,
			sorter: false,
			width: '30%'
		},
		{
			title: t('loc:Ulica'),
			dataIndex: 'street',
			key: 'street',
			ellipsis: true,
			sorter: false,
			width: '20%'
		},
		{
			title: t('loc:Číslo ulice'),
			dataIndex: 'streetNumber',
			key: 'streetNumber',
			ellipsis: true,
			sorter: false,
			width: '10%'
		},
		{
			title: t('loc:PSČ'),
			dataIndex: 'zipCode',
			key: 'zipCode',
			ellipsis: true,
			sorter: false,
			width: '10%'
		}
	]

	const breadcrumbs: IBreadcrumbs | undefined = {
		items: [
			{
				name: t('loc:Zoznam podporných centier')
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
					<div className='content-body'>
						<Permissions
							allowed={permissions}
							render={(hasPermission, { openForbiddenModal }) => (
								<SupportContactsFilter
									total={supportContacts.data?.supportContacts?.length || 0}
									createSupportContact={() => {
										if (hasPermission) {
											history.push(getLinkWithEncodedBackUrl(t('paths:support-contacts/create')))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
								/>
							)}
						/>
						<CustomTable
							className='table-fixed'
							columns={columns}
							dataSource={tableData}
							rowClassName={'clickable-row'}
							loading={supportContacts?.isLoading}
							onChange={onChangeTable}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => {
								return {
									onClick: () => {
										history.push(getLinkWithEncodedBackUrl(t('paths:support-contacts/{{supportContactID}}', { supportContactID: record.supportContactID })))
									}
								}
							}}
							pagination={false}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(SupportContactsPage)
