import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StringParam, useQueryParams } from 'use-query-params'
import { Col, Modal, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize, reset } from 'redux-form'
import { compose } from 'redux'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ServicesFilter from './components/ServicesFilter'
import { AvatarGroup } from '../../components/AvatarComponents'
import RequestNewServiceForm, { IRequestNewServiceForm } from './components/RequestNewServiceForm'

// utils
import { FORM, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT, NOTIFICATION_TYPE } from '../../utils/enums'
import { formatDateByLocale, getLinkWithEncodedBackUrl, normalizeDirectionKeys, normalizeQueryParams } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { postReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs, IUserAvatar, SalonSubPageProps, Columns } from '../../types/interfaces'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as CircleCheckIcon } from '../../assets/icons/check-circle-icon.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

interface IAdminUsersFilter {
	search: string
}

type ServiceCategorySuggestPost = Paths.PostApiB2BAdminServicesCategoryServiceSuggest.RequestBody

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const { salonID, parentPath } = props

	const [isVisible, setIsVisible] = useState<boolean>(false)

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

	const handleSubmitRequestNewService = async (data: IRequestNewServiceForm) => {
		try {
			const reqData: ServiceCategorySuggestPost = {
				salonID,
				rootCategoryID: data.rootCategoryID,
				description: data.description
			}
			await postReq('/api/b2b/admin/services/category-service-suggest', {}, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.REQUEST_NEW_SERVICE_FORM))
			setIsVisible(false)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
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
												setIsVisible(true)
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
										history.push(getLinkWithEncodedBackUrl(parentPath + t('paths:services/{{serviceID}}', { serviceID: record.serviceID })))
									}
								})}
								pagination={false}
							/>
							<Modal
								key={'requestNewServiceModal'}
								title={t('loc:Žiadosť o novú službu')}
								visible={isVisible}
								onCancel={() => {
									dispatch(reset(FORM.REQUEST_NEW_SERVICE_FORM))
									setIsVisible(false)
								}}
								footer={null}
								closeIcon={<CloseIcon />}
							>
								<RequestNewServiceForm onSubmit={handleSubmitRequestNewService} />
							</Modal>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(ServicesPage)
