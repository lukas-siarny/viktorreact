import React, { FC, useMemo, useEffect } from 'react'
import { Spin, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import colors from 'tailwindcss/colors'

// components
import SalonDashboard from './SalonDashboard'

// redux
import { RootState } from '../../../reducers'
import { getNotinoDashboard } from '../../../reducers/dashboard/dashboardActions'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// utils
import { FILTER_PATHS, SALON_FILTER_STATES, SALON_CREATE_TYPES } from '../../../utils/enums'
import { history } from '../../../utils/history'

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
		<Col span={11} className='shadow-notino py-4 px-6 h-60'>
			<div className='heading-3'>{label}</div>
			{source && (
				<div className='flex flex-wrap justify-between w-full'>
					<div className='h-44 w-52 flex items-center'>
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
					<div className='h-auto w-52 flex items-center'>
						<div className='w-full'>
							{source.map((item: any) => (
								<Row justify={'space-between'} className='w-full h-6 cursor-pointer mb-4' onClick={item.onClick}>
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

const NotinoDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { notino } = useSelector((state: RootState) => state.dashboard)

	useEffect(() => {
		dispatch(getNotinoDashboard())
	}, [dispatch])

	const dashboardData: DashboardData = useMemo(() => {
		if (notino.data) {
			const alertData: AlertData[] = [
				{
					label: t('loc:Salóny čakajúce na schválenie'),
					count: notino.data.pendingSalons,
					onClick: () => history.push(FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION])
				},
				{
					label: t('loc:BASIC salóny, systémom omylom navrhnuté na spárovanie'),
					count: notino.data.suggestionIncidents,
					onClick: () => history.push(t('paths:salons')) // TODO
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:24 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdateOneDayAgo,
					onClick: () => history.push(t('paths:salons')) // TODO 24h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:48 hodín')}</strong>
						</span>
					),
					count: notino.data.lastUpdateTwoDaysAgo,
					onClick: () => history.push(t('paths:salons')) // TODO 48h ago
				},
				{
					label: (
						<span>
							{t('loc:Zmeny v publikovaných salónoch za ')}
							<strong>{t('loc:týždeň')}</strong>
						</span>
					),
					count: notino.data.lastUpdateSevenDaysAgo,
					onClick: () => history.push(t('paths:salons')) // TODO week ago
				}
			]

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
			graphData: {
				premiumVsBasic: [],
				salonStates: []
			}
		} as DashboardData
	}, [notino, t])

	// if salon is not selected, show global (Notino) dashboard content
	return (
		<SalonDashboard>
			<div className='content-body medium'>
				<Spin spinning={notino?.isLoading}>
					<div className='flex flex-wrap justify-between w-full'>
						{dashboardData.alertData.map((item: AlertData, index: number) => (
							<button
								type='button'
								className='cursor-pointer shadow-notino h-52 w-48 ml-4 relative grid place-items-center text-center bg-notino-white border-0'
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

					<Row justify={'space-between'} className='mt-8 ml-4'>
						{graphContent(t('loc:Premium vs. Basic salóny'), dashboardData.graphData.premiumVsBasic)}
						{graphContent(t('loc:Stav salónov'), dashboardData.graphData.salonStates)}
					</Row>
				</Spin>
			</div>
		</SalonDashboard>
	)
}

export default NotinoDashboard
