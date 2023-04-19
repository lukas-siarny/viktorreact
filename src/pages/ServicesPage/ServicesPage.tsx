import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { useNavigate } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ServicesFilter from './components/ServicesFilter'
import { AvatarGroup } from '../../components/AvatarComponents'

// utils
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { Columns, IBreadcrumbs, IServicesFilter, IUserAvatar, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as CircleCheckIcon } from '../../assets/icons/check-circle-icon.svg'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { servicesPagePageURLQueryParams } from '../../schemas/queryParams'

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const { salonID, parentPath } = props

	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const [query, setQuery] = useQueryParams(servicesPagePageURLQueryParams)

	useEffect(() => {
		dispatch(initialize(FORM.SERVICES_FILTER, { rootCategoryID: query.rootCategoryID }))
		dispatch(
			getServices({
				salonID,
				rootCategoryID: query.rootCategoryID
			})
		)
	}, [dispatch, salonID, query.rootCategoryID])

	const handleSubmit = (values: IServicesFilter) => {
		const newQuery = {
			...query,
			rootCategoryID: values.rootCategoryID
		}
		setQuery(newQuery)
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
			title: t('loc:Trvanie služby'),
			dataIndex: 'duration',
			key: 'duration',
			ellipsis: true
		},
		{
			title: t('loc:Cena služby'),
			dataIndex: 'price',
			key: 'price',
			ellipsis: true
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			render: (value: string) => formatDateByLocale(value) ?? '-'
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
							<Permissions allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_CREATE]} render={() => <ServicesFilter onSubmit={handleSubmit} />} />
							<CustomTable
								className='table-fixed'
								columns={columns}
								dataSource={services?.tableData}
								rowClassName={'clickable-row'}
								scroll={{ x: 800 }}
								twoToneRows
								onRow={(record) => ({
									onClick: () => {
										navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID: record.serviceID })))
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

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServicesPage)
