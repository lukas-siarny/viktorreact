/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FC, useMemo, useEffect } from 'react'
import { Spin, Row, Col, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import dayjs from 'dayjs'
import { Doughnut } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'
import cx from 'classnames'

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
		<div className='stastics-box stastics-box-wide py-4 px-6 md:py-8 md:px-12'>
			<div className='heading-3 mb-4'>{label}</div>
			{source && (
				<div className='flex flex-wrap justify-between w-full'>
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
			<Spin spinning={notino?.isLoading || !notino.data} wrapperClassName='dashboard-loading'>
				<div className='content-body dashboard-content pt-20'>
					<div className='dashboard-grid'>
						{dashboardData.alertData.map((item: AlertData, index: number) => {
							const isCountMoreThan5Digits = (item.count || 0) > 9999

							return (
								<button type='button' className='grid-item stastics-box flex flex-col p-0 cursor-pointer' key={`alert_item_${index}`} onClick={item.onClick}>
									<div className='flex-1 flex flex-col items-center w-full px-4'>
										<div className='w-20 h-20 rounded-full flex justify-center items-center bg-yellow-200 mt-8'>
											<span className={cx({ 'heading-3': !isCountMoreThan5Digits, 'heading-4': isCountMoreThan5Digits })}>{item.count}</span>
										</div>
										<span className='s-semibold pt-4 text-sm grid-item-label'>{item.label}</span>
									</div>
									<div className='flex justify-between items-center w-full h-12 bg-yellow-200 mt-4 px-4'>
										<span className='heading-5 font-bold'>{t('loc:Zobraziť')}</span>
										<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
									</div>
								</button>
							)
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
						<Row className='mt-12 gap-4'>
							{graphContent(t('loc:Premium vs. Basic salóny'), dashboardData.graphData.premiumVsBasic)}
							{graphContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates)}
						</Row>
					)}
				</div>
			</Spin>
		</SalonDashboard>
	)
}

export default NotinoDashboard
