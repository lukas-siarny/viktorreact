import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, TablePaginationConfig } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { SorterResult } from 'antd/lib/table/interface'
import dayjs from 'dayjs'
import { ColumnProps } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { initialize } from 'redux-form'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesFilter from './components/SmsUnitPricesFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS, FORM, D_M_YEAR_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent, getLinkWithEncodedBackUrl } from '../../utils/helper'

// assets
import { ReactComponent as ChevronLeftIcon } from '../../assets/icons/chevron-left-16.svg'

// reducers
import { getSmsUnitPricesActual, ISmsUnitPricesActualPayload } from '../../reducers/smsUnitPrices/smsUnitPricesActions'

// types
import { IBreadcrumbs, ISpecialistContactFilter } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useQueryParams, { StringParam } from '../../hooks/useQueryParams'

type TableDataItem = NonNullable<ISmsUnitPricesActualPayload['data']>[0] & { key: string }

const SmsUnitPricesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const smsUnitPricesActual = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPricesActual)
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		order: StringParam('country:ASC')
	})

	const navigate = useNavigate()

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam SMS kreditov')
			}
		]
	}

	useEffect(() => {
		dispatch(getSmsUnitPricesActual())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_UNIT_PRICES_FILTER, { search: query.search }))
	}, [query.search, dispatch])

	const tableData = useMemo(() => {
		if (!smsUnitPricesActual || !smsUnitPricesActual.data) {
			return []
		}
		const source = query.search
			? smsUnitPricesActual.data.filter((smsUnitPrice) => {
					const countryName = transformToLowerCaseWithoutAccent(smsUnitPrice.country.name)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return countryName.includes(searchedValue)
			  })
			: smsUnitPricesActual.data

		// transform to table data
		return source?.map((item) => ({
			...item,
			key: item.country.code
		}))
	}, [query.search, smsUnitPricesActual])

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

	const columns: ColumnProps<TableDataItem>[] = [
		{
			title: t('loc:Krajina'),
			dataIndex: 'country',
			key: 'country',
			width: '20%',
			sortOrder: setOrder(query.order, 'country'),
			sorter: {
				compare: (a, b) => {
					const aValue = a?.country?.name
					const bValue = b?.country?.name
					return sortData(aValue, bValue)
				}
			},
			render: (_value, record) => {
				const { country } = record
				const name = country.name || country.code
				return (
					<div className={'flex items-center gap-2'}>
						{country.flag && <img src={country.flag} alt={name} width={24} />}
						<span className={'truncate inline-block'}>{name}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Aktuálna cena SMS'),
			dataIndex: 'actual',
			key: 'amount',
			ellipsis: true,
			align: 'right',
			width: '20%',
			render: (_value, record) => {
				const value = record.actual

				if (!value) {
					return '-'
				}

				const { currencyCode } = record.country
				const currency = currencies.data?.find((item) => item.code === currencyCode)
				return `${value.amount} ${currency?.symbol}`
			}
		},
		{
			title: <div style={{ marginLeft: '20%' }}>{t('loc:Platná od')}</div>,
			dataIndex: 'actual',
			key: 'validFrom',
			ellipsis: true,
			sorter: false,
			width: '30%',
			render: (_value, record) => {
				return record.actual?.validFrom ? <div style={{ marginLeft: '20%' }}>{dayjs(record.actual.validFrom).format(D_M_YEAR_FORMAT)}</div> : '-'
			}
		},
		{
			title: t('loc:Plánovaná cena SMS'),
			dataIndex: 'next',
			key: 'validFromNext',
			ellipsis: true,
			sorter: false,
			width: '30%',
			render: (_value, record) => {
				const value = record.next
				const { currencyCode } = record.country
				const currency = currencies.data?.find((item) => item.code === currencyCode)
				return value ? `${value.amount} ${currency?.symbol} ${t('loc:od {{ timeFrom }}', { timeFrom: dayjs(value.validFrom).format(D_M_YEAR_FORMAT) })}` : '-'
			}
		},
		{
			key: 'action',
			width: 30,
			render: () => {
				return (
					<div className={'flex items-center jusitfy-center'}>
						<ChevronLeftIcon style={{ transform: 'rotate(180deg)' }} />
					</div>
				)
			}
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={smsUnitPricesActual?.isLoading}>
							<SmsUnitPricesFilter
								onSubmit={(values: ISpecialistContactFilter) => {
									setQuery({ ...query, search: values.search })
								}}
							/>
							<div className={'w-full flex'}>
								<CustomTable<TableDataItem>
									className='table-fixed'
									columns={columns}
									onChange={onChangeTable}
									dataSource={tableData}
									rowClassName={'clickable-row'}
									twoToneRows
									rowKey={(record) => `${record.actual?.id}_${record.country.code}`}
									pagination={false}
									onRow={(record) => {
										return {
											onClick: () => {
												navigate(
													getLinkWithEncodedBackUrl(t('paths:sms-credits/{{countryCode}}', { countryCode: record.country.code.toLocaleLowerCase() }))
												)
											}
										}
									}}
								/>
							</div>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SMS_UNIT_PRICE_EDIT]))(SmsUnitPricesPage)
