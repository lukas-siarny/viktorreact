import dayjs, { Dayjs } from 'dayjs'
import colors from 'tailwindcss/colors'

// types
import { TimeStats, TimeStatsData } from '../../../types/interfaces'
import { ISalonsTimeStats } from '../../../reducers/dashboard/dashboardActions'

// utils
import { getSalonFilterRanges } from '../../../utils/helper'
import { DEFAULT_DATE_TIME_OPTIONS, DATE_TIME_RANGE, DEFAULT_DATE_INIT_FORMAT, SALONS_TIME_STATS_TYPE, TIME_STATS_SOURCE_TYPE } from '../../../utils/enums'

export const doughnutOptions = (clickHandlers: any[]) => {
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

export const lineOptions = (annotationIndex?: number) => ({
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

export const getFilterRanges = () => {
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

export const transformToStatsData = (source: ISalonsTimeStats | null, isLoading: boolean, isFailure: boolean, selectedDate: Dayjs): TimeStats => {
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

	const now = dayjs()
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