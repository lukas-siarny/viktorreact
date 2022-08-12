import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams } from 'use-query-params'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ServicesFilter from './components/ServicesFilter'
import { AvatarGroup } from '../../components/AvatarComponents'

// utils
import { FORM, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT, NOTIFICATION_TYPE } from '../../utils/enums'
import { encodePrice, formatDateByLocale, getEncodedBackUrl, normalizeDirectionKeys, normalizeQueryParams } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getService, getServices } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs, IUserAvatar, SalonSubPageProps, Columns } from '../../types/interfaces'
import { patchReq } from '../../utils/request'
import { parseEmployeeCreateAndUpdate, parseParameterValuesCreateAndUpdate } from './ServiceEditPage'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

interface IAdminUsersFilter {
	search: string
}

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)
	const { salonID, parentPath } = props

	const backUrl = getEncodedBackUrl()

	/* const test = async () => {
		// /api/b2b/admin/salons/{salonID}/services
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/services', { salonID: 1 }, { rootCategoryID: 1, categoryIDs: [68, 69, 81, 79] })
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	} */

	useEffect(() => {
		dispatch(getCategories(false))
		// test()
	}, [dispatch])

	const [query, setQuery] = useQueryParams({
		rootCategoryID: StringParam
	})

	useEffect(() => {
		dispatch(initialize(FORM.SERVICES_FILTER, { rootCategoryID: query.rootCategoryID }))
		dispatch(
			getServices({
				salonID
			})
		)
	}, [dispatch, salonID, query.rootCategoryID])

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

	const handleSubmit = (values: IAdminUsersFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(normalizeQueryParams(newQuery))
	}

	const columns: Columns = [
		{
			title: t('loc:Odvetvie'),
			dataIndex: 'categoryFirst',
			key: 'categoryFirst',
			ellipsis: true
		},
		{
			title: t('loc:Kategória'),
			dataIndex: 'categorySecond',
			key: 'categorySecond',
			ellipsis: true
		},
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: 'employees',
			key: 'employees',
			render: (value: IUserAvatar[]) => (value ? <AvatarGroup maxCount={3} avatars={value} maxPopoverPlacement={'right'} size={'small'} /> : null)
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			render: (value: string) => formatDateByLocale(value)
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb')
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
						<Spin spinning={services?.isLoading}>
							<Permissions
								allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_CREATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<ServicesFilter
										createService={() => {
											if (hasPermission) {
												history.push(`${parentPath + t('paths:services/create')}?backUrl=${backUrl}`)
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
								onChange={onChangeTable}
								columns={columns}
								dataSource={services?.tableData}
								rowClassName={'clickable-row'}
								scroll={{ x: 800 }}
								twoToneRows
								onRow={(record) => ({
									onClick: () => {
										history.push(`${parentPath + t('paths:services/{{serviceID}}', { serviceID: record.serviceID })}?backUrl=${backUrl}`)
									}
								})}
								pagination={false}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(ServicesPage)
