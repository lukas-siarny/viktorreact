import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Col, Image, Progress, Row, Spin, TabsProps, Tooltip } from 'antd'
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

// utils
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, UPLOAD_STATUS } from '../../utils/enums'
import { formatDateByLocale, getAssignedUserLabel, getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { getSalonTagChanges, getSalonTagCreateType, getSalonTagPublished, getSalonTagSourceType } from './components/salonUtils'

// reducers
import { emptySalons, getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { Columns, IBreadcrumbs, IDataUploadForm } from '../../types/interfaces'

// assets
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'

// hooks
import useQueryParams, { ArrayParam, BooleanParam, NumberParam, StringParam } from '../../hooks/useQueryParams'
import ImportForm from '../../components/ImportForm'

const permissions: PERMISSION[] = [PERMISSION.NOTINO]

enum TAB_KEYS {
	ACTIVE = 'active',
	DELETED = 'deleted',
	MISTAKES = 'mistakes'
}

const SalonsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const salons = useSelector((state: RootState) => state.salons.salons)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)
	const [uploadStatus, setUploadStatus] = useState<UPLOAD_STATUS | undefined>(undefined)
	const [tabKey, setTabKey] = useState<TAB_KEYS | undefined>()

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

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		categoryFirstLevelIDs: ArrayParam(),
		statuses_all: BooleanParam(false),
		statuses_published: StringParam(),
		salonState: StringParam(TAB_KEYS.ACTIVE),
		statuses_changes: StringParam(),
		limit: NumberParam(),
		page: NumberParam(1),
		order: StringParam('createdAt:DESC'),
		countryCode: StringParam(),
		createType: StringParam(),
		lastUpdatedAtFrom: StringParam(),
		lastUpdatedAtTo: StringParam(),
		hasSetOpeningHours: StringParam(),
		sourceType: StringParam(),
		assignedUserID: StringParam(),
		premiumSourceUserType: StringParam()
	})

	const resetQuery = (selectedTabKey: string) => {
		// reset query when switching between tabs
		setQuery({
			search: undefined,
			categoryFirstLevelIDs: undefined,
			statuses_all: undefined,
			statuses_published: undefined,
			statuses_changes: undefined,
			limit: undefined,
			page: 1,
			order: 'createdAt:DESC',
			// get default selected country form redux store
			countryCode: selectedCountry,
			createType: undefined,
			lastUpdatedAtFrom: undefined,
			lastUpdatedAtTo: undefined,
			salonState: selectedTabKey,
			hasSetOpeningHours: undefined,
			sourceType: undefined,
			premiumSourceUserType: undefined,
			assignedUserID: undefined
		})
	}

	useEffect(() => {
		let salonsQueries = {
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
			lastUpdatedAtTo: query.lastUpdatedAtTo,
			hasSetOpeningHours: query.hasSetOpeningHours,
			sourceType: query.sourceType,
			premiumSourceUserType: query.premiumSourceUserType,
			assignedUserID: query.assignedUserID
		}

		// on init SalonFilterActive data get selected country from redux store
		if (isFormPristine) {
			salonsQueries = {
				...salonsQueries,
				countryCode: selectedCountry as any
			}
		}

		switch (query.salonState) {
			case TAB_KEYS.DELETED:
				setTabKey(TAB_KEYS.DELETED)
				dispatch(
					initialize(FORM.SALONS_FILTER_DELETED, {
						search: query.search,
						categoryFirstLevelIDs: query.categoryFirstLevelIDs,
						countryCode: salonsQueries.countryCode
					})
				)
				dispatch(getSalons(salonsQueries))
				break

			case TAB_KEYS.MISTAKES:
				setTabKey(TAB_KEYS.MISTAKES)
				dispatch(initialize(FORM.FILTER_REJECTED_SUGGESTIONS, { search: query.search }))
				break

			case TAB_KEYS.ACTIVE:
			default:
				setTabKey(TAB_KEYS.ACTIVE)
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
						assignedUserID: query.assignedUserID
					})
				)
				dispatch(getSalons(salonsQueries))
				break
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		query.lastUpdatedAtTo,
		query.hasSetOpeningHours,
		query.sourceType,
		query.premiumSourceUserType,
		query.assignedUserID,
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
			page
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
		setUploadStatus(UPLOAD_STATUS.UPLOADING)

		const formData = new FormData()
		formData.append('file', values?.file)

		try {
			await postReq('/api/b2b/admin/imports/salons' as any, undefined, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			setUploadStatus(UPLOAD_STATUS.SUCCESS)
		} catch {
			setUploadStatus(UPLOAD_STATUS.ERROR)
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

	const onTabChange = (selectedTabKey: string) => {
		dispatch(emptySalons())
		setTabKey(selectedTabKey as TAB_KEYS)
		resetQuery(selectedTabKey)
	}

	// define columns for both tables - active and deleted
	const tableColumns: { [key: string]: (props?: Columns[0]) => Columns[0] } = useMemo(
		() => ({
			id: (props) => ({
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
				...props
			}),
			name: (props) => ({
				title: t('loc:Názov'),
				dataIndex: 'name',
				key: 'name',
				ellipsis: true,
				sorter: true,
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
				render: (value) => (!isEmpty(value) ? <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</> : '-'),
				...props
			}),
			categories: (props) => ({
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
				...props
			}),
			createType: (props) => ({
				title: t('loc:Typ salónu'),
				dataIndex: 'createType',
				key: 'createType',
				ellipsis: true,
				sorter: false,
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
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...props
			}),
			deletedAt: (props) => ({
				title: t('loc:Vymazaný'),
				dataIndex: 'deletedAt',
				key: 'deletedAt',
				ellipsis: true,
				sorter: false,
				render: (value) => (value ? formatDateByLocale(value) : '-'),
				...props
			}),
			isPublished: (props) => ({
				title: t('loc:Publikovaný'),
				key: 'isPublished',
				ellipsis: true,
				sorter: false,
				render: (_value, record) => getSalonTagPublished(record.state),
				...props
			}),
			changes: (props) => ({
				title: t('loc:Zmeny'),
				key: 'changes',
				ellipsis: true,
				sorter: false,
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
				render: (value: number | undefined) => (
					<Row className={'gap-2'} wrap={false}>
						<span className={'w-9 flex-shrink-0'}>{value ? `${value}%` : ''}</span>
						<Progress className='w-4/5' percent={value} showInfo={false} strokeColor={'#000'} />
					</Row>
				),
				...props
			}),
			assignedUser: (props) => ({
				title: t('loc:Notino používateľ'),
				dataIndex: 'assignedUser',
				key: 'assignedUser',
				ellipsis: true,
				sorter: false,
				render: (value: any) => getAssignedUserLabel(value),
				...props
			}),
			premiumSourceUserType: (props) => ({
				title: t('loc:Zdroj PREMIUM'),
				dataIndex: 'premiumSourceUserType',
				key: 'premiumSourceUserType',
				sorter: false,
				ellipsis: true,
				render: (value: string) => getSalonTagSourceType(value),
				...props
			})
		}),
		[query.order, t, industries]
	)

	const getTabContent = (selectedTabKey: TAB_KEYS) => {
		let columns: Columns = []
		let filters: React.ReactNode = null

		switch (selectedTabKey) {
			case TAB_KEYS.MISTAKES:
				return <RejectedSalonSuggestions />
			case TAB_KEYS.DELETED:
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
					tableColumns.changes({ width: '8%' }),
					tableColumns.createType({ width: '6%' }),
					tableColumns.premiumSourceUserType({ width: '6%' }),
					tableColumns.assignedUser({ width: '10%' }),
					tableColumns.fillingProgress({ width: '16%' }),
					tableColumns.lastUpdatedAt({ width: '8%' }),
					tableColumns.createdAt({ width: '8%' })
				]
				filters = <SalonsFilterActive onSubmit={handleSubmitActive} openSalonImportsModal={() => setSalonImportsModalVisible(true)} />
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
								scroll={{ x: query.salonState === TAB_KEYS.ACTIVE ? 1200 : 1000 }}
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
			key: TAB_KEYS.ACTIVE,
			label: <>{t('loc:Aktívne')}</>,
			children: getTabContent(TAB_KEYS.ACTIVE)
		},
		{
			key: TAB_KEYS.DELETED,
			label: <>{t('loc:Vymazané')}</>,
			children: getTabContent(TAB_KEYS.DELETED)
		},
		{
			key: TAB_KEYS.MISTAKES,
			label: <>{t('loc:Omylom navrhnuté na spárovanie')}</>,
			children: getTabContent(TAB_KEYS.MISTAKES)
		}
	]
	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} items={tabContent} destroyInactiveTabPane />
			<ImportForm
				setUploadStatus={setUploadStatus}
				uploadStatus={uploadStatus}
				label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.xlsx' })}
				accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'}
				title={t('loc:Importovať salóny')}
				visible={salonImportsModalVisible}
				setVisible={setSalonImportsModalVisible}
				onSubmit={salonImportsSubmit}
			/>
		</>
	)
}

export default compose(withPermissions(permissions))(SalonsPage)
