import React, { FC, useMemo, useEffect } from 'react'
import { Spin, Row, Col, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import dayjs from 'dayjs'
import { Doughnut } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'

// components
import SalonDashboard from './SalonDashboard'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard, INotinoDashboard } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import { FILTER_PATHS, SALON_FILTER_STATES, SALON_CREATE_TYPES, DEFAULT_DATE_TIME_OPTIONS, DATE_TIME_RANGE, DEFAULT_DATE_INIT_FORMAT } from '../../../utils/enums'
import { history } from '../../../utils/history'
import { getSalonFilterRanges } from '../../../utils/helper'

ChartJS.register(ArcElement, Tooltip, Legend)

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

const graphContent = (label: string, source?: any[]) => {
	return (
		<Col xl={11} xs={24} className='shadow-notino py-4 px-6 h-60'>
			<div className='heading-3'>{label}</div>
			{source && (
				<div className='flex flex-wrap justify-between w-full h-full'>
					<div className='h-44 w-2/5 3xl:w-12/25 flex items-center'>
						<Doughnut
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
					<div className='h-auto w-3/5 3xl:w-1/2 flex items-center'>
						<div className='w-full'>
							{source.map((item: any, index: number) => (
								<Row justify={'space-between'} key={index} className='w-full h-6 cursor-pointer mb-4' onClick={item.onClick}>
									<Col span={3}>
										<div className='h-6 w-6 rounded-full' style={{ backgroundColor: item.background }} />
									</Col>
									<Col span={6} className='flex items-center justify-center'>
										<span className='base-semibold'>{item.data}</span>
									</Col>
									<Col span={12} className='flex items-center'>
										<span className='s-semibold'>{item.label}</span>
									</Col>
									<Col span={3} className='flex items-center text-right'>
										<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
									</Col>
								</Row>
							))}
						</div>
					</div>
				</div>
			)}
		</Col>
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

const NotinoDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { notino } = useSelector((state: RootState) => state.dashboard)

	useEffect(() => {
		dispatch(getNotinoDashboard())
	}, [dispatch])

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
					count: notino.data.lastUpdateOneDayAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[0].from, ranges[0].to).SALONS.publishedChanges) // 24h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:48 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdateTwoDaysAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[1].from, ranges[1].to).SALONS.publishedChanges) // 48h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:týždeň')}</strong>
						</span>
					),
					count: notino.data.lastUpdateSevenDaysAgo,
					onClick: () => history.push(FILTER_PATHS(ranges[2].from, ranges[2].to).SALONS.publishedChanges) // week ago
				}
			]

			const graphProperties = ['basicSalons', 'nonBasicSalons', 'declinedSalons', 'pendingSalons', 'unpublishedSalons']
			let sum = 0

			graphProperties.forEach((property: string) => {
				sum += notino.data ? notino.data[property as keyof INotinoDashboard] : 0
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
						background: colors.trueGray[200],
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

	// if salon is not selected, show global (Notino) dashboard content
	return (
		<SalonDashboard>
			<div className='content-body medium'>
				<Spin spinning={notino?.isLoading || !notino.data}>
					<div className='flex flex-wrap justify-between w-full pr-4'>
						{dashboardData.alertData.map((item: AlertData, index: number) => (
							<button
								type='button'
								className='cursor-pointer shadow-notino h-52 w-48 ml-4 mb-4 relative grid place-items-center text-center bg-notino-white border-0'
								key={`alert_item_${index}`}
								onClick={item.onClick}
							>
								<div className='w-16 h-16 rounded-full flex justify-center items-center bg-yellow-200 absolute top-8'>
									<span className='heading-3'>{item.count}</span>
								</div>
								<span className='s-semibold absolute top-24 pt-4 px-2'>{item.label}</span>
								<div className='flex justify-around items-center absolute bottom-0 w-full h-12 bg-yellow-200'>
									<span className='heading-4'>{t('loc:Zobraziť')}</span>
									<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
								</div>
							</button>
						))}
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
						<Row justify={'space-between'} className='mt-8 mx-4 flex-wrap'>
							{graphContent(t('loc:Premium vs. Basic salóny'), dashboardData.graphData.premiumVsBasic)}
							{graphContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates)}
						</Row>
					)}
				</Spin>
			</div>
		</SalonDashboard>
	)
}

export default NotinoDashboard