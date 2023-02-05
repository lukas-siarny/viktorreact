import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Col, Row, TablePaginationConfig } from 'antd'
import { initialize } from 'redux-form'
import { SorterResult } from 'antd/lib/table/interface'
import { useNavigate, useSearchParams } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactsFilter, { ISupportContactsFilter } from './components/SupportContactsFilter'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, LANGUAGE, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import i18n from '../../utils/i18n'
import { getLinkWithEncodedBackUrl, getCountryNameFromNameLocalizations, normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'

// types
import { IBreadcrumbs, Columns } from '../../types/interfaces'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

const SupportContactsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const navigate = useNavigate()

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		order: 'country:ASC'
	})

	const searchParamsObj = Object.fromEntries(searchParams)

	useEffect(() => {
		dispatch(getSupportContacts())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.SUPPORT_CONTACTS_FILTER, { search: searchParams.get('search') }))
	}, [dispatch, searchParams])

	const handleSubmit = (values: ISupportContactsFilter) => {
		const newQuery = {
			...searchParamsObj,
			...values
		}
		setSearchParams(newQuery)
	}

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...searchParamsObj,
				order
			}
			setSearchParams(newQuery)
		}
	}

	const tableData = useMemo(() => {
		if (!supportContacts || !supportContacts.tableData) {
			return []
		}

		return searchParams.get('search')
			? supportContacts.tableData.filter((country) => {
					const countryName = transformToLowerCaseWithoutAccent(
						getCountryNameFromNameLocalizations(country.country?.nameLocalizations, i18n.language as LANGUAGE) || country.country?.code
					)
					const searchedValue = transformToLowerCaseWithoutAccent(searchParams.get('search') || undefined)
					return countryName.includes(searchedValue)
			  })
			: supportContacts.tableData
	}, [searchParams, supportContacts])

	const columns: Columns = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			width: '30%',
			sortOrder: setOrder(searchParams.get('order'), 'country'),
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
											navigate(getLinkWithEncodedBackUrl(t('paths:support-contacts/create')))
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
										navigate(getLinkWithEncodedBackUrl(t('paths:support-contacts/{{supportContactID}}', { supportContactID: record.supportContactID })))
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
