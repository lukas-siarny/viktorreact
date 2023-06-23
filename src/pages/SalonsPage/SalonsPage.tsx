import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Col, Image, Row, Spin, TabsProps, Tooltip } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, isPristine } from 'redux-form'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import TabsComponent from '../../components/TabsComponent'
import SalonsFilterActive, { ISalonsFilterActive } from './components/filters/SalonsFilterActive'
import SalonsFilterDeleted, { ISalonsFilterDeleted } from './components/filters/SalonsFilterDeleted'
import RejectedSalonSuggestions from './components/RejectedSalonSuggestions'
import SalonsReportModal, { ALL_COUNTRIES_OPTION } from './components/modals/SalonsReportModal'
import ImportForm from '../../components/ImportForm'

// utils
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, REQUEST_STATUS, SALON_STATES, SALONS_TAB_KEYS } from '../../utils/enums'
import { formatDateByLocale, getAssignedUserLabel, getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { getReq, postReq } from '../../utils/request'
import { getCheckerIcon, getSalonTagChanges, getSalonTagCreateType, getSalonTagSourceType } from './components/salonUtils'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'

// types
import { Columns, IBreadcrumbs, IDataUploadForm, ISalonsReportForm } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { salonsPageURLQueryParamsSchema } from '../../schemas/queryParams'

type Props = {
	tabKey: SALONS_TAB_KEYS
}
const permissions: PERMISSION[] = [PERMISSION.NOTINO]

const SalonsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const salons = useSelector((state: RootState) => state.salons.salons)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)
	const [requestStatusImport, setRequestStatusImport] = useState<REQUEST_STATUS | undefined>(undefined)
	const [requestStatusReport, setRequestStatusReport] = useState<REQUEST_STATUS | undefined>(undefined)
	const [salonsReportModalVisible, setSalonsReportModalVisible] = useState(false)

	const tabKey = props.tabKey || SALONS_TAB_KEYS.ACTIVE
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const { data } = useSelector((state: RootState) => state.categories.categories)
	const isFormPristine = useSelector((state: RootState) => isPristine(FORM.SALONS_FILTER_ACITVE)(state))
	// transform root categories (industries) into object, where ID is key of record, and content is { image, name }
	const industries: { [key: string]: any } = useMemo(
		() => data?.reduce((result, industry) => ({ ...result, [industry.id]: { image: industry.image?.resizedImages?.thumbnail, name: industry.name } }), {}) || {},
		[data]
	)

	const isNotinoUser = useMemo(() => checkPermissions(authUserPermissions, [PERMISSION.NOTINO]), [authUserPermissions])

	useEffect(() => {
		dispatch(getCategories())
		dispatch(selectSalon())
	}, [dispatch])

	const [query, setQuery] = useQueryParams(salonsPageURLQueryParamsSchema, {
		salonState: SALONS_TAB_KEYS.ACTIVE,
		page: 1,
		order: 'createdAt:DESC'
	})

	useEffect(() => {
		let salonsQueries = {
			...query
		}

		// on init SalonFilterActive data get selected country from redux store
		if (isFormPristine) {
			salonsQueries = {
				...salonsQueries,
				countryCode: selectedCountry
			}
		}

		switch (tabKey) {
			case SALONS_TAB_KEYS.DELETED:
				dispatch(
					initialize(FORM.SALONS_FILTER_DELETED, {
						search: query.search,
						categoryFirstLevelIDs: query.categoryFirstLevelIDs,
						countryCode: salonsQueries.countryCode,
						enabledReservationsSetting: query.enabledReservationsSetting,
						hasAvailableReservationSystem: query.hasAvailableReservationSystem
					})
				)
				dispatch(getSalons({ ...salonsQueries, salonState: tabKey }))
				break

			case SALONS_TAB_KEYS.MISTAKES:
				dispatch(initialize(FORM.FILTER_REJECTED_SUGGESTIONS, { search: query.search }))
				break

			case SALONS_TAB_KEYS.ACTIVE:
			default:
				dispatch(
					initialize(FORM.SALONS_FILTER_ACITVE, {
						search: query.search,
						statuses_all: query.statuses_all,
						statuses_published: query.statuses_published,
						statuses_changes: query.statuses_changes,
						categoryFirstLevelIDs: query.categoryFirstLevelIDs,
						countryCode: salonsQueries.countryCode,
						createType: query.createType,
						dateFromTo: {
							dateFrom: query.lastUpdatedAtFrom,
							dateTo: query.lastUpdatedAtTo
						},
						hasSetOpeningHours: query.hasSetOpeningHours,
						sourceType: query.sourceType,
						premiumSourceUserType: query.premiumSourceUserType,
						assignedUserID: query.assignedUserID,
						enabledReservationsSetting: query.enabledReservationsSetting,
						hasAvailableReservationSystem: query.hasAvailableReservationSystem
					})
				)

				dispatch(initialize(FORM.SALONS_REPORT, { countryCode: salonsQueries.countryCode || ALL_COUNTRIES_OPTION }))
				dispatch(getSalons({ ...salonsQueries, salonState: tabKey }))
				break
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		tabKey,
		dispatch,
		query.page,
		query.limit,
		query.search,
		query.order,
		query.categoryFirstLevelIDs,
		query.statuses_all,
		query.statuses_published,
		query.statuses_changes,
		query.countryCode,
		query.createType,
		query.lastUpdatedAtFrom,
		query.lastUpdatedAtTo,
		query.hasSetOpeningHours,
		query.sourceType,
		query.premiumSourceUserType,
		query.assignedUserID,
		query.hasAvailableReservationSystem,
		query.enabledReservationsSetting,
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
			page: limit === salons?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	const handleSubmitActive = (values: ISalonsFilterActive) => {
		const { dateFromTo, ...restValues } = values

		// update selected country globally based on filter
		dispatch(setSelectedCountry(restValues?.countryCode || undefined))

		const newQuery = {
			...query,
			...restValues,
			lastUpdatedAtFrom: dateFromTo?.dateFrom,
			lastUpdatedAtTo: dateFromTo?.dateTo,
			page: 1
		}

		setQuery(newQuery)
	}

	const handleSubmitDeleted = (values: ISalonsFilterDeleted) => {
		// update selected country globally based on filter
		dispatch(setSelectedCountry(values?.countryCode || undefined))

		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	const salonImportsSubmit = async (values: IDataUploadForm) => {
		setRequestStatusImport(REQUEST_STATUS.SUBMITTING)

		const formData = new FormData()
		formData.append('file', values?.file[0])

		try {
			await postReq('/api/b2b/admin/imports/salons', undefined, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			setRequestStatusImport(REQUEST_STATUS.SUCCESS)
		} catch {
			setRequestStatusImport(REQUEST_STATUS.ERROR)
		}
	}

	const salonsReportSubmit = async (values: ISalonsReportForm) => {
		setRequestStatusReport(REQUEST_STATUS.SUBMITTING)
		try {
			await getReq('/api/b2b/admin/reports/salons', values.countryCode === ALL_COUNTRIES_OPTION ? undefined : { countryCode: values.countryCode })
			setRequestStatusReport(REQUEST_STATUS.SUCCESS)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
			setRequestStatusReport(REQUEST_STATUS.ERROR)
		}
	}

	// View
	const breadcrumbs: IBreadcrumbs | undefined = isNotinoUser
		? {
				items: [
					{
						name: t('loc:Zoznam salónov')
					}
				]
		  }
		: undefined

	const onTabChange = (newTabKey: string) => {
		if (newTabKey === SALONS_TAB_KEYS.ACTIVE) {
			navigate(t('paths:salons'))
		}
		if (newTabKey === SALONS_TAB_KEYS.DELETED) {
			navigate(t('paths:salons/deleted'))
		}
		if (newTabKey === SALONS_TAB_KEYS.MISTAKES) {
			navigate(t('paths:salons/rejected'))
		}
	}

	// define columns for both tables - active and deleted
	const tableColumns: { [key: string]: (props?: Columns[0]) => Columns[0] } = useMemo(
		() => ({
			id: (columnProps) => ({
				title: t('loc:ID'),
				dataIndex: 'id',
				key: 'id',
				ellipsis: false,
				sorter: false,
				render: (value) => {
					const firstThree = value.substring(0, 3)
					const lastThree = value.substring(value.length - 3)

					return <Tooltip title={value}>{`${firstThree}...${lastThree}`}</Tooltip>
				},
				...columnProps
			}),
			name: (columnProps) => ({
				title: <span id={'sortby-title'}>{t('loc:Názov')}</span>,
				dataIndex: 'name',
				key: 'name',
				ellipsis: true,
				sorter: true,
				sortOrder: setOrder(query.order, 'name'),
				render: (value) => value || '-',
				...columnProps
			}),
			address: (columnProps) => ({
				title: t('loc:Adresa'),
				dataIndex: 'address',
				key: 'address',
				ellipsis: true,
				sorter: false,
				render: (value) => (!isEmpty(value) ? <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</> : '-'),
				...columnProps
			}),
			categories: (columnProps) => ({
				title: t('loc:Odvetvia'),
				dataIndex: 'categories',
				key: 'categories',
				sorter: false,
				render: (value: any[]) => {
					const fallback = '-'

					if (value?.length > 0) {
						const industriesContent: any[] = value.map((category: any) => {
							const industry = industries[category.id]
							if (!industry) {
								// eslint-disable-next-line no-console
								console.error('Missingy industry with ID: ', category.id)
								return fallback
							}

							return (
								<Tooltip key={category.id} title={industry.name}>
									<Image src={industry.image} loading='lazy' width={32} height={32} className='pr-0-5 pb-0-5 rounded' alt={industry.name} preview={false} />
								</Tooltip>
							)
						})

						return <div className='flex flex-wrap'>{industriesContent}</div>
					}

					return '-'
				},
				...columnProps
			}),
			createType: (columnProps) => ({
				title: t('loc:Typ salónu'),
				dataIndex: 'createType',
				key: 'createType',
				sorter: false,
				render: (_value, record) => getSalonTagCreateType(record.state, record.createType),
				...columnProps
			}),
			createdAt: (columnProps) => ({
				title: t('loc:Vytvorený'),
				dataIndex: 'createdAt',
				key: 'createdAt',
				ellipsis: true,
				sorter: true,
				sortOrder: setOrder(query.order, 'createdAt'),
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...columnProps
			}),
			lastUpdatedAt: (columnProps) => ({
				title: t('loc:Upravený'),
				dataIndex: 'lastUpdatedAt',
				key: 'lastUpdatedAt',
				ellipsis: true,
				sorter: false,
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...columnProps
			}),
			deletedAt: (columnProps) => ({
				title: t('loc:Vymazaný'),
				dataIndex: 'deletedAt',
				key: 'deletedAt',
				ellipsis: true,
				sorter: false,
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...columnProps
			}),
			isPublished: (columnProps) => ({
				title: t('loc:Publikovaný'),
				key: 'isPublished',
				ellipsis: true,
				sorter: false,
				render: (_value, record: any) => {
					let checked = false
					switch (record.state) {
						case SALON_STATES.PUBLISHED:
						case SALON_STATES.PUBLISHED_PENDING:
						case SALON_STATES.PUBLISHED_DECLINED:
							checked = true
							break
						default:
							break
					}
					return <div className={'flex items-center'}>{getCheckerIcon(checked)}</div>
				},
				...columnProps
			}),
			changes: (columnProps) => ({
				title: t('loc:Zmeny'),
				key: 'changes',
				ellipsis: true,
				sorter: false,
				render: (_value, record) => getSalonTagChanges(record.state),
				...columnProps
			}),
			fillingProgress: (columnProps) => ({
				title: t('loc:Vyplnenie profilu'),
				dataIndex: 'fillingProgressSalon',
				key: 'fillingProgress',
				sorter: true,
				sortOrder: setOrder(query.order, 'fillingProgress'),
				render: (value: number | undefined) => <span className={'w-9 flex-shrink-0'}>{value ? `${value}%` : ''}</span>,
				...columnProps
			}),
			assignedUser: (columnProps) => ({
				title: t('loc:Notino používateľ'),
				dataIndex: 'assignedUser',
				key: 'assignedUser',
				sorter: false,
				render: (value: any) => <span className={'inline-block truncate w-full'}>{getAssignedUserLabel(value)}</span>,
				...columnProps
			}),
			premiumSourceUserType: (columnProps) => ({
				title: t('loc:Zdroj PREMIUM'),
				dataIndex: 'premiumSourceUserType',
				key: 'premiumSourceUserType',
				sorter: false,
				render: (value: string) => getSalonTagSourceType(value),
				...columnProps
			}),
			enabledRS: (columnProps) => ({
				title: t('loc:Rezervačný systém'),
				dataIndex: 'settings',
				key: 'settings',
				sorter: false,
				render: (value: any) => getCheckerIcon(value?.enabledReservations),
				...columnProps
			}),
			availableReservationSystem: (columnProps) => ({
				title: t('loc:Dostupné pre online rezervácie'),
				dataIndex: 'availableReservationSystem',
				key: 'availableReservationSystem',
				sorter: false,
				render: (value: boolean) => getCheckerIcon(value),
				...columnProps
			})
		}),
		[query.order, t, industries]
	)

	const getTabContent = (selectedTabKey: SALONS_TAB_KEYS) => {
		let columns: Columns = []
		let filters: React.ReactNode = null

		switch (selectedTabKey) {
			case SALONS_TAB_KEYS.MISTAKES:
				return <RejectedSalonSuggestions />
			case SALONS_TAB_KEYS.DELETED:
				columns = [
					tableColumns.id({ width: '8%' }),
					tableColumns.name({ width: '20%' }),
					tableColumns.address({ width: '16%' }),
					tableColumns.categories({ width: '16%' }),
					tableColumns.deletedAt({ width: '16%' }),
					tableColumns.fillingProgress({ width: '16%' }),
					tableColumns.createdAt({ width: '20%' })
				]
				filters = <SalonsFilterDeleted onSubmit={handleSubmitDeleted} />
				break
			default:
				columns = [
					tableColumns.id({ width: '8%' }),
					tableColumns.name({ width: '15%' }),
					tableColumns.address({ width: '15%' }),
					tableColumns.categories({ width: '9%' }),
					tableColumns.isPublished({ width: '8%' }),
					tableColumns.changes({ width: '10%' }),
					tableColumns.createType({ width: '10%' }),
					tableColumns.enabledRS({ width: '8%' }),
					tableColumns.availableReservationSystem({ width: '8%' }),
					tableColumns.premiumSourceUserType({ width: '6%' }),
					tableColumns.assignedUser({ width: '10%' }),
					tableColumns.fillingProgress({ width: '8%' }),
					tableColumns.lastUpdatedAt({ width: '8%' }),
					tableColumns.createdAt({ width: '8%' })
				]
				filters = (
					<SalonsFilterActive
						onSubmit={handleSubmitActive}
						onImportSalons={() => setSalonImportsModalVisible(true)}
						onDownloadReport={() => setSalonsReportModalVisible(true)}
						query={query}
					/>
				)
		}
		return (
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<Spin spinning={salons?.isLoading}>
						<div className='content-body'>
							{filters}
							<CustomTable
								className='table-fixed'
								onChange={onChangeTable}
								columns={columns || []}
								dataSource={salons?.data?.salons}
								scroll={{ x: tabKey === SALONS_TAB_KEYS.ACTIVE ? 1200 : 1000 }}
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

	const tabContent: TabsProps['items'] = [
		{
			key: SALONS_TAB_KEYS.ACTIVE,
			label: <>{t('loc:Aktívne')}</>,
			children: getTabContent(SALONS_TAB_KEYS.ACTIVE)
		},
		{
			key: SALONS_TAB_KEYS.DELETED,
			label: <>{t('loc:Vymazané')}</>,
			children: getTabContent(SALONS_TAB_KEYS.DELETED)
		},
		{
			key: SALONS_TAB_KEYS.MISTAKES,
			label: <>{t('loc:Omylom navrhnuté na spárovanie')}</>,
			children: getTabContent(SALONS_TAB_KEYS.MISTAKES)
		}
	]
	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} items={tabContent} destroyInactiveTabPane />
			<ImportForm
				setRequestStatus={setRequestStatusImport}
				requestStatus={requestStatusImport}
				label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.xlsx' })}
				accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}
				title={t('loc:Importovať salóny')}
				visible={salonImportsModalVisible}
				setVisible={setSalonImportsModalVisible}
				onSubmit={salonImportsSubmit}
			/>
			<SalonsReportModal
				visible={salonsReportModalVisible}
				setVisible={setSalonsReportModalVisible}
				requestStatus={requestStatusReport}
				setRequestStatus={setRequestStatusReport}
				onSubmit={salonsReportSubmit}
			/>
		</>
	)
}

export default compose(withPermissions(permissions))(SalonsPage)
