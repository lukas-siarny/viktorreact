import React, { useEffect, useState, useMemo } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { ColumnProps } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { initialize } from 'redux-form'
import { isEmpty } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesFilter from './components/SmsUnitPricesFilter'
import RechargeSmsCredit from '../../components/RechargeSmsCredit/RechargeSmsCredit'

// assets
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-right.svg'

// utils
import { ENUMERATIONS_KEYS, FORM, PERMISSION, SALON_CREATE_TYPE, SALON_FILTER_STATES } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { normalizeDirectionKeys } from '../../utils/helper'
import { postReq } from '../../utils/request'
import { getSalonTagSourceType } from '../SalonsPage/components/salonUtils'

// types
import { IBreadcrumbs, IRechargeSmsCreditForm, ISmsUnitPricesFilter } from '../../types/interfaces'
import { RootState } from '../../reducers'

// redux
import { getSmsUnitPricesActual } from '../../reducers/smsUnitPrices/smsUnitPricesActions'
import { getSalons, ISalonsPayload } from '../../reducers/salons/salonsActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import useQueryParams, { BooleanParam, NumberParam, StringParam } from '../../hooks/useQueryParams'

type TableDataItem = NonNullable<ISalonsPayload['data']>['salons'][0]
type SelectedRow = { id: React.Key; wallet: TableDataItem['wallet'] }
type SelectedRows = { [key: number]: SelectedRow[] }

const SELECTION_LIMIT = 30

const getWalletIDs = (selectedRows: SelectedRows) =>
	Object.values(selectedRows).reduce((acc, cv) => {
		const currentDayWalletIDs = cv.reduce((ids, cd) => (cd.wallet?.id ? [...ids, cd.wallet?.id] : ids), [] as string[])
		return [...acc, ...currentDayWalletIDs]
	}, [] as string[])

const getSelectedKeys = (selectedRows: SelectedRows) =>
	Object.values(selectedRows).reduce((acc, cv) => {
		const currentDayKeys = cv.map((cd) => cd.id)
		return [...acc, ...currentDayKeys]
	}, [] as React.Key[])

const RechargeSmsCreditSalonsAdminPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])
	const salons = useSelector((state: RootState) => state.salons.salons)
	const selectedCountryCode = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const selectedCountry = countries.data?.find((country) => country.code === selectedCountryCode)
	const currency = currencies.data?.find((c) => c.code === selectedCountry?.currencyCode)

	const [selectedRows, setSelectedRows] = useState<SelectedRows>({})

	const selectedRowKeys: React.Key[] = useMemo(() => getSelectedKeys(selectedRows), [selectedRows])

	const [backUrl] = useBackUrl(t('paths:sms-credits'))

	const [query, setQuery] = useQueryParams({
		limit: NumberParam(25),
		page: NumberParam(1),
		search: StringParam(),
		countryCode: StringParam(selectedCountryCode),
		sourceType: StringParam(),
		walletAvailableBalanceFrom: NumberParam(),
		walletAvailableBalanceTo: NumberParam(),
		showForm: BooleanParam(false)
	})

	const loading = salons?.isLoading

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:SMS kredity'),
				link: backUrl
			},
			{
				name: t('loc:Dobiť kredity salónom')
			}
		]
	}

	useEffect(() => {
		dispatch(getSmsUnitPricesActual())
	}, [dispatch])

	useEffect(() => {
		dispatch(
			getSalons({
				statuses_published: SALON_FILTER_STATES.PUBLISHED,
				createType: SALON_CREATE_TYPE.NON_BASIC,
				limit: query.limit,
				page: query.page,
				search: query.search,
				countryCode: query.countryCode,
				sourceType: query.sourceType,
				walletAvailableBalanceFrom: query.walletAvailableBalanceFrom,
				walletAvailableBalanceTo: query.walletAvailableBalanceTo
			})
		)
	}, [dispatch, query.limit, query.page, query.search, query.countryCode, query.sourceType, query.walletAvailableBalanceFrom, query.walletAvailableBalanceTo])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_UNIT_PRICES_FILTER, { search: query.search }))
	}, [query.search, dispatch])

	const handleShowForm = (visible: boolean) => {
		setQuery({ showForm: visible }, { replace: false })
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
			page
		}
		setQuery(newQuery)
	}

	const onSelectChange = (_newSelectedRowKeys: React.Key[], newSelectedRows: TableDataItem[]) => {
		const isSubstraction = selectedRows[query.page] && newSelectedRows.length < selectedRows[query.page].length

		let newRows: SelectedRow[] = []
		if (!isSubstraction) {
			const countLeftToSelect = SELECTION_LIMIT - selectedRowKeys.length
			const existingRows: SelectedRow[] = []
			const nonExistingRows: SelectedRow[] = []

			const currentPage = selectedRows[query.page] || []

			newSelectedRows.forEach((item) => {
				const rowItem = { id: item.id, wallet: item.wallet }
				if (currentPage.find((cp) => cp.id === item.id)) {
					existingRows.push(rowItem)
				} else {
					nonExistingRows.push(rowItem)
				}
			})
			newRows = [...existingRows, ...nonExistingRows.splice(0, countLeftToSelect)]
		} else {
			newRows = newSelectedRows.map((row) => ({ id: row.id, wallet: row.wallet }))
		}
		setSelectedRows({ ...selectedRows, [query.page]: newRows })
	}

	const handleRechargeCredit = async (values: IRechargeSmsCreditForm) => {
		if (!currency?.code) {
			return
		}
		try {
			await postReq(
				'/api/b2b/admin/wallets/transactions',
				{},
				{
					amount: values.amount,
					currencyCode: currency.code,
					transactionNote: values.transactionNote || null,
					walletIDs: getWalletIDs(selectedRows) as any
				}
			)
			if (backUrl) {
				navigate(backUrl)
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}
	const columns: ColumnProps<TableDataItem>[] = useMemo(() => {
		return [
			{
				title: t('loc:Názov'),
				dataIndex: 'name',
				key: 'name',
				width: '30%',
				ellipsis: true
			},
			{
				title: t('loc:Adresa'),
				dataIndex: 'address',
				key: 'address',
				ellipsis: true,
				sorter: false,
				width: '30%',
				render: (value) => (!isEmpty(value) ? <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</> : '-')
			},
			{
				title: t('loc:Zdroj vytvorenia'),
				dataIndex: 'sourceType',
				key: 'sourceType',
				sorter: false,
				ellipsis: true,
				width: '20%',
				render: (value: string) => getSalonTagSourceType(value)
			},
			{
				title: t('loc:Stav konta'),
				dataIndex: 'wallet',
				key: 'wallet',
				ellipsis: true,
				sorter: false,
				width: '20%',
				render: (_value, record) => {
					const value = record.wallet
					return value ? `${value.availableBalance} ${value.currency.symbol}` : '-'
				}
			}
		]
	}, [t])

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>

			{query.showForm ? (
				<RechargeSmsCredit handleRechargeCredit={handleRechargeCredit} currencySymbol={currency?.symbol || ''} />
			) : (
				<div className='content-body mt-0'>
					<Spin spinning={loading}>
						<SmsUnitPricesFilter
							onSubmit={(values: ISmsUnitPricesFilter) => {
								setQuery({ ...query, search: values.search })
							}}
						/>
						<div className={'w-full flex'}>
							<CustomTable<TableDataItem>
								className='table-fixed'
								columns={columns}
								onChange={onChangeTable}
								dataSource={salons.data?.salons}
								rowSelection={{
									selectedRowKeys,
									onChange: onSelectChange,
									getCheckboxProps: (record) => ({
										disabled: (!selectedRowKeys.includes(record.id) && selectedRowKeys.length >= SELECTION_LIMIT) || !record.wallet?.id
									})
								}}
								twoToneRows
								rowKey={'id'}
								useCustomPagination
								pagination={{
									pageSize: salons?.data?.pagination?.limit,
									total: salons?.data?.pagination?.totalCount,
									current: salons?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: salons?.isLoading
								}}
								customFooterContent={
									<div className={'flex w-full items-center gap-4 my-4'}>
										<span className={'mr-auto text-sm text-grayDarker'}>{`${selectedRowKeys.length}/${SELECTION_LIMIT} ${t('loc:označených')}`}</span>
										<p className={'m-0 text-xxs text-grayDarker max-w-60 text-right'}>
											{t('loc:Pre pokračovanie označte salóny, ktorým chcete dobiť kredit. Môžete označiť najviac {{ maxCount }} salónov.', {
												maxCount: SELECTION_LIMIT
											})}
										</p>
										<Button
											type={'primary'}
											className={'noti-btn'}
											htmlType={'button'}
											onClick={() => handleShowForm(true)}
											icon={<ChevronRightIcon width={16} height={16} />}
											disabled={loading || !selectedRowKeys.length}
										>
											{t('loc:Pokračovať')}
										</Button>
									</div>
								}
							/>
						</div>
					</Spin>
				</div>
			)}
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO]))(RechargeSmsCreditSalonsAdminPage)
