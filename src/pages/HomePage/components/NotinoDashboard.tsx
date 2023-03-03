/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useMemo, useEffect, useState } from 'react'
import { Spin, Row, Button, DatePicker, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import { Doughnut, Line } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import colors from 'tailwindcss/colors'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

// components
import SalonDashboard from './SalonDashboard'
import Statistics from '../../../components/Dashboards/Statistics'
import CustomTable from '../../../components/CustomTable'

// types
import { Columns, AlertData, DashboardData, TimeStats } from '../../../types/interfaces'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard, INotinoDashboard, getSalonsAnnualStats, getSalonsMonthStats, getRsStats } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import { DASHBOARD_TASB_KEYS, FILTER_PATHS, SALON_FILTER_STATES, SALONS_TIME_STATS_TYPE, TAB_KEYS } from '../../../utils/enums'
import { doughnutOptions, lineOptions, getFilterRanges, transformToStatsData, transformToRsStatsData } from './dashboardUtils'
import SalonHistory from '../../SalonsPage/components/SalonHistory'
import TabsComponent from '../../../components/TabsComponent'
import ReservationsDashboard from './ReservationsDashboard'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin)

const columns = (labels: string[] = [], futureBreak = 0): Columns => {
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
					<div className='flex flex-1 items-center right-side'>
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

const lineContent = (label: string, source: TimeStats, filter: React.ReactNode | JSX.Element) => {
	console.log('source lineContent', source)
	return (
		<div className='stastics-box py-4 px-6 md:py-8 md:px-12 mt-12'>
			<div className='flex flex-wrap justify-between w-full'>
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
					columns={columns(source.data?.labels, source?.data?.breakIndex)}
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

const now = dayjs()

const NotinoDashboard: FC = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [annualStatsDate, setAnnualStatsDate] = useState<Dayjs>(now)
	const [monthStatsDate, setMonthStatsDate] = useState<Dayjs>(now)
	const { notino, salonsAnnualStats, salonsMonthStats, rsStats } = useSelector((state: RootState) => state.dashboard)

	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)
	const navigate = useNavigate()
	const [tabKey, setTabKey] = useState<DASHBOARD_TASB_KEYS>(DASHBOARD_TASB_KEYS.RESERVATION_SYSTEM)

	useEffect(() => {
		dispatch(
			getRsStats({
				countryCode: selectedCountry,
				year: now.year(),
				month: 2 // TODO: dorobi month
			})
		)
		dispatch(getNotinoDashboard(selectedCountry))
		// months are indexed from 0 and API has indexed months from 1
		dispatch(getSalonsMonthStats(now.year(), now.month() + 1, selectedCountry))
		dispatch(getSalonsAnnualStats(now.year(), selectedCountry))
	}, [dispatch, selectedCountry])

	const annualStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsAnnualStats.data, salonsAnnualStats.isLoading, salonsAnnualStats.isFailure, annualStatsDate)
	}, [salonsAnnualStats, annualStatsDate])

	const monthStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsMonthStats.data, salonsMonthStats.isLoading, salonsMonthStats.isFailure, monthStatsDate)
	}, [salonsMonthStats, monthStatsDate])

	const rsMonthStats: TimeStats = useMemo(() => {
		return transformToRsStatsData(rsStats.data, rsStats.isLoading, rsStats.isFailure, monthStatsDate)
	}, [rsStats.data, rsStats.isLoading, rsStats.isFailure, monthStatsDate])

	console.log('rsMonthStats', rsMonthStats)
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
							{`${t('loc:Zmeny v publikovaných salónoch za')} `}
							<strong>{t('loc:24 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.oneDayAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[0].from, ranges[0].to).SALONS.publishedChanges) // 24h ago
				},
				{
					label: (
						<span>
							{`${t('loc:Zmeny v publikovaných salónoch za')} `}
							<strong>{t('loc:48 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.twoDaysAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[1].from, ranges[1].to).SALONS.publishedChanges) // 48h ago
				},
				{
					label: (
						<span>
							{`${t('loc:Zmeny v publikovaných salónoch za')} `}
							<strong>{t('loc:týždeň')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.sevenDaysAgo,
					onClick: () => navigate(FILTER_PATHS(ranges[2].from, ranges[2].to).SALONS.publishedChanges) // week ago
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
	}, [notino, t])

	const timeStatsFilter = (handleChange: (date: Dayjs | null, dateString: string) => void, dateFormat?: string) => (
		<DatePicker
			onChange={(date, dateString) => handleChange(date, dateString)}
			picker={dateFormat ? 'month' : 'year'}
			size='small'
			defaultValue={now}
			allowClear={false}
			format={dateFormat}
			disabledDate={(date) => dayjs(date).year() < 2022}
			getPopupContainer={(node) => node.parentElement || document.body}
		/>
	)
	const onTabChange = (selectedTabKey: string) => {
		// TODO: ukladat do query?
		// set query for history tab
		// const newQuery = {
		// 	...query,
		// 	history: selectedTabKey === TAB_KEYS.SALON_HISTORY
		// }
		// setQuery(newQuery)
		setTabKey(selectedTabKey as DASHBOARD_TASB_KEYS)
	}
	// if salon is not selected, show global (Notino) dashboard content
	return (
		<>
			<TabsComponent
				className={'box-tab'}
				activeKey={tabKey}
				onChange={onTabChange}
				items={[
					{
						key: DASHBOARD_TASB_KEYS.SALONS_STATE,
						label: <>{t('loc:Stav salónov')}</>,
						children: (
							<SalonDashboard>
								<Spin spinning={notino?.isLoading || !notino.data} wrapperClassName='dashboard-loading'>
									<div className='content-body dashboard-content pt-20'>
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
													<Button
														onClick={() => navigate(t('paths:salons/create'))}
														type='primary'
														htmlType='button'
														className={'noti-btn'}
														icon={<PlusIcon />}
													>
														{t('loc:Pridať salón')}
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
												{/* {lineContent( */}
												{/*	t('loc:Vývoj salónov - mesačný'), */}
												{/*	monthStats, */}
												{/*	timeStatsFilter((date) => { */}
												{/*		if (date) { */}
												{/*			setMonthStatsDate(date) */}
												{/*			dispatch(getSalonsMonthStats(Number(date.year()), Number(date.month() + 1))) */}
												{/*		} */}
												{/*	}, 'MMMM - YYYY') */}
												{/* )} */}
												{/* {lineContent( */}
												{/*	t('loc:Vývoj salónov - ročný'), */}
												{/*	annualStats, */}
												{/*	timeStatsFilter((date, dateString) => { */}
												{/*		if (date) { */}
												{/*			setAnnualStatsDate(date) */}
												{/*		} */}
												{/*		dispatch(getSalonsAnnualStats(Number(dateString))) */}
												{/*	}) */}
												{/* )} */}
											</>
										)}
									</div>
								</Spin>
							</SalonDashboard>
						)
					},
					{
						key: DASHBOARD_TASB_KEYS.RESERVATION_SYSTEM,
						label: <>{t('loc:Rezervačný systém')}</>,
						children: (
							<>
								<ReservationsDashboard />
								{lineContent(
									t('loc:Vývoj rezervácií - mesačný'),
									rsMonthStats,
									timeStatsFilter((date) => {
										if (date) {
											setMonthStatsDate(date)
											dispatch(
												getRsStats({
													year: Number(date.year()),
													month: Number(date.month() + 1)
												})
											)
										}
									}, 'MMMM - YYYY')
								)}
							</>
						)
					}
				]}
			/>
		</>
	)
}

export default NotinoDashboard
