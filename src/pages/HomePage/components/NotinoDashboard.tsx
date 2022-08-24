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
import { FILTER_PATHS, SALON_FILTER_STATES, SALON_CREATE_TYPES, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
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

const NotinoDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { notino } = useSelector((state: RootState) => state.dashboard)

	useEffect(() => {
		dispatch(getNotinoDashboard())
	}, [dispatch])

	const data: DashboardData = useMemo(() => {
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
						filterPath: FILTER_PATHS().SALONS[SALON_CREATE_TYPES.BASIC],
						label: t('loc:BASIC salóny')
					},
					{
						data: notino.data.nonBasicSalons, // TODO blocked by NOT-1930
						background: colors.blue[700],
						filterPath: FILTER_PATHS().SALONS[SALON_FILTER_STATES.PREMIUM],
						label: t('loc:PREMIUM salóny')
					}
				],
				salonStates: [
					{
						data: notino.data.declinedSalons,
						background: colors.red[200],
						filterPath: FILTER_PATHS().SALONS[SALON_FILTER_STATES.DECLINED],
						label: t('loc:Zamietnuté')
					},
					{
						data: notino.data.pendingSalons,
						background: colors.yellow[200],
						filterPath: FILTER_PATHS().SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION],
						label: t('loc:Na schválenie')
					},
					{
						data: notino.data.unpublishedSalons,
						background: colors.trueGray[200],
						filterPath: FILTER_PATHS().SALONS[SALON_FILTER_STATES.NOT_PUBLISHED],
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
			<div className='content-body'>
				<Spin spinning={notino?.isLoading}>
					<div className='flex flex-wrap'>
						{data.alertData.map((item: AlertData, index: number) => (
							<button
								type='button'
								className='cursor-pointer shadow-notino h-48 w-44 ml-4 relative grid place-items-center text-center bg-notino-white border-0'
								key={`alert_item_${index}`}
								onClick={item.onClick}
							>
								<div className='w-16 h-16 rounded-full flex justify-center items-center bg-yellow-200 absolute top-8'>
									<span className='heading-3'>{item.count}</span>
								</div>
								<span className='xs-semibold absolute bottom-12 pb-4'>{item.label}</span>
								<div className='flex justify-around items-center absolute bottom-0 w-full h-12 bg-yellow-200'>
									<span className='heading-4'>{t('loc:Zobraziť')}</span>
									<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
								</div>
							</button>
						))}
					</div>

					{/* <Row justify={'space-between'} gutter={ROW_GUTTER_X_DEFAULT}>
						<Col span={12}>
							<h3>{t('loc:Premium vs. Basic salóny')}</h3>
							{data.graphData.premiumVsBasic && <Doughnut data={{
								labels: data.graphDatapremiumVsBasic.map((item: any) => item.label),
								datasets: [

								]
							}} />}
						</Col>
						<Col span={12}>
							<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'end'} align={'middle'}>
								{children && (
									<Col>
										<Badge count={activeFilters} style={{ top: '8px', right: '10px', background: '#DC0069' }}>
											<Button
												onClick={onClick}
												htmlType='button'
												type='link'
												className={'mr-2 w-full h-full flex items-center'}
												disabled={disableFilter}
												icon={<FilterIcon className={'text-gray-600 hover:text-gray-900'} />}
											/>
										</Badge>
									</Col>
								)}
								<Col>{customContent}</Col>
							</Row>
						</Col>
					</Row>
					<div className='max-w-5xl max-h-3xl mt-8 ml-4 bg-status-pending'>
						<h3>Počet salónov k dnešnému dňu</h3>
						<Bar
							data={{
								labels: [t('loc:BASIC'), t('loc:PREMIUM'), t('loc:Čakajúce na schválenie'), t('loc:Zamietnuté'), t('loc:Nepublikované')],
								datasets: [
									{
										data: source.map((item) => item.data),
										backgroundColor: source.map((item) => item.background),
										borderColor: source.map((item) => item.border),
										borderWidth: 2
									}
								]
							}}
							options={{
								responsive: true,
								plugins: {
									legend: {
										display: false
									}
								},
								scales: {
									x: {
										grid: {
											display: false,
											drawBorder: false
										},
										ticks: {
											font: {
												family: 'Public Sans',
												size: 16,
												weight: 'bold'
											},
											color: '#000'
										}
									}
								},
								onClick(_event, elements) {
									const { index } = elements[0]
									history.push(source[index])
								},
								onHover: (event, activeEvents) => {
									// eslint-disable-next-line no-param-reassign
									;(event?.native?.target as HTMLElement).style.cursor = activeEvents?.length > 0 ? 'pointer' : 'auto'
								}
							}}
						/>
					</div> */}
				</Spin>
			</div>
		</SalonDashboard>
	)
}

export default NotinoDashboard
