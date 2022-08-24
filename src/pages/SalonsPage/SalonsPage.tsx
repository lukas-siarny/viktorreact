import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Modal, Progress, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, reset } from 'redux-form'

// components
import { isEmpty } from 'lodash'
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonsFilter, { ISalonsFilter } from './components/SalonsFilter'
import SalonsImportForm from './components/SalonsImportForm'
import UploadSuccess from './components/UploadSuccess'
import TabsComponent from '../../components/TabsComponent'

// utils
import { withPermissions, checkPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import {
	formatDateByLocale,
	getLinkWithEncodedBackUrl,
	getSalonTagChanges,
	getSalonTagCreateType,
	getSalonTagPublished,
	normalizeDirectionKeys,
	setOrder
} from '../../utils/helper'
import { history } from '../../utils/history'
import { postReq } from '../../utils/request'

// reducers
import { emptySalons, getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, IDataUploadForm, Columns } from '../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

type TabKeys = 'active' | 'deleted'

const SalonsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salons = useSelector((state: RootState) => state.salons.salons)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)
	const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error' | undefined>(undefined)
	const [tabKey, setTabKey] = useState<TabKeys | undefined>()

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON_IMPORTS_FORM]?.values)

	useEffect(() => {
		dispatch(getCategories())
		dispatch(selectSalon())
	}, [dispatch])

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		categoryFirstLevelIDs: ArrayParam,
		statuses_all: withDefault(BooleanParam, false),
		statuses_published: ArrayParam,
		salonState: withDefault(StringParam, 'active'),
		statuses_changes: ArrayParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'createdAt:DESC'),
		countryCode: StringParam,
		createType: StringParam,
		lastUpdatedAtFrom: StringParam,
		lastUpdatedAtTo: StringParam
	})

	const isAdmin = useMemo(() => checkPermissions(authUserPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUserPermissions])

	useEffect(() => {
		dispatch(
			initialize(FORM.SALONS_FILTER, {
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				countryCode: query.countryCode,
				createType: query.createType,
				dateFromTo: {
					dateFrom: query.lastUpdatedAtFrom,
					dateTo: query.lastUpdatedAtTo
				}
			})
		)

		if (query.salonState === 'active') {
			setTabKey('active')
		} else if (query.salonState === 'deleted') {
			setTabKey('deleted')
		}

		dispatch(
			getSalons({
				page: query.page,
				limit: query.limit,
				order: query.order,
				search: query.search,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				salonState: query.salonState,
				countryCode: query.countryCode,
				createType: query.createType,
				lastUpdatedAtFrom: query.lastUpdatedAtFrom,
				lastUpdatedAtTo: query.lastUpdatedAtTo
			})
		)
	}, [
		dispatch,
		query.page,
		query.limit,
		query.search,
		query.order,
		query.categoryFirstLevelIDs,
		query.statuses_all,
		query.statuses_published,
		query.salonState,
		query.statuses_changes,
		query.countryCode,
		query.createType,
		query.lastUpdatedAtFrom,
		query.lastUpdatedAtTo
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

	const handleSubmit = (values: ISalonsFilter) => {
		const { dateFromTo, ...restValues } = values
		const newQuery = {
			...query,
			...restValues,
			lastUpdatedAtFrom: dateFromTo?.dateFrom,
			lastUpdatedAtTo: dateFromTo?.dateTo,
			page: 1
		}
		setQuery(newQuery)
	}

	const salonImportsSubmit = async (values: IDataUploadForm) => {
		setUploadStatus('uploading')

		const formData = new FormData()
		formData.append('file', values?.file)

		try {
			await postReq('/api/b2b/admin/imports/salons' as any, undefined, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			setUploadStatus('success')
		} catch {
			setUploadStatus('error')
		}
	}

	const resetUploadForm = () => {
		setUploadStatus(undefined)
		reset(FORM.SALON_IMPORTS_FORM)
	}

	// View
	const breadcrumbs: IBreadcrumbs | undefined = isAdmin
		? {
				items: [
					{
						name: t('loc:Zoznam salónov')
					}
				]
		  }
		: undefined

	const onTabChange = (selectedTabKey: string) => {
		dispatch(emptySalons())
		setTabKey(selectedTabKey as TabKeys)
		setQuery({ ...query, salonState: selectedTabKey })
	}

	// define columns for both tables - active and deleted
	const tableColumns: { [key: string]: (props?: Columns[0]) => Columns[0] } = useMemo(
		() => ({
			name: (props) => ({
				title: t('loc:Názov'),
				dataIndex: 'name',
				key: 'name',
				ellipsis: true,
				sorter: true,
				width: '15%',
				sortOrder: setOrder(query.order, 'name'),
				render: (value) => value || '-',
				...props
			}),
			address: (props) => ({
				title: t('loc:Adresa'),
				dataIndex: 'address',
				key: 'address',
				ellipsis: true,
				sorter: false,
				width: '20%',
				render: (value) => (!isEmpty(value) ? <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</> : '-'),
				...props
			}),
			categories: (props) => ({
				title: t('loc:Odvetvie'),
				dataIndex: 'categories',
				key: 'categories',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (value) => (value?.length > 0 ? value[0].name : '-'),
				...props
			}),
			createType: (props) => ({
				title: t('loc:Úroveň salónu'),
				dataIndex: 'createType',
				key: 'createType',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (_value, record) => getSalonTagCreateType(record.state, record.createType),
				...props
			}),
			createdAt: (props) => ({
				title: t('loc:Vytvorený'),
				dataIndex: 'createdAt',
				key: 'createdAt',
				ellipsis: true,
				sorter: true,
				sortOrder: setOrder(query.order, 'createdAt'),
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...props
			}),
			lastUpdatedAt: (props) => ({
				title: t('loc:Upravený'),
				dataIndex: 'lastUpdatedAt',
				key: 'lastUpdatedAt',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...props
			}),
			deletedAt: (props) => ({
				title: t('loc:Vymazaný'),
				dataIndex: 'deletedAt',
				key: 'deletedAt',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...props
			}),
			isPublished: (props) => ({
				title: t('loc:Publikovaný'),
				key: 'isPublished',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (_value, record) => getSalonTagPublished(record.state),
				...props
			}),
			changes: (props) => ({
				title: t('loc:Zmeny'),
				key: 'changes',
				ellipsis: true,
				sorter: false,
				width: '10%',
				render: (_value, record) => getSalonTagChanges(record.state),
				...props
			}),
			fillingProgress: (props) => ({
				title: t('loc:Vyplnenie profilu'),
				dataIndex: 'fillingProgressSalon',
				key: 'fillingProgress',
				ellipsis: true,
				sorter: true,
				sortOrder: setOrder(query.order, 'fillingProgress'),
				render: (value) => (
					<Row className={'gap-2'} wrap={false}>
						<span className={'w-9 flex-shrink-0'}>{value ? `${value}%` : ''}</span>
						<Progress className='w-4/5' percent={value} showInfo={false} strokeColor={'#000'} />
					</Row>
				),
				...props
			})
		}),
		[query.order, t]
	)

	const getTabContent = (selectedTabKey: 'active' | 'deleted') => {
		let columns: Columns = []

		if (selectedTabKey === 'active') {
			columns = [
				tableColumns.name(),
				tableColumns.address(),
				tableColumns.categories(),
				tableColumns.isPublished(),
				tableColumns.changes(),
				tableColumns.createType(),
				tableColumns.fillingProgress(),
				tableColumns.lastUpdatedAt(),
				tableColumns.createdAt()
			]
		} else if (selectedTabKey === 'deleted') {
			columns = [
				tableColumns.name({ width: '20%' }),
				tableColumns.address({ width: '16%' }),
				tableColumns.categories({ width: '16%' }),
				tableColumns.deletedAt({ width: '16%' }),
				tableColumns.createType({ width: '16%' }),
				tableColumns.createdAt({ width: '16%' })
			]
		}

		return (
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<Spin spinning={salons?.isLoading}>
						<div className='content-body'>
							<SalonsFilter onSubmit={handleSubmit} openSalonImportsModal={() => setSalonImportsModalVisible(true)} />
							<CustomTable
								className='table-fixed'
								onChange={onChangeTable}
								columns={columns || []}
								dataSource={salons?.data?.salons}
								scroll={{ x: 1000 }}
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
										history.push(getLinkWithEncodedBackUrl(t('paths:salons/{{salonID}}', { salonID: record.id })))
									}
								})}
							/>
						</div>
					</Spin>
				</Col>
			</Row>
		)
	}

	const tabContent = [
		{
			tabKey: 'active',
			tab: <>{t('loc:Aktívne salóny')}</>,
			tabPaneContent: getTabContent('active')
		},
		{
			tabKey: 'deleted',
			tab: <>{t('loc:Vymazané salóny')}</>,
			tabPaneContent: getTabContent('deleted')
		}
	]
	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} tabsContent={tabContent} />
			<Modal
				className='rounded-fields'
				title={t('loc:Importovať salóny')}
				centered
				visible={salonImportsModalVisible}
				footer={null}
				onCancel={() => {
					resetUploadForm()
					setSalonImportsModalVisible(false)
				}}
				closeIcon={<CloseIcon />}
				width={394}
				maskClosable={false}
				keyboard={false}
			>
				<Spin spinning={uploadStatus === 'uploading'}>
					{uploadStatus === 'success' ? (
						<UploadSuccess onUploadAgain={resetUploadForm} />
					) : (
						<SalonsImportForm onSubmit={salonImportsSubmit} disabledForm={!formValues?.file} />
					)}
				</Spin>
			</Modal>
		</>
	)
}

export default compose(withPermissions(permissions))(SalonsPage)
