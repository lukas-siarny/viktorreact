/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useMemo, useEffect } from 'react'
import { Spin, Row, Button, DatePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import dayjs from 'dayjs'
import { Doughnut, Line } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'

// components
import SalonDashboard from './SalonDashboard'
import Statistics from '../../../components/Dashboards/Statistics'
import CustomTable from '../../../components/CustomTable'

// types
import { Columns } from '../../../types/interfaces'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard, INotinoDashboard, getSalonsAnnualStats, getSalonsMonthStats, ISalonsTimeStats } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import { FILTER_PATHS, SALON_FILTER_STATES, SALON_CREATE_TYPES, DEFAULT_DATE_TIME_OPTIONS, DATE_TIME_RANGE, DEFAULT_DATE_INIT_FORMAT } from '../../../utils/enums'
import { history } from '../../../utils/history'
import { getSalonFilterRanges } from '../../../utils/helper'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Props = {}

interface AlertData {
	label: React.ReactElement
	count: number
	onClick: (...args: any) => any
}

interface DashboardData {
	alertData: AlertData[]
	graphData: {
		premiumVsBasic: any[]
		salonStates: any[]
		noSalons?: boolean
	}
}

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
					color: '#000',
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

const lineOptions = {
	plugins: {
		legend: {
			display: false
		}
	},
	responsive: true,
	scales: {
		x: {
			grid: {
				display: false,
				borderColor: '#868686',
				borderWidth: 2
			},
			ticks: {
				color: '#000',
				font: {
					family: 'Public Sans'
				}
			}
		},
		y: {
			grid: {
				borderDash: [2, 4],
				color: '#DFDFDF',
				borderColor: '#868686',
				borderWidth: 2
			},
			ticks: {
				color: '#000',
				font: {
					family: 'Public Sans'
				}
			}
		}
	},
	maintainAspectRatio: false
}

const monthLabels: string[] = dayjs.monthsShort()

const data1 = monthLabels.map(() => Math.floor(Math.random() * 100))
const data2 = monthLabels.map(() => Math.floor(Math.random() * 100))
const data3 = monthLabels.map(() => Math.floor(Math.random() * 100))

const tableSeed = monthLabels.map((label: string, index: number) => {
	return {
		key: index,
		dataIndex: index,
		title: <span className='xs-semibold'>{label}</span>,
		render: (value: number) => <span className='xs-regular'>{value}</span>
	}
})

const columns: Columns = [
	{
		key: 'type',
		dataIndex: 'type',
		render: (value) => {
			switch (value) {
				case 'basic':
					return (
						<div className={'flex flex-1 items-center'}>
							<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[200] }} />
							<span className='xs-bold'>{i18next.t('loc:BASIC')}</span>
						</div>
					)
				case 'premium':
					return (
						<div className={'flex flex-1 items-center'}>
							<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.blue[700] }} />
							<span className='xs-bold'>{i18next.t('loc:Schválené PREMIUM')}</span>
						</div>
					)
				case 'pending':
				default:
					return (
						<div className={'flex flex-1 items-center'}>
							<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: colors.yellow[400] }} />
							<span className='xs-bold'>{i18next.t('loc:Žiadosti o PREMIUM')}</span>
						</div>
					)
			}
		}
	},
	...tableSeed,
	{
		key: 'summary',
		dataIndex: 'summary',
		title: () => <span className='xs-semibold'>{i18next.t('loc:Súčet')}</span>,
		render: (value) => <span className='xs-regular'>{value}</span>
	}
]

const tableData = [
	{
		type: 'basic',
		0: 14,
		1: 23,
		2: 25,
		3: 41,
		4: 53,
		5: 55,
		6: 74,
		7: 66,
		8: 68,
		9: 75,
		10: 81,
		11: 87,
		summary: 58984
	},
	{
		type: 'pending',
		0: 3,
		1: 8,
		2: 19,
		3: 33,
		4: 42,
		5: 55,
		6: 58,
		7: 60,
		8: 23,
		9: 20,
		10: 4,
		11: 2,
		summary: 8647
	},
	{
		type: 'premium',
		0: 14,
		1: 20,
		2: 35,
		3: 11,
		4: 43,
		5: 45,
		6: 24,
		7: 36,
		8: 62,
		9: 50,
		10: 92,
		11: 7,
		summary: 45666
	}
]

const doughnutContent = (label: string, source?: any[], filter?: React.ReactNode | JSX.Element, className?: string) => {
	return (
		<div className={`stastics-box py-4 px-6 md:py-8 md:px-12 ${className}`}>
			<div className='flex flex-wrap justify-between w-full'>
				<h4>{label}</h4>
				{filter}
			</div>
			{/* <div className='heading-3 mb-4'>{label}</div> */}
			{source &&
				(filter ? (
					<div className='mt-4'>
						<div className='h-40' style={{ height: '160px' }}>
							<Line
								options={lineOptions}
								data={{
									labels: monthLabels,
									datasets: [
										{
											data: data1,
											backgroundColor: colors.blue[200],
											borderColor: colors.blue[200],
											pointRadius: 1
										},
										{
											data: data2,
											backgroundColor: colors.yellow[400],
											borderColor: colors.yellow[400],
											pointRadius: 1
										},
										{
											data: data3,
											backgroundColor: colors.blue[700],
											borderColor: colors.blue[700],
											pointRadius: 1
										}
									]
								}}
							/>
						</div>
						<CustomTable className='mt-8' columns={columns} twoToneRows pagination={false} dataSource={tableData} rowKey={(record) => record.type} />
					</div>
				) : (
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
				))}
		</div>
	)
}

const lineContent = (label: string, source: any[], filter: React.ReactNode | JSX.Element, className?: string) => {}

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

const now = dayjs()

const NotinoDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { notino, salonsAnnualStats, salonsMonthStats } = useSelector((state: RootState) => state.dashboard)
	console.log('🚀 ~ file: NotinoDashboard.tsx ~ line 342 ~ salonsMonthStats', salonsMonthStats)
	console.log('🚀 ~ file: NotinoDashboard.tsx ~ line 342 ~ salonsAnnualStats', salonsAnnualStats)

	useEffect(() => {
		dispatch(getNotinoDashboard())
		// months are indexed from 0 and API has indexed months from 1
		dispatch(getSalonsMonthStats(now.year(), now.month() + 1))
		dispatch(getSalonsAnnualStats(now.year()))
	}, [dispatch])

	const transformToStatsData = (source: ISalonsTimeStats | null) => {
		const result = {
			labels: [] as string[],
			datasets: [
				// BASIC
				{
					data: [] as number[],
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
					type: 'basic',
					summary: 0
				},
				{
					type: 'pending',
					summary: 0
				},
				{
					type: 'premium',
					summary: 0
				}
			]
		}

		if (source && source?.ranges) {
			const months: string[] = dayjs.monthsShort()

			Object.entries(source.ranges).forEach(([key, value]) => {
				console.log('🚀 ~ file: NotinoDashboard.tsx ~ line 410 ~ Object.entries ~ key, value', key, value)
				result.datasets[0].data.push(value.newBasicSalons)
				result.datasets[1].data.push(value.nonBasicPendingPublicationSalons)
				result.datasets[2].data.push(value.nonBasicApprovedSalons)

				const prop = Number(key)

				result.labels.push(source.type === 'YEAR' ? months[prop - 1] : `${prop}.`)
				result.columns[0] = {
					...result.columns[0],
					[prop]: value.newBasicSalons
				}
				result.columns[1] = {
					...result.columns[1],
					[prop]: value.nonBasicPendingPublicationSalons
				}
				result.columns[2] = {
					...result.columns[2],
					[prop]: value.nonBasicApprovedSalons
				}
			})
		}

		console.log('🚀 ~ file: NotinoDashboard.tsx ~ line 425 ~ transformToStatsData ~ result', result)
		return result
	}

	const annualStats = useMemo(() => {
		return transformToStatsData(salonsAnnualStats.data)
	}, [salonsAnnualStats.data])

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
						data: notino.data.nonBasicSalons, // TODO blocked by NOT-1930
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
						background: colors.yellow[200],
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

	const monthFilter = (
		<DatePicker
			onChange={(date, dateString) => {
				console.log(date, dateString)
			}}
			picker='month'
			size='small'
			defaultValue={now}
			allowClear={false}
			format={'MMMM - YYYY'}
			disabledDate={(date) => dayjs(date).year() < 2022}
		/>
	)

	const yearFilter = (
		<DatePicker
			onChange={(date, dateString) => {
				console.log(date, dateString)
			}}
			picker='year'
			size='small'
			defaultValue={now}
			allowClear={false}
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
							<Row className='mt-12 gap-4'>
								{doughnutContent(t('loc:Premium vs. Basic salóny'), dashboardData.graphData.premiumVsBasic, undefined, 'stastics-box-wide')}
								{doughnutContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates, undefined, 'stastics-box-wide')}
							</Row>
							<div className='mt-12'>{doughnutContent(t('loc:Vývoj salónov - mesačný'), [], monthFilter)}</div>
							<div className='mt-12'>{doughnutContent(t('loc:Vývoj salónov - ročný'), [], yearFilter)}</div>
						</>
					)}
				</div>
			</Spin>
		</SalonDashboard>
	)
}

export default NotinoDashboard
