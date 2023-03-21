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

const fakeData = [
	{
		actual: {
			id: '7b22aad6-be64-4f7f-92a2-00f03e72164e',
			validFrom: '2023-03-01',
			validTo: '2023-03-31',
			amount: 99
		},
		next: {
			id: '13c18e38-700c-49c0-b694-0923c3f21868',
			validFrom: '2023-04-01',
			validTo: '2023-04-30',
			amount: 30
		},
		country: {
			code: 'BG',
			name: 'Bulharsko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/BG.png',
			currencyCode: 'BGN'
		}
	},
	{
		actual: {
			id: '171a68d9-4e4a-47a1-9eb6-877eeddcd6aa',
			validFrom: '2023-02-28',
			validTo: '2023-05-31',
			amount: 50
		},
		next: {
			id: 'a0b79b7c-5cb6-40f8-a3b1-5e688844042f',
			validFrom: '2023-06-01',
			amount: 30
		},
		country: {
			code: 'CZ',
			name: 'Česko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/CZ.png',
			currencyCode: 'CZK'
		}
	},
	{
		actual: {
			id: '57aa6cfd-574f-464e-9840-6dabaa36832a',
			validFrom: '2023-03-01',
			validTo: '2023-05-31',
			amount: 25
		},
		next: {
			id: 'cdaa0a06-333a-4af6-93f2-7dd87922ff14',
			validFrom: '2023-06-01',
			amount: 999999999
		},
		country: {
			code: 'HU',
			name: 'Maďarsko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/HU.png',
			currencyCode: 'HUF'
		}
	}
	/* {
		actual: {
			id: '44075615-2c6f-4281-92fb-f16d251a6ba8',
			validFrom: '2023-03-05',
			validTo: '2023-04-30',
			amount: 50
		},
		next: {
			id: 'a8e2be91-bf0e-410a-b759-c43bb0dce7a8',
			validFrom: '2023-05-01',
			validTo: '2023-11-30',
			amount: 20
		},
		country: {
			code: 'IT',
			name: 'Taliansko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/IT.png',
			currencyCode: 'EUR'
		}
	},
	{
		actual: {
			id: '00000000-0000-0000-0000-000000000004',
			validFrom: '2023-01-01',
			amount: 0.2
		},
		country: {
			code: 'RO',
			name: 'Rumunsko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/RO.png',
			currencyCode: 'RON'
		}
	},
	{
		actual: {
			id: 'b25afaea-40b8-40f1-8bd5-42a10e2b9f21',
			validFrom: '2023-02-28',
			validTo: '2023-03-31',
			amount: 50
		},
		next: {
			id: '8be6efa6-a630-4ff8-bbed-fbaea10bdc7c',
			validFrom: '2023-04-01',
			validTo: '2023-06-30',
			amount: 0.04
		},
		country: {
			code: 'SK',
			name: 'Slovensko',
			flag: 'https://d1pfrdq2i86yn4.cloudfront.net/flags/sm/SK.png',
			currencyCode: 'EUR'
		}
	} */
]

type TableDataItem = NonNullable<ISmsUnitPricesActualPayload['data']>[0] & { key: string }

const SmsUnitPricesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	/* const smsUnitPricesActual = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPricesActual) */
	const smsUnitPricesActual = {
		data: fakeData,
		isLoading: false,
		isFailure: false
	}
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

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
		if (!smsUnitPricesActual || !smsUnitPricesActual.data || !countries.data) {
			return []
		}

		const transformedData: TableDataItem[] = countries.data.map((country) => {
			const smsPriceUnit = smsUnitPricesActual.data.find((item) => item.country.code === country.code)
			if (smsPriceUnit) {
				return { key: country.code, ...smsPriceUnit }
			}

			return {
				key: country.code,
				actual: {
					amount: 0,
					id: '',
					validFrom: ''
				},
				country: {
					code: country.code,
					name: country.name,
					currencyCode: country.currencyCode || undefined,
					flag: country.flag
				}
			}
		})

		return query.search
			? transformedData.filter((smsUnitPrice) => {
					const countryName = transformToLowerCaseWithoutAccent(smsUnitPrice.country.name)
					const searchedValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return countryName.includes(searchedValue)
			  })
			: transformedData
	}, [query.search, smsUnitPricesActual, countries.data])

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
				const { currencyCode } = record.country
				const currency = currencies.data?.find((item) => item.code === currencyCode)
				return `${value.amount} ${currency?.symbol || ''}`
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
				return <div style={{ marginLeft: '20%' }}>{dayjs(record.actual.validFrom).format(D_M_YEAR_FORMAT)}</div>
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
				return value ? `${value.amount} ${currency?.symbol || ''} ${t('loc:od {{ timeFrom }}', { timeFrom: dayjs(value.validFrom).format(D_M_YEAR_FORMAT) })}` : '-'
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
									rowKey={(record) => `${record.actual.id}_${record.country.code}`}
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
