import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParams } from 'use-query-params'
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
import { FORM, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl, normalizeDirectionKeys, normalizeQueryParams } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs, IUserAvatar, SalonSubPageProps, Columns } from '../../types/interfaces'

// assets
import { ReactComponent as CircleCheckIcon } from '../../assets/icons/check-circle-icon.svg'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

interface IAdminUsersFilter {
	search: string
}

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const { salonID, parentPath } = props

	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)

	useEffect(() => {
		dispatch(getCategories())
		// test()
	}, [dispatch])

	const [query, setQuery] = useQueryParams({
		rootCategoryID: StringParam
	})

	useEffect(() => {
		dispatch(initialize(FORM.SERVICES_FILTER, { rootCategoryID: query.rootCategoryID }))
		dispatch(
			getServices({
				salonID,
				rootCategoryID: query.rootCategoryID || undefined
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
			title: t('loc:Zamestnanci'),
			dataIndex: 'employees',
			key: 'employees',
			render: (value: IUserAvatar[]) =>
				value ? (
					<div className={'w-full h-full flex items-center'}>
						<AvatarGroup maxCount={3} avatars={value} maxPopoverPlacement={'right'} size={'small'} />{' '}
					</div>
				) : null
		},
		{
			title: t('loc:Vyplnenie služby'),
			dataIndex: 'isComplete',
			key: 'isComplete',
			ellipsis: true,
			render: (value) =>
				value && (
					<div className={'flex justify-start'}>
						<CircleCheckIcon width={20} height={20} />
					</div>
				)
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
				name: t('loc:Nastavenie služieb')
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
							<Permissions allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_CREATE]} render={() => <ServicesFilter onSubmit={handleSubmit} />} />
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
										history.push(getLinkWithEncodedBackUrl(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID: record.serviceID })))
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
