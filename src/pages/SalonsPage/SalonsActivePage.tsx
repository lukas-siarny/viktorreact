import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, isPristine } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import SalonsActiveFilter, { ISalonsFilterActive } from './components/filters/SalonsActiveFilter'
import SalonsReportModal, { ALL_COUNTRIES_OPTION } from './components/modals/SalonsReportModal'
import ImportForm from '../../components/ImportForm'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT, REQUEST_STATUS, SALONS_TAB_KEYS } from '../../utils/enums'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys } from '../../utils/helper'
import { getReq, postReq } from '../../utils/request'
import { SalonsPageCommonProps, getSalonsColumns } from './components/salonUtils'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IDataUploadForm, ISalonsReportForm } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { salonsActivePageURLQueryParamsSchema } from '../../schemas/queryParams'

type Props = SalonsPageCommonProps & {}

const SalonsActivePage: React.FC<Props> = (props) => {
	const { selectedCountry, changeSelectedCountry, t, navigate, dispatch } = props

	const salons = useSelector((state: RootState) => state.salons.salons)
	const categories = useSelector((state: RootState) => state.categories.categories)
	const isFormPristine = useSelector((state: RootState) => isPristine(FORM.SALONS_FILTER_ACITVE)(state))

	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)
	const [requestStatusImport, setRequestStatusImport] = useState<REQUEST_STATUS | undefined>(undefined)
	const [requestStatusReport, setRequestStatusReport] = useState<REQUEST_STATUS | undefined>(undefined)
	const [salonsReportModalVisible, setSalonsReportModalVisible] = useState(false)

	const [query, setQuery] = useQueryParams(salonsActivePageURLQueryParamsSchema, {
		page: 1,
		order: 'createdAt:DESC'
	})

	const salonsColumns = useMemo(() => getSalonsColumns(query.order, categories.data), [query.order, categories.data])

	const columns = [
		salonsColumns.id({ width: '8%' }),
		salonsColumns.name({ width: '15%' }),
		salonsColumns.address({ width: '15%' }),
		salonsColumns.categories({ width: '9%' }),
		salonsColumns.isPublished({ width: '8%' }),
		salonsColumns.changes({ width: '10%' }),
		salonsColumns.createType({ width: '10%' }),
		salonsColumns.enabledRS({ width: '8%' }),
		salonsColumns.availableReservationSystem({ width: '8%' }),
		salonsColumns.premiumSourceUserType({ width: '6%' }),
		salonsColumns.assignedUser({ width: '10%' }),
		salonsColumns.fillingProgress({ width: '8%' }),
		salonsColumns.lastUpdatedAt({ width: '8%' }),
		salonsColumns.createdAt({ width: '8%' })
	]

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	useEffect(() => {
		const countryCode = isFormPristine ? selectedCountry : query.countryCode

		dispatch(
			initialize(FORM.SALONS_FILTER_ACITVE, {
				search: query.search,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				categoryThirdLevelIDs: query.categoryThirdLevelIDs,
				countryCode,
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

		dispatch(initialize(FORM.SALONS_REPORT, { countryCode: countryCode || ALL_COUNTRIES_OPTION }))

		dispatch(
			getSalons({
				page: query.page,
				limit: query.limit,
				search: query.search,
				order: query.order,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				statuses_all: query.statuses_all,
				statuses_published: query.statuses_published,
				statuses_changes: query.statuses_changes,
				countryCode: query.countryCode,
				createType: query.createType,
				lastUpdatedAtFrom: query.lastUpdatedAtFrom,
				lastUpdatedAtTo: query.lastUpdatedAtTo,
				hasSetOpeningHours: query.hasSetOpeningHours,
				sourceType: query.sourceType,
				premiumSourceUserType: query.premiumSourceUserType,
				assignedUserID: query.assignedUserID,
				hasAvailableReservationSystem: query.hasAvailableReservationSystem,
				enabledReservationsSetting: query.enabledReservationsSetting,
				salonState: SALONS_TAB_KEYS.ACTIVE,
				categoryThirdLevelIDs: query.categoryThirdLevelIDs
			})
		)
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
		query.categoryThirdLevelIDs,
		selectedCountry
	])

	const handleSubmitActive = (values: ISalonsFilterActive) => {
		const { dateFromTo, ...restValues } = values

		// update selected country globally based on filter
		changeSelectedCountry(restValues?.countryCode || undefined)

		const newQuery = {
			...query,
			...restValues,
			lastUpdatedAtFrom: dateFromTo?.dateFrom,
			lastUpdatedAtTo: dateFromTo?.dateTo,
			page: 1
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

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === salons?.data?.pagination?.limit ? page : 1
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

	return (
		<>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<Spin spinning={salons?.isLoading}>
						<div className='content-body'>
							<SalonsActiveFilter
								onSubmit={handleSubmitActive}
								onImportSalons={() => setSalonImportsModalVisible(true)}
								onDownloadReport={() => setSalonsReportModalVisible(true)}
								hasAssignedUserId={!!query.assignedUserID}
							/>
							<CustomTable
								className='table-fixed'
								onChange={onChangeTable}
								columns={columns || []}
								dataSource={salons?.data?.salons}
								scroll={{ x: 1200 }}
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

export default SalonsActivePage
