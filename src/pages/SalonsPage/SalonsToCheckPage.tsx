import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Col, Image, Row, Spin, Tooltip } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, isPristine } from 'redux-form'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

// components
import CustomTable from '../../components/CustomTable'
import SalonsFilterDeleted, { ISalonsFilterDeleted } from './components/filters/SalonsFilterDeleted'

// utils
import { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, REQUEST_STATUS, SALON_STATES, SALONS_TAB_KEYS } from '../../utils/enums'
import { formatDateByLocale, getAssignedUserLabel, getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { getCheckerIcon, getSalonTagChanges, getSalonTagCreateType, getSalonTagSourceType } from './components/salonUtils'

// reducers
import { getSalonsToCheck } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'

// types
import { Columns } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { salonsToCheckPageURLQueryParamsSchema } from '../../schemas/queryParams'

type Props = {
	selectedCountry?: string
}

const SalonsToCheckPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { selectedCountry } = props

	const salons = useSelector((state: RootState) => state.salons.salonsToCheck)

	const isFormPristine = useSelector((state: RootState) => isPristine(FORM.SALONS_FILTER_ACITVE)(state))

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const [query, setQuery] = useQueryParams(salonsToCheckPageURLQueryParamsSchema, {
		page: 1
	})

	useEffect(() => {
		const countryCode = isFormPristine ? selectedCountry : query.countryCode

		dispatch(
			initialize(FORM.SALONS_FILTER_DELETED, {
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				createType: query.createType,
				assignedUserID: query.assignedUserID,
				countryCode
			})
		)
		dispatch(
			getSalonsToCheck({
				page: query.page,
				limit: query.limit,
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				createType: query.createType,
				assignedUserID: query.assignedUserID,
				countryCode
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		dispatch,
		query.page,
		query.limit,
		query.search,
		query.statuses_all,
		query.statuses_changes,
		query.statuses_published,
		query.createType,
		query.assignedUserID,
		query.countryCode,
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
		[t]
	)

	const columns = [
		tableColumns.id({ width: '8%' }),
		tableColumns.name({ width: '20%' }),
		tableColumns.address({ width: '16%' }),
		tableColumns.deletedAt({ width: '16%' }),
		tableColumns.fillingProgress({ width: '16%' }),
		tableColumns.createdAt({ width: '20%' })
	]

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<Spin spinning={salons?.isLoading}>
					<div className='content-body'>
						<SalonsFilterDeleted onSubmit={handleSubmitDeleted} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns || []}
							dataSource={salons?.data?.salons}
							scroll={{ x: 1000 }}
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

export default SalonsToCheckPage
