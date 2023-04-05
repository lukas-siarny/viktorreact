import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, TablePaginationConfig } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { SorterResult } from 'antd/lib/table/interface'
import dayjs from 'dayjs'
import { ColumnProps } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../../components/CustomTable'
import SmsUnitPricesFilter from './SmsUnitPricesFilter'

// utils
import { ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS, FORM, D_M_YEAR_FORMAT } from '../../../utils/enums'
import { normalizeDirectionKeys, setOrder, sortData, transformToLowerCaseWithoutAccent, getLinkWithEncodedBackUrl } from '../../../utils/helper'

// assets
import { ReactComponent as ChevronLeftIcon } from '../../../assets/icons/chevron-left-16.svg'

// reducers
import { getSmsUnitPricesActual, ISmsUnitPricesActualPayload } from '../../../reducers/smsUnitPrices/smsUnitPricesActions'

// types
import { ISmsUnitPricesFilter } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

type TableDataItem = NonNullable<ISmsUnitPricesActualPayload['data']>[0] & { key: string; currencySymbol: string }

const SmsUnitPricesTable = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const smsUnitPricesActual = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPricesActual)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])

	const [query, setQuery] = useState({
		search: '',
		order: 'country:ASC'
	})

	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getSmsUnitPricesActual())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_UNIT_PRICES_FILTER, { search: query.search }))
	}, [query.search, dispatch])

	const tableData = useMemo(() => {
		if (!smsUnitPricesActual.data) {
			return []
		}
		const source = query.search
			? smsUnitPricesActual.data.filter((smsUnitPrice) => {
					const countryName = transformToLowerCaseWithoutAccent(smsUnitPrice.country.name)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search)
					return countryName.includes(searchedValue)
			  })
			: smsUnitPricesActual.data

		// transform to table data
		return source?.map((item) => {
			const country = countries.data?.find((c) => c.code === item.country.code)
			const currency = currencies.data?.find((c) => c.code === country?.currencyCode)
			return {
				...item,
				currencySymbol: currency?.symbol || '',
				key: item.country.code
			}
		})
	}, [query.search, smsUnitPricesActual, currencies.data, countries.data])

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

	const columns: ColumnProps<TableDataItem>[] = useMemo(() => {
		return [
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

					return `${value.amount} ${record.currencySymbol}`
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
					return <div style={{ marginLeft: '20%' }}>{record?.actual?.validFrom ? dayjs(record.actual.validFrom).format(D_M_YEAR_FORMAT) : ''}</div>
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
					return value ? `${value.amount} ${record.currencySymbol} ${t('loc:od {{ timeFrom }}', { timeFrom: dayjs(value.validFrom).format(D_M_YEAR_FORMAT) })}` : '-'
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
	}, [query.order, t])

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<h3 className={'text-2xl whitespace-nowrap'}>{t('loc:Ceny SMS správ')}</h3>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={smsUnitPricesActual?.isLoading}>
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
								dataSource={tableData}
								rowClassName={'clickable-row'}
								twoToneRows
								// TODO: update testov
								rowKey={(record) => (record.actual?.id ? `${record.actual.id}_${record.country.code}` : record.country.code)}
								pagination={false}
								onRow={(record) => {
									return {
										className: !record.actual && !record.next ? 'noti-table-row-warning' : undefined,
										onClick: () => {
											navigate(getLinkWithEncodedBackUrl(t('paths:sms-credits/{{countryCode}}', { countryCode: record.country.code.toLocaleLowerCase() })))
										}
									}
								}}
							/>
						</div>
					</Spin>
				</div>
			</Col>
		</Row>
	)
}

export default SmsUnitPricesTable
