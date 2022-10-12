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

// components
import SalonDashboard from './SalonDashboard'
import Statistics from '../../../components/Dashboards/Statistics'
import CustomTable from '../../../components/CustomTable'

// types
import { Columns, AlertData, DashboardData, TimeStats, TimeStatsData } from '../../../types/interfaces'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard, INotinoDashboard, getSalonsAnnualStats, getSalonsMonthStats, ISalonsTimeStats } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import {
	FILTER_PATHS,
	SALON_FILTER_STATES,
	SALON_CREATE_TYPES,
	DEFAULT_DATE_TIME_OPTIONS,
	DATE_TIME_RANGE,
	DEFAULT_DATE_INIT_FORMAT,
	SALONS_TIME_STATS_TYPE,
	TIME_STATS_SOURCE_TYPE
} from '../../../utils/enums'
import { history } from '../../../utils/history'
import { getSalonFilterRanges } from '../../../utils/helper'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin)

const now = dayjs()

const doughnutOptions = (clickHandlers: any[]) => {
	return {
		responsive: true,
		aspectRatio: 1.5,
		cutout: '60%',
		plugins: {
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
		onClick(_event: any, elements: any) {
			const { index } = elements[0]
			clickHandlers[index].onClick()
		},
		onHover: (event: any, activeEvents: any[]) => {
			// eslint-disable-next-line no-param-reassign
			;(event?.native?.target as HTMLElement).style.cursor = activeEvents?.length > 0 ? 'pointer' : 'auto'
		}
	} as any
}

const lineOptions = (annotationIndex?: number) => ({
	plugins: {
		legend: {
			display: false
		},
		annotation: {
			annotations: [
				{
					type: 'line',
					xMin: annotationIndex,
					xMax: annotationIndex,
					borderColor: '#DC0069',
					borderWidth: 1.5,
					borderDash: [2, 4],
					display: !!annotationIndex
				}
			]
		}
	},
	responsive: true,
	scales: {
		x: {
			grid: {
				display: false,
				borderColor: colors.neutral[500],
				borderWidth: 2
			},
			ticks: {
				color: colors.black,
				font: {
					family: 'Public Sans'
				}
			}
		},
		y: {
			grid: {
				borderDash: [2, 4],
				color: colors.neutral[200],
				borderColor: colors.neutral[500],
				borderWidth: 2
			},
			ticks: {
				color: colors.black,
				font: {
					family: 'Public Sans'
				},
				precision: 0
			},
			min: 0
		}
	},
	maintainAspectRatio: false
})

const columns = (labels: string[] = [], futureBreak = 0): Columns => [
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

const doughnutContent = (label: string, source?: any[]) => {
	return (
		<div className='stastics-box py-4 px-6 md:py-8 md:px-12 statistics-box-wide'>
			<div className='flex flex-wrap justify-between w-full'>
				<h4>{label}</h4>
			</div>
			{source && (
				<div className='flex flex-wrap justify-between w-full mt-4'>
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
					<div className='flex flex-1 items-center right-side'>
						<div className='w-full flex flex-col gap-4'>
							{source.map((item: any, index: number) => (
								<div key={index} className='flex items-center w-full h-6 cursor-pointer' onClick={item.onClick}>
									<div className={'flex flex-1 items-center'}>
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

const getFilterRanges = () => {
	// get dateTime range for every option: DATE_TIME_RANGE.LAST_DAY, DATE_TIME_RANGE.LAST_TWO_DAYS, DATE_TIME_RANGE.LAST_WEEK
	const ranges = getSalonFilterRanges()

	/**
	 * Access to DayJS objects by property 'name' defined in IDateTimeFilterOption
	 * every value has array with 2 items of DayJS objects, where:
	 * 	- at index 0 is FROM
	 * 	- at index 1 is TO
	 * Then set DayJS ranges (from - to) as follow:
	 * index 0 - LAST_DAY
	 * index 1 - LAST_TWO_DAYS
	 * index 2 - LAST_WEEK
	 */

	return [
		{
			from: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_DAY].name][0]).format(DEFAULT_DATE_INIT_FORMAT),
			to: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_DAY].name][1]).format(DEFAULT_DATE_INIT_FORMAT)
		},
		{
			from: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_TWO_DAYS].name][0]).format(DEFAULT_DATE_INIT_FORMAT),
			to: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_TWO_DAYS].name][1]).format(DEFAULT_DATE_INIT_FORMAT)
		},
		{
			from: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_WEEK].name][0]).format(DEFAULT_DATE_INIT_FORMAT),
			to: dayjs(ranges[DEFAULT_DATE_TIME_OPTIONS()[DATE_TIME_RANGE.LAST_WEEK].name][1]).format(DEFAULT_DATE_INIT_FORMAT)
		}
	]
}

const transformToStatsData = (source: ISalonsTimeStats | null, isLoading: boolean, isFailure: boolean, selectedDate: Dayjs): TimeStats => {
	if (isLoading) {
		return {
			isFailure: false,
			isLoading: true,
			data: null
		}
	}

	if (isFailure) {
		return {
			isFailure: true,
			isLoading: false,
			data: null
		}
	}

	const result: TimeStatsData = {
		labels: [],
		datasets: [
			// BASIC
			{
				data: [],
				backgroundColor: colors.blue[200],
				borderColor: colors.blue[200],
				pointRadius: 1
			},
			// PENDING
			{
				data: [],
				backgroundColor: colors.yellow[400],
				borderColor: colors.yellow[400],
				pointRadius: 1
			},
			// PREMIUM
			{
				data: [],
				backgroundColor: colors.blue[700],
				borderColor: colors.blue[700],
				pointRadius: 1
			}
		],
		columns: [
			{
				type: SALONS_TIME_STATS_TYPE.BASIC,
				summary: 0
			},
			{
				type: SALONS_TIME_STATS_TYPE.PENDING,
				summary: 0
			},
			{
				type: SALONS_TIME_STATS_TYPE.PREMIUM,
				summary: 0
			}
		],
		breakIndex: 100
	}

	if (source && source?.ranges) {
		const months: string[] = dayjs.monthsShort()

		Object.entries(source.ranges).forEach(([key, value]) => {
			result.datasets[0].data.push(value.newBasicSalons)
			result.datasets[1].data.push(value.nonBasicPendingPublicationSalons)
			result.datasets[2].data.push(value.nonBasicApprovedSalons)
			// days and months as result from API are indexed from 1 instead of 0
			const prop = Number(key) - 1
			// Annual stats have labels Jan, Feb, ... and month stats have 1. 2. 3. ...
			result.labels.push(source.type === TIME_STATS_SOURCE_TYPE.YEAR ? months[prop] : `${key}.`)

			result.columns[0] = {
				...result.columns[0],
				[prop]: value.newBasicSalons,
				summary: result.columns[0].summary + value.newBasicSalons
			}
			result.columns[1] = {
				...result.columns[1],
				[prop]: value.nonBasicPendingPublicationSalons,
				summary: result.columns[1].summary + value.nonBasicPendingPublicationSalons
			}
			result.columns[2] = {
				...result.columns[2],
				[prop]: value.nonBasicApprovedSalons,
				summary: result.columns[2].summary + value.nonBasicApprovedSalons
			}
		})
	}

	const currYear = now.year()
	const currMonth = now.month()
	const currDay = now.date()

	if (currYear === selectedDate.year()) {
		if (currMonth <= selectedDate.month()) {
			// NOTE: 0.5 is delta for displaying divider between columns
			if (source?.type === TIME_STATS_SOURCE_TYPE.YEAR) {
				result.breakIndex = currMonth + 0.5
			} else if (currMonth === selectedDate.month()) {
				result.breakIndex = currDay - 0.5
			} else {
				result.breakIndex = 0
			}
		}
	} else if (currYear < selectedDate.year()) {
		result.breakIndex = 0
	}

	return {
		isFailure: false,
		isLoading: false,
		data: result
	}
}

const NotinoDashboard: FC = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [annualStatsDate, setAnnualStatsDate] = useState<Dayjs>(now)
	const [monthStatsDate, setMonthStatsDate] = useState<Dayjs>(now)
	const { notino, salonsAnnualStats, salonsMonthStats } = useSelector((state: RootState) => state.dashboard)

	useEffect(() => {
		dispatch(getNotinoDashboard())
		// months are indexed from 0 and API has indexed months from 1
		dispatch(getSalonsMonthStats(now.year(), now.month() + 1))
		dispatch(getSalonsAnnualStats(now.year()))
	}, [dispatch])

	const annualStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsAnnualStats.data, salonsAnnualStats.isLoading, salonsAnnualStats.isFailure, annualStatsDate)
	}, [salonsAnnualStats, annualStatsDate])

	const monthStats: TimeStats = useMemo(() => {
		return transformToStatsData(salonsMonthStats.data, salonsMonthStats.isLoading, salonsMonthStats.isFailure, monthStatsDate)
	}, [salonsMonthStats, monthStatsDate])

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
					label: t('loc:Salóny čakajúce na schválenie'),
					count: notino.data.pendingSalons,
					onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION])
				},
				{
					label: t('loc:BASIC salóny, systémom omylom navrhnuté na spárovanie'),
					count: notino.data.suggestionIncidents,
					onClick: () => history.push(FILTER_PATHS().SALONS.rejectedSuggestions)
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:24 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.oneDayAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[0].from, ranges[0].to).SALONS.publishedChanges) // 24h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:48 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.twoDaysAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[1].from, ranges[1].to).SALONS.publishedChanges) // 48h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:týždeň')}</strong>
						</span>
					),
					count: notino.data.lastUpdated?.sevenDaysAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[2].from, ranges[2].to).SALONS.publishedChanges) // week ago
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
						onClick: () => history.push(FILTER_PATHS().SALONS[SALON_CREATE_TYPES.BASIC]),
						label: t('loc:BASIC salóny')
					},
					{
						data: notino.data.nonBasicSalons,
						background: colors.blue[700],
						onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PREMIUM]),
						label: t('loc:PREMIUM salóny')
					}
				],
				salonStates: [
					{
						data: notino.data.declinedSalons,
						background: colors.red[200],
						onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.DECLINED]),
						label: t('loc:Zamietnuté')
					},
					{
						data: notino.data.pendingSalons,
						background: colors.yellow[400],
						onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION]),
						label: t('loc:Na schválenie')
					},
					{
						data: notino.data.unpublishedSalons,
						background: colors.neutral[200],
						onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.NOT_PUBLISHED]),
						label: t('loc:Nepublikované')
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
		/>
	)

	// if salon is not selected, show global (Notino) dashboard content
	return (
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
								<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
									{t('loc:Pridať salón')}
								</Button>
							</div>
						</div>
					) : (
						<>
							{/* dougnut graphs */}
							<Row className='mt-12 gap-4'>
								{doughnutContent(t('loc:Premium vs. Basic salóny'), dashboardData.graphData.premiumVsBasic)}
								{doughnutContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates)}
							</Row>
							{/* line graphs */}
							{lineContent(
								t('loc:Vývoj salónov - mesačný'),
								monthStats,
								timeStatsFilter((date) => {
									if (date) {
										setMonthStatsDate(date)
										dispatch(getSalonsMonthStats(Number(date.year()), Number(date.month() + 1)))
									}
								}, 'MMMM - YYYY')
							)}
							{lineContent(
								t('loc:Vývoj salónov - ročný'),
								annualStats,
								timeStatsFilter((date, dateString) => {
									if (date) {
										setAnnualStatsDate(date)
									}
									dispatch(getSalonsAnnualStats(Number(dateString)))
								})
							)}
						</>
					)}
				</div>
			</Spin>
		</SalonDashboard>
	)
}

export default NotinoDashboard
