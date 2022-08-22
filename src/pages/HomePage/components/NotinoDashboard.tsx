import React, { FC } from 'react'
import { Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// components
import SalonDashboard from './SalonDashboard'

// utils
import { FILTER_PATHS, SALON_FILTER_STATES, SALON_CREATE_TYPES } from '../../../utils/enums'
import { history } from '../../../utils/history'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {}

const source = [
	{
		data: 85,
		background: '#93C5FD',
		border: '#258AFB',
		filterPath: FILTER_PATHS.SALONS[SALON_CREATE_TYPES.BASIC]
	},
	{
		data: 113,
		background: '#BBF7D0',
		border: '#89F1AD',
		filterPath: '/salons' // TODO
	},
	{
		data: 15,
		background: '#FDE68A',
		border: '#FCDA53',
		filterPath: FILTER_PATHS.SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION]
	},
	{
		data: 4,
		background: '#FECACA',
		border: '#FD9393',
		filterPath: FILTER_PATHS.SALONS[SALON_FILTER_STATES.DECLINED]
	},
	{
		data: 95,
		background: '#E6E6E6',
		border: '#CACACA',
		filterPath: FILTER_PATHS.SALONS[SALON_FILTER_STATES.NOT_PUBLISHED]
	}
]

const NotinoDashboard: FC<Props> = () => {
	const [t] = useTranslation()

	// if salon is not selected, show global (Notino) dashboard content
	return (
		<SalonDashboard>
			<div className='content-body'>
				<Alert
					message={
						<h4 className='mb-0 font-normal'>
							{t('loc:Počet salónov čakajúcich na schválenie')}: <strong>{15}</strong>
						</h4>
					}
					type='warning'
					showIcon
					className='cursor-pointer max-w-3xl'
					onClick={() => history.push(FILTER_PATHS.SALONS[SALON_FILTER_STATES.PENDING_PUBLICATION])}
				/>
				<Alert
					message={
						<h4 className='mb-0 font-normal'>
							{t('loc:Počet publikovaných salónov so zmenami za posledných 24 hodín')}: <strong>{55}</strong>
						</h4>
					}
					type='warning'
					showIcon
					className='cursor-pointer max-w-3xl mt-8'
				/>
				<Alert
					message={
						<h4 className='mb-0 font-normal'>
							{t('loc:Počet publikovaných salónov so zmenami za posledných 48 hodín')}: <strong>{72}</strong>
						</h4>
					}
					type='warning'
					showIcon
					className='cursor-pointer max-w-3xl mt-8'
				/>
				<Alert
					message={
						<h4 className='mb-0 font-normal'>
							{t('loc:Počet publikovaných salónov so zmenami za posledný týždeň')}: <strong>{595}</strong>
						</h4>
					}
					type='warning'
					showIcon
					className='cursor-pointer max-w-3xl mt-8'
				/>
				<Alert
					message={
						<h4 className='mb-0 font-normal'>
							{t('loc:Počet BASIC salónov, ktoré systém omylom navrhol používateľom na spárovanie')}: <strong>{22}</strong>
						</h4>
					}
					type='warning'
					showIcon
					className='cursor-pointer max-w-3xl mt-8'
				/>
				<div className='max-w-5xl max-h-3xl mt-8'>
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
				</div>
			</div>
		</SalonDashboard>
	)
}

export default NotinoDashboard
