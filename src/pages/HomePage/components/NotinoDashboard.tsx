/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Empty, Row, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import colors from 'tailwindcss/colors'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

// components
import SalonDashboard from './SalonDashboard'
import Statistics from '../../../components/Dashboards/Statistics'
import CustomTable from '../../../components/CustomTable'
import TabsComponent from '../../../components/TabsComponent'
import ReservationsDashboard from './ReservationsDashboard'

// types
import { AlertData, Columns, DashboardData, TimeStats } from '../../../types/interfaces'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard, getReservationStats, getSalonsAnnualStats, getSalonsMonthStats, INotinoDashboard } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import {
	DASHBOARD_TAB_KEYS,
	FILTER_PATHS,
	PUBLISHED_PREMIUM_SALONS_BAR_ID,
	SALON_CREATE_TYPE,
	SALON_FILTER_RS,
	SALON_FILTER_RS_AVAILABLE_ONLINE,
	SALON_FILTER_STATES,
	SALON_STATS_ANNUAL_ID,
	SALON_STATS_MONTHLY_ID,
	SALONS_TAB_KEYS,
	SALONS_TIME_STATS_TYPE,
	STRINGS,
	RESERVATIONS_STATS_TYPE
} from '../../../utils/enums'
import { doughnutOptions, lineOptions, getFilterRanges, transformToStatsData, transformToReservationsStatsData } from './dashboardUtils'

// schema
import { formatObjToQuery } from '../../../hooks/useQueryParamsZod'
import { ISalonsActivePageURLQueryParams } from '../../../schemas/queryParams'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin, BarElement)

const reservationsColumns = (labels: string[] = [], futureBreak = 0): Columns => {
	return [
		{
			key: 'type',
			dataIndex: 'type',
			render: (value) => {
				switch (value) {
					case RESERVATIONS_STATS_TYPE.NEW_RS_B2B:
						return (
							<div className={'flex flex-1 items-center'}>
								<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[200], flex: '0 0 auto' }} />
								<span className='xs-bold'>{i18next.t('loc:Rezervácie vytvorené salónmi')}</span>
							</div>
						)
					case RESERVATIONS_STATS_TYPE.NEW_RS_B2C:
						return (
							<div className={'flex flex-1 items-center'}>
								<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[700], flex: '0 0 auto' }} />
								<span className='xs-bold'>{i18next.t('loc:Rezervácie vytvorené klientmi')}</span>
							</div>
						)
					default:
						return ''
				}
			}
		},
		...labels.map((label: string, index: number) => {
			return {
				key: index,
				dataIndex: index,
				className: cx({ 'future-divider': futureBreak - 0.5 === index }), // 0.5 is delta for display devider between columns
				title: <span className={cx('xs-semibold', { 'text-notino-gray': futureBreak <= index })}>{label}</span>,
				render: (value: number) => <span className={cx('xs-regular', { 'text-notino-gray': futureBreak <= index })}>{value}</span>
			}
		}),
		{
			key: 'summary',
			dataIndex: 'summary',
			title: () => <span className='xs-semibold'>{i18next.t('loc:Súčet')}</span>,
			render: (value) => <span className='xs-regular'>{value}</span>,
			align: 'center'
		}
	]
}

const salonColumns = (labels: string[] = [], futureBreak = 0): Columns => {
	return [
		{
			key: 'type',
			dataIndex: 'type',
			render: (value) => {
				switch (value) {
					case SALONS_TIME_STATS_TYPE.BASIC:
						return (
							<div className={'flex flex-1 items-center'}>
								<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[200], flex: '0 0 auto' }} />
								<span className='xs-bold'>{i18next.t('loc:BASIC')}</span>
							</div>
						)
					case SALONS_TIME_STATS_TYPE.PREMIUM:
						return (
							<div className={'flex flex-1 items-center'}>
								<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[700], flex: '0 0 auto' }} />
								<span className='xs-bold'>{i18next.t('loc:Schválené PREMIUM')}</span>
							</div>
						)
					case SALONS_TIME_STATS_TYPE.PENDING:
					default:
						return (
							<div className={'flex flex-1 items-center'}>
								<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.yellow[400], flex: '0 0 auto' }} />
								<span className='xs-bold'>{i18next.t('loc:Žiadosti o PREMIUM')}</span>
							</div>
						)
				}
			}
		},
		...labels.map((label: string, index: number) => {
			return {
				key: index,
				dataIndex: index,
				className: cx({ 'future-divider': futureBreak - 0.5 === index }), // 0.5 is delta for display devider between columns
				title: <span className={cx('xs-semibold', { 'text-notino-gray': futureBreak <= index })}>{label}</span>,
				render: (value: number) => <span className={cx('xs-regular', { 'text-notino-gray': futureBreak <= index })}>{value}</span>
			}
		}),
		{
			key: 'summary',
			dataIndex: 'summary',
			title: () => <span className='xs-semibold'>{i18next.t('loc:Súčet')}</span>,
			render: (value) => <span className='xs-regular'>{value}</span>,
			align: 'center'
		}
	]
}

const barContent = (data: any) => {
	return (
		<div className='stastics-box py-4 px-6 md:py-8 md:px-12 statistics-box-wide' id={PUBLISHED_PREMIUM_SALONS_BAR_ID}>
			<div className='flex flex-wrap justify-between w-full'>
				<h4>{data.title}</h4>
			</div>
			<div className='flex flex-wrap justify-between w-full mt-4'>
				<div className='w-2/5 mr-4 3xl:w-12/25 flex items-center'>
					<Bar height={200} data={data.data} options={data.options} />
				</div>
				<div className='flex flex-1 items-center'>
					<div className='w-full flex flex-col gap-4'>
						{data.legend.map((item: any, index: number) => (
							<div key={index} className='flex items-center w-full h-6 cursor-pointer' onClick={item.onClick}>
								<div className={'flex flex-1 items-center legend-row'}>
									<div className='h-6 w-6 rounded-full mr-4 stats-circle' style={{ backgroundColor: item.backgroundColor }} />
									<span className='base-semibold mr-3 leading-4'>{item.data}</span>
									<span className='text-sm'>{item.label}</span>
								</div>
								<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

const doughnutContent = (label: string, source?: any[], onlyLegend?: boolean) => {
	return (
		<div className='stastics-box py-4 px-6 md:py-8 md:px-12 statistics-box-wide'>
			<div className='flex flex-wrap justify-between w-full'>
				<h4>{label}</h4>
			</div>
			{source && (
				<div className='flex flex-wrap justify-between w-full mt-4'>
					{!onlyLegend && (
						<div className='graph-doughnut-wrapper w-2/5 3xl:w-12/25 flex items-center'>
							<Doughnut
								className={'graph-doughnut'}
								data={{
									labels: source.map((item: any) => item.label),
									datasets: [
										{
											data: source.map((item: any) => item.data),
											backgroundColor: source.map((item: any) => item.background)
										}
									]
								}}
								options={doughnutOptions(source)}
							/>
						</div>
					)}
					<div className='flex flex-1 items-center'>
						<div className='w-full flex flex-col gap-4'>
							{source.map((item: any, index: number) => (
								<div key={index} className='flex items-center w-full h-6 cursor-pointer' onClick={item.onClick}>
									<div className={'flex flex-1 items-center legend-row'}>
										<div className='h-6 w-6 rounded-full mr-4 stats-circle' style={{ backgroundColor: item.background }} />
										<span className='base-semibold mr-3 leading-4'>{item.data}</span>
										<span className='text-sm'>{item.label}</span>
									</div>
									<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

const lineContent = (label: string, source: TimeStats, filter: React.ReactNode | JSX.Element, columns: any) => {
	return (
		<div className='stastics-box py-4 px-6 md:py-8 md:px-12 mt-12'>
			<div className='flex justify-between w-full items-center gap-2'>
				<h4>{label}</h4>
				{filter}
			</div>
			<div className='mt-4'>
				<div className='h-40'>
					<Spin spinning={source.isLoading}>
						{source.isFailure ? (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={i18next.t('loc:Chyba')} />
						) : (
							<Line
								options={lineOptions(source.data?.breakIndex) as any}
								data={{
									labels: source?.data?.labels,
									datasets: source?.data?.datasets ?? []
								}}
							/>
						)}
					</Spin>
				</div>
				<CustomTable
					className='mt-8'
					columns={columns}
					twoToneRows
					pagination={false}
					dataSource={source.data?.columns}
					rowKey={(record) => record.type}
					scroll={{ x: 400 }}
				/>
			</div>
		</div>
	)
}
const optionsForPremiumSalonBar = {
	plugins: {
		tooltip: {
			backgroundColor: '#FFFFFF',
			titleColor: '#111827',
			bodyColor: '#404040',
			cornerRadius: 4
		},
		legend: {
			position: 'right',
			align: 'center',
			labels: {
				color: colors.black,
				font: {
					weight: '100'
				}
			},
			display: false
		}
	},
	scales: {
		x: {
			display: false // hide the X axis
		},
		y: {
			grid: {
				color: '#E6E6E6' // set the color of the X axis grid lines
			},
			ticks: {
				stepSize: 10 // set the X axis step size to 200
			}
		}
	},
	responsive: true
}

const now = dayjs()

const NotinoDashboard: FC = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [annualStatsDate, setAnnualStatsDate] = useState<Dayjs>(now)
	const [monthStatsDate, setMonthStatsDate] = useState<Dayjs>(now)
	const [monthReservationsStatsDate, setMonthReservationsStatsDate] = useState<Dayjs>(now)
	const { notino, salonsAnnualStats, salonsMonthStats, reservationsStats } = useSelector((state: RootState) => state.dashboard)

	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const navigate = useNavigate()
	const [tabKey, setTabKey] = useState<DASHBOARD_TAB_KEYS>(DASHBOARD_TAB_KEYS.SALONS_STATE)

	const publishedPremiumSalonsData = useMemo(() => {
		const query: ISalonsActivePageURLQueryParams = {
			statuses_published: SALON_FILTER_STATES.PUBLISHED,
			createType: SALON_CREATE_TYPE.NON_BASIC
		}
		return {
			title: t('loc:Publikované Premium salóny'),
			data: {
				labels: [t('loc:Premium bez RS'), t('loc:Premium s RS'), t('loc:Premium RS online')],
				datasets: [
					{
						label: t('loc:Počet'),
						data: [
							notino.data?.publishedPremiumSalons.premiumDisabledRs,
							notino.data?.publishedPremiumSalons.premiumEnabledRsB2b,
							notino.data?.publishedPremiumSalons.premiumEnabledRsB2c
						],
						backgroundColor: ['#144896', '#2277F3', '#BBD6FE'],
						borderRadius: 4
					}
				]
			},
			legend: [
				{
					label: t('loc:Premium bez RS'),
					data: notino.data?.publishedPremiumSalons.premiumDisabledRs,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({ ...query, enabledReservationsSetting: SALON_FILTER_RS.NOT_ENABLED })
						}),
					backgroundColor: '#144896'
				},
				{
					label: t('loc:Premium s RS'),
					data: notino.data?.publishedPremiumSalons.premiumEnabledRsB2b,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({ ...query, enabledReservationsSetting: SALON_FILTER_RS.ENABLED })
						}),
					backgroundColor: '#2277F3'
				},
				{
					label: t('loc:Premium RS online'),
					data: notino.data?.publishedPremiumSalons.premiumEnabledRsB2c,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({
								...query,
								enabledReservationsSetting: SALON_FILTER_RS.ENABLED,
								hasAvailableReservationSystem: SALON_FILTER_RS_AVAILABLE_ONLINE.AVAILABLE
							})
						}),
					backgroundColor: '#BBD6FE'
				}
			],
			options: optionsForPremiumSalonBar
		}
	}, [
		navigate,
		notino.data?.publishedPremiumSalons.premiumDisabledRs,
		notino.data?.publishedPremiumSalons.premiumEnabledRsB2b,
		notino.data?.publishedPremiumSalons.premiumEnabledRsB2c,
		t
	])

	const unpublishedPremiumSalonsData = useMemo(() => {
		const query: ISalonsActivePageURLQueryParams = {
			statuses_published: SALON_FILTER_STATES.NOT_PUBLISHED,
			createType: SALON_CREATE_TYPE.NON_BASIC
		}
		return {
			title: t('loc:Nepublikované Premium salóny'),
			data: {
				labels: [t('loc:Premium bez RS'), t('loc:Premium s RS'), t('loc:Premium RS online')],
				datasets: [
					{
						label: t('loc:Počet'),
						data: [
							notino.data?.unpublishedPremiumSalons.premiumDisabledRs,
							notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2b,
							notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2c
						],
						backgroundColor: ['#144896', '#2277F3', '#BBD6FE'],
						borderRadius: 4
					}
				]
			},
			legend: [
				{
					label: t('loc:Premium bez RS'),
					data: notino.data?.unpublishedPremiumSalons.premiumDisabledRs,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({ ...query, enabledReservationsSetting: SALON_FILTER_RS.NOT_ENABLED })
						}),
					backgroundColor: '#144896'
				},
				{
					label: t('loc:Premium s RS'),
					data: notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2b,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({ ...query, enabledReservationsSetting: SALON_FILTER_RS.ENABLED })
						}),
					backgroundColor: '#2277F3'
				},
				{
					label: t('loc:Premium RS online'),
					data: notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2c,
					onClick: () =>
						navigate({
							pathname: t('paths:salons'),
							search: formatObjToQuery<ISalonsActivePageURLQueryParams>({
								...query,
								enabledReservationsSetting: SALON_FILTER_RS.ENABLED,
								hasAvailableReservationSystem: SALON_FILTER_RS_AVAILABLE_ONLINE.AVAILABLE
							})
						}),
					backgroundColor: '#BBD6FE'
				}
			],
			options: optionsForPremiumSalonBar
		}
	}, [
		navigate,
		notino.data?.unpublishedPremiumSalons.premiumDisabledRs,
		notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2b,
		notino.data?.unpublishedPremiumSalons.premiumEnabledRsB2c,
		t
	])

	useEffect(() => {
		dispatch(
			getReservationStats({
				countryCode: selectedCountry,
				year: monthReservationsStatsDate.year(),
				month: monthReservationsStatsDate.month() + 1
			})
		)
		dispatch(getNotinoDashboard(selectedCountry))
		// months are indexed from 0 and API has indexed months from 1
		dispatch(getSalonsMonthStats(monthStatsDate.year(), monthStatsDate.month() + 1, selectedCountry))
		dispatch(getSalonsAnnualStats(annualStatsDate.year(), selectedCountry))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, selectedCountry])

	const annualStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsAnnualStats.data, salonsAnnualStats.isLoading, salonsAnnualStats.isFailure, annualStatsDate)
	}, [salonsAnnualStats, annualStatsDate])

	const monthStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsMonthStats.data, salonsMonthStats.isLoading, salonsMonthStats.isFailure, monthStatsDate)
	}, [salonsMonthStats, monthStatsDate])

	const reservationsMonthStats: TimeStats = useMemo(() => {
		return transformToReservationsStatsData(reservationsStats.data, reservationsStats.isLoading, reservationsStats.isFailure, monthReservationsStatsDate)
	}, [reservationsStats.data, reservationsStats.isLoading, reservationsStats.isFailure, monthReservationsStatsDate])

	const dashboardData: DashboardData = useMemo(() => {
		const emptyGraphData = {
			premiumVsBasic: [],
			salonStates: [],
			noSalons: true
		}

		if (notino.data) {
			const ranges = getFilterRanges()

			const alertData: AlertData[] = [
				{
					label: <>{t('loc:Salóny čakajúce na schválenie')}</>,
					count: notino.data.pendingSalons,
					onClick: () => navigate(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION])
				},
				{
					label: <>{t('loc:BASIC salóny, systémom omylom navrhnuté na spárovanie')}</>,
					count: notino.data.suggestionIncidents,
					onClick: () => navigate(FILTER_PATHS().SALONS.rejectedSuggestions)
				},
				{
					label: (
						<span>
							{`${t('loc:Zmeny v salónoch za')} `}
							<strong>{t('loc:24 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.oneDayAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[0].from, ranges[0].to).SALONS.changesOverPeriod) // 24h ago
				},
				{
					label: (
						<span>
							{`${t('loc:Zmeny v salónoch za')} `}
							<strong>{t('loc:48 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.twoDaysAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[1].from, ranges[1].to).SALONS.changesOverPeriod) // 48h ago
				},
				{
					label: (
						<span>
							{`${t('loc:Zmeny v salónoch za')} `}
							<strong>{t('loc:týždeň')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.sevenDaysAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[2].from, ranges[2].to).SALONS.changesOverPeriod) // week ago
				}
			]

			const graphProperties = ['basicSalons', 'nonBasicSalons', 'declinedSalons', 'pendingSalons', 'unpublishedSalons']
			type GraphProps = Pick<INotinoDashboard, 'basicSalons' | 'nonBasicSalons' | 'declinedSalons' | 'pendingSalons' | 'unpublishedSalons'>
			let sum = 0

			graphProperties.forEach((property: string) => {
				sum += notino.data ? notino.data[property as keyof GraphProps] : 0
			})
			if (sum === 0) {
				return {
					alertData,
					graphData: emptyGraphData
				}
			}

			// colors are defined in tailwind.config -> colors -> status
			const graphData = {
				premiumVsBasic: [
					{
						data: notino.data.basicSalons,
						background: colors.blue[200],
						onClick: () => navigate(FILTER_PATHS().SALONS.publishedBasics),
						label: t('loc:BASIC salóny')
					},
					{
						data: notino.data.nonBasicSalons,
						background: colors.blue[700],
						onClick: () => navigate(FILTER_PATHS().SALONS.publishedPremiums),
						label: t('loc:PREMIUM salóny')
					}
				],
				salonStates: [
					{
						data: notino.data.declinedSalons,
						background: colors.red[200],
						onClick: () => navigate(FILTER_PATHS().SALONS[SALON_FILTER_STATES.DECLINED]),
						label: t('loc:Zamietnuté')
					},
					{
						data: notino.data.pendingSalons,
						background: colors.yellow[400],
						onClick: () => navigate(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION]),
						label: t('loc:Na schválenie')
					},
					{
						data: notino.data.unpublishedSalons,
						background: colors.neutral[200],
						onClick: () => navigate(FILTER_PATHS().SALONS[SALON_FILTER_STATES.NOT_PUBLISHED]),
						label: t('loc:Nepublikované')
					},
					{
						data: notino.data.publishedSalons,
						background: colors.green[200],
						onClick: () => navigate(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PUBLISHED]),
						label: t('loc:Všetky publikované')
					}
				]
			}

			return {
				alertData,
				graphData
			}
		}

		return {
			alertData: [],
			graphData: emptyGraphData
		} as DashboardData
	}, [notino, t, navigate])

	const timeStatsFilter = (handleChange: (date: Dayjs | null, dateString: string) => void, dateFormat?: string, id?: string) => (
		<DatePicker
			id={id}
			onChange={(date, dateString) => handleChange(date, dateString)}
			picker={dateFormat ? 'month' : 'year'}
			size={'middle'}
			defaultValue={now}
			allowClear={false}
			format={dateFormat}
			disabledDate={(date) => dayjs(date).year() < 2022}
			dropdownAlign={{ points: ['tr', 'br'] }}
			getPopupContainer={(node) => node.parentElement || document.body}
		/>
	)
	const onTabChange = (selectedTabKey: string) => {
		setTabKey(selectedTabKey as DASHBOARD_TAB_KEYS)
	}
	const salonDashboard = (
		<SalonDashboard>
			<Spin spinning={notino?.isLoading || !notino.data} wrapperClassName='dashboard-loading'>
				<div className='content-body dashboard-content'>
					<div className='dashboard-grid'>
						{dashboardData.alertData.map((item: AlertData, index: number) => {
							return <Statistics key={`statistics_item_${index}`} title={item.label} count={item.count} onActionItemClick={item.onClick} />
						})}
					</div>

					{dashboardData.graphData.noSalons ? (
						// fallback
						<div className='flex add-button justify-center items-center mt-16'>
							<div className='m-auto text-center'>
								<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
								<Button onClick={() => navigate(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
									{STRINGS(t).addRecord(t('loc:salón'))}
								</Button>
							</div>
						</div>
					) : (
						<>
							{/* dougnut graphs */}
							<Row className='mt-12 gap-4'>
								{doughnutContent(t('loc:Publikované salóny - Premium vs. Basic'), dashboardData.graphData.premiumVsBasic)}
								{doughnutContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates, true)}
							</Row>
							{/* line graphs */}
							{lineContent(
								t('loc:Vývoj salónov - mesačný'),
								monthStats,
								timeStatsFilter(
									(date) => {
										if (date) {
											setMonthStatsDate(date)
											dispatch(getSalonsMonthStats(Number(date.year()), Number(date.month() + 1)))
										}
									},
									'MMMM - YYYY',
									SALON_STATS_MONTHLY_ID
								),
								salonColumns(monthStats.data?.labels, monthStats.data?.breakIndex)
							)}
							{lineContent(
								t('loc:Vývoj salónov - ročný'),
								annualStats,
								timeStatsFilter(
									(date, dateString) => {
										if (date) {
											setAnnualStatsDate(date)
										}
										dispatch(getSalonsAnnualStats(Number(dateString)))
									},
									undefined,
									SALON_STATS_ANNUAL_ID
								),
								salonColumns(annualStats.data?.labels, annualStats.data?.breakIndex)
							)}
						</>
					)}
				</div>
			</Spin>
		</SalonDashboard>
	)
	const reservationsDashboard = (
		<ReservationsDashboard>
			{/* // RS stats */}
			<Row className={'gap-4'}>
				{barContent(publishedPremiumSalonsData)}
				{barContent(unpublishedPremiumSalonsData)}
			</Row>
			{/* Reservations stats */}
			{lineContent(
				t('loc:Vývoj rezervácií - mesačný'),
				reservationsMonthStats,
				timeStatsFilter((date) => {
					if (date) {
						setMonthReservationsStatsDate(date)
						dispatch(
							getReservationStats({
								year: Number(date.year()),
								month: Number(date.month() + 1),
								countryCode: selectedCountry
							})
						)
					}
				}, 'MMMM - YYYY'),
				reservationsColumns(reservationsMonthStats.data?.labels, reservationsMonthStats.data?.breakIndex)
			)}
		</ReservationsDashboard>
	)
	// if salon is not selected, show global (Notino) dashboard content
	return !selectedSalon.data ? (
		<TabsComponent
			className={'box-tab'}
			activeKey={tabKey}
			onChange={onTabChange}
			items={[
				{
					key: DASHBOARD_TAB_KEYS.SALONS_STATE,
					label: t('loc:Stav salónov'),
					children: salonDashboard
				},
				{
					key: DASHBOARD_TAB_KEYS.RESERVATION_SYSTEM,
					label: t('loc:Rezervačný systém'),
					children: reservationsDashboard
				}
			]}
		/>
	) : (
		<>{salonDashboard}</>
	)
}

export default NotinoDashboard
