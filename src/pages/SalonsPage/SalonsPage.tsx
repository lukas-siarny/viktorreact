import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import React, { useEffect, useMemo, useState } from 'react'
import { ArrayParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Modal, Progress, Row, Spin } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize, reset } from 'redux-form'
import cx from 'classnames'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonsFilter, { ISalonsFilter } from './components/SalonsFilter'
import SalonsImportForm from './components/SalonsImportForm'

// utils
import Permissions, { withPermissions, checkPermissions } from '../../utils/Permissions'
import { FORM, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import { postReq } from '../../utils/request'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, IDataUploadForm } from '../../types/interfaces'

// assets
import { ReactComponent as CircleCheckIcon } from '../../assets/icons/check-circle-icon.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import UploadSuccess from './components/UploadSuccess'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const PROGRESS_PERCENTAGE = 33

const SalonsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salons = useSelector((state: RootState) => state.salons.salons)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)
	const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error' | undefined>(undefined)

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON_IMPORTS_FORM]?.values)

	useEffect(() => {
		dispatch(getCategories())
		dispatch(selectSalon())
	}, [dispatch])

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		categoryFirstLevelIDs: ArrayParam,
		statuses: ArrayParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'createdAt:DESC'),
		countryCode: StringParam
	})

	const isAdmin = useMemo(() => checkPermissions(authUserPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUserPermissions])

	useEffect(() => {
		dispatch(
			initialize(FORM.SALONS_FILTER, { search: query.search, statuses: query.statuses, categoryFirstLevelIDs: query.categoryFirstLevelIDs, countryCode: query.countryCode })
		)
		dispatch(
			getSalons({
				page: query.page,
				limit: query.limit,
				order: query.order,
				search: query.search,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				statuses: query.statuses,
				countryCode: query.countryCode
			})
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryFirstLevelIDs, query.statuses, query.countryCode])

	const onChangeTable = (pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				limit: pagination.pageSize,
				page: pagination.current,
				order
			}
			setQuery(newQuery)
		}
	}

	const handleSubmit = (values: ISalonsFilter) => {
		const newQuery = {
			...query,
			...values,
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
			// change(FORM.SALON_IMPORTS_FORM, 'file', '')
		} catch {
			setUploadStatus('error')
		}
	}

	const resetUploadForm = () => {
		setUploadStatus(undefined)
		reset(FORM.SALON_IMPORTS_FORM)
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			sorter: true,
			width: '22%',
			sortOrder: setOrder(query.order, 'name')
		},
		{
			title: t('loc:Adresa'),
			dataIndex: 'address',
			key: 'address',
			ellipsis: true,
			sorter: false,
			width: '20%',
			render: (value) => <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</>
		},
		{
			title: t('loc:Vymazaný'),
			dataIndex: 'deletedAt',
			key: 'deletedAt',
			ellipsis: true,
			sorter: false,
			width: '8%',
			render: (value) =>
				value ? (
					<div className={'flex justify-start'}>
						<CircleCheckIcon width={20} height={20} />
					</div>
				) : null
		},
		{
			title: t('loc:Publikovaný'),
			dataIndex: 'isPublished',
			key: 'isPublished',
			ellipsis: true,
			sorter: false,
			width: '8%',
			render: (value, record) =>
				value ? (
					<div className={'flex justify-start'}>
						<CircleCheckIcon width={20} height={20} className={cx({ 'opacity-40': !!record.deletedAt })} />
					</div>
				) : null
		},
		{
			title: t('loc:Viditeľný'),
			dataIndex: 'isVisible',
			key: 'isVisible',
			ellipsis: true,
			sorter: false,
			width: '8%',
			render: (value, record) =>
				value ? (
					<div className={'flex justify-start'}>
						<CircleCheckIcon width={20} height={20} className={cx({ 'opacity-40': !!record.deletedAt })} />
					</div>
				) : null
		},
		{
			title: t('loc:Vyplnenia profilu'),
			dataIndex: 'fillingProgressSalon',
			key: 'fillingProgressSalon',
			ellipsis: true,
			sorter: false,
			// NOTE: sort by fillingProgressSalon when BE is done
			/* sorter: true,
			sortOrder: setOrder(query.order, 'fillingProgressSalon'), */
			render: (value, record) => {
				const progressVariables = [Number(value), Number(record.fillingProgressServices), Number(record.fillingProgressCompany)]
				// 1% 34%, 67%, 100%
				const result = progressVariables.reduce((a, b) => a + b, 0) * PROGRESS_PERCENTAGE + 1
				return <Progress className='w-4/5' percent={result} showInfo={false} strokeColor={'#000'} />
			}
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'createdAt'),
			render: (value) => formatDateByLocale(value)
		}
	]

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
								<SalonsFilter
									createSalon={() => {
										if (hasPermission) {
											history.push(t('paths:salons/create'))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
									openSalonImportsModal={() => setSalonImportsModalVisible(true)}
								/>
							)}
						/>
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={salons?.data?.salons}
							rowClassName={'clickable-row'}
							loading={salons?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									history.push(t('paths:salons/{{salonID}}', { salonID: record.id }))
								}
							})}
							pagination={{
								showTotal: (total, [from, to]) =>
									t('loc:{{from}} - {{to}} z {{total}} záznamov', {
										total,
										from,
										to
									}),
								defaultPageSize: PAGINATION.defaultPageSize,
								pageSizeOptions: PAGINATION.pageSizeOptions,
								pageSize: salons?.data?.pagination?.limit,
								showSizeChanger: true,
								total: salons?.data?.pagination?.totalCount,
								current: salons?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
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
