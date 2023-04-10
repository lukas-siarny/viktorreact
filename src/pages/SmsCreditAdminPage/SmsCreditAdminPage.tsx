import React, { useEffect, useState, useMemo } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { ColumnProps } from 'antd/es/table'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { initialize } from 'redux-form'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import SmsTimeStats from '../../components/Dashboards/SmsTimeStats'
import SelectField from '../../atoms/SelectField'
import CustomTable from '../../components/CustomTable'
import SmsUnitPricesFilter from './components/SmsUnitPricesFilter'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as GlobeIcon } from '../../assets/icons/globe-24.svg'
import { ReactComponent as ChevronLeftIcon } from '../../assets/icons/chevron-left-16.svg'

// utils
import { D_M_YEAR_FORMAT, ENUMERATIONS_KEYS, FORM, LANGUAGE, PERMISSION } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, optionRenderWithImage, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'
import { LOCALES } from '../../components/LanguagePicker'

// types
import { IBreadcrumbs, ISmsUnitPricesFilter } from '../../types/interfaces'
import { RootState } from '../../reducers'

// redux
import { getSmsTimeStatsForCountry } from '../../reducers/sms/smsActions'
import { getSmsUnitPricesActual, ISmsUnitPricesActualPayload } from '../../reducers/smsUnitPrices/smsUnitPricesActions'

type TableDataItem = NonNullable<ISmsUnitPricesActualPayload['data']>[0] & { key: string; currencySymbol: string }

const SmsCreditAdiminPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const currencies = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.CURRENCIES])
	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)
	const smsUnitPricesActual = useSelector((state: RootState) => state.smsUnitPrices.smsUnitPricesActual)
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)

	const [smsStatsDate, setSmsStatsDate] = useState(dayjs())
	const [smsStatsCountryCode, setSmsStatsCountryCode] = useState(selectedCountry || LOCALES[LANGUAGE.SK].countryCode)

	const [query, setQuery] = useState({
		search: '',
		order: 'country:ASC'
	})

	useEffect(() => {
		if (smsStatsCountryCode) {
			dispatch(getSmsTimeStatsForCountry(smsStatsCountryCode, smsStatsDate.year(), smsStatsDate.month() + 1))
		}
	}, [dispatch, smsStatsCountryCode, smsStatsDate])

	useEffect(() => {
		dispatch(getSmsUnitPricesActual())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_UNIT_PRICES_FILTER, { search: query.search }))
	}, [query.search, dispatch])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:SMS kredity')
			}
		]
	}

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
				width: '25%',
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
				width: '25%',
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
				width: '25%',
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
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<div className='content-body dashboard-content'>
				<div className={'w-full flex justify-end'}>
					<Permissions
						allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								onClick={() => {
									if (hasPermission) {
										navigate(`${t('paths:sms-credits')}/${t('paths:recharge')}`)
									} else {
										openForbiddenModal()
									}
								}}
								type='primary'
								htmlType='button'
								className={'noti-btn'}
								icon={<PlusIcon />}
							>
								{t('loc:Dobiť kredity salónom')}
							</Button>
						)}
					/>
				</div>

				<SmsTimeStats
					onPickerChange={(date) => {
						if (date) {
							setSmsStatsDate(date)
						}
					}}
					title={<h2 className={'mb-0'}>{t('loc:Spotreba SMS kreditu za obdobie')}</h2>}
					selectedDate={smsStatsDate}
					smsTimeStats={smsTimeStats}
					className={'mt-6 mb-16 py-0'}
					countryPicker={
						<SelectField
							input={{ value: smsStatsCountryCode, onChange: (value: any) => setSmsStatsCountryCode(value) } as any}
							meta={{} as any}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							size={'middle'}
							className={'mb-0 pb-0 w-48'}
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
					}
				/>

				<h3 className={'text-2xl whitespace-nowrap'}>{t('loc:Ceny SMS správ')}</h3>

				<div className='content-body mt-0'>
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
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO]))(SmsCreditAdiminPage)
