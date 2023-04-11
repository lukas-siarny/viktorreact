import dayjs, { Dayjs } from 'dayjs'
import colors from 'tailwindcss/colors'

// types
import { TimeStats, TimeStatsData } from '../../../types/interfaces'

// utils
import { getSalonFilterRanges } from '../../../utils/helper'
import {
	DATE_TIME_RANGE,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_DATE_TIME_OPTIONS,
	RESERVATIONS_STATS_TYPE,
	RS_STATS_TYPE,
	SALONS_TIME_STATS_TYPE,
	TIME_STATS_SOURCE_TYPE
} from '../../../utils/enums'

// reducers
import { IReservationsStats, IRsStats, ISalonsTimeStats } from '../../../reducers/dashboard/dashboardActions'
import { ISmsTimeStatsPayload } from '../../../reducers/sms/smsActions'

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
			if (elements?.length) {
				const el = elements[0]
				const handler = clickHandlers[el?.index]
				if (handler) {
					handler.onClick()
				}
			}
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
export const transformToRsStatsData = (source: IRsStats | null, isLoading: boolean, isFailure: boolean, selectedDate: Dayjs): TimeStats => {
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
			// ENABLE_RS_B2B
			{
				data: [],
				backgroundColor: colors.blue[200],
				borderColor: colors.blue[200],
				pointRadius: 1
			},
			// ENABLE_RS_B2C
			{
				data: [],
				backgroundColor: colors.blue[700],
				borderColor: colors.blue[700],
				pointRadius: 1
			}
		],
		columns: [
			{
				type: RS_STATS_TYPE.ENABLE_RS_B2B,
				summary: 0
			},
			{
				type: RS_STATS_TYPE.ENABLE_RS_B2C,
				summary: 0
			}
		],
		breakIndex: 100
	}

	if (source && source?.ranges) {
		const months: string[] = dayjs.monthsShort()

		Object.entries(source.ranges).forEach(([key, value]) => {
			result.datasets[0].data.push(value.countEnabledRsB2b)
			result.datasets[1].data.push(value.countEnabledRsB2c)
			// days and months as result from API are indexed from 1 instead of 0
			const prop = Number(key) - 1
			// Annual stats have labels Jan, Feb, ... and month stats have 1. 2. 3. ...
			result.labels.push(source.type === TIME_STATS_SOURCE_TYPE.YEAR ? months[prop] : `${key}.`)

			result.columns[0] = {
				...result.columns[0],
				[prop]: value.countEnabledRsB2b,
				summary: result.columns[0].summary + value.countEnabledRsB2b
			}
			result.columns[1] = {
				...result.columns[1],
				[prop]: value.countEnabledRsB2c,
				summary: result.columns[1].summary + value.countEnabledRsB2c
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
export const transformToReservationsStatsData = (source: IReservationsStats | null, isLoading: boolean, isFailure: boolean, selectedDate: Dayjs): TimeStats => {
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
			// NEW_RS_B2B
			{
				data: [],
				backgroundColor: colors.blue[200],
				borderColor: colors.blue[200],
				pointRadius: 1
			},
			// NEW_RS_B2C
			{
				data: [],
				backgroundColor: colors.blue[700],
				borderColor: colors.blue[700],
				pointRadius: 1
			}
		],
		columns: [
			{
				type: RESERVATIONS_STATS_TYPE.NEW_RS_B2B,
				summary: 0
			},
			{
				type: RESERVATIONS_STATS_TYPE.NEW_RS_B2C,
				summary: 0
			}
		],
		breakIndex: 100
	}

	if (source && source?.ranges) {
		const months: string[] = dayjs.monthsShort()

		Object.entries(source.ranges).forEach(([key, value]) => {
			result.datasets[0].data.push(value.newReservationsB2b)
			result.datasets[1].data.push(value.newReservationsB2c)
			// days and months as result from API are indexed from 1 instead of 0
			const prop = Number(key) - 1
			// Annual stats have labels Jan, Feb, ... and month stats have 1. 2. 3. ...
			result.labels.push(source.type === TIME_STATS_SOURCE_TYPE.YEAR ? months[prop] : `${key}.`)

			result.columns[0] = {
				...result.columns[0],
				[prop]: value.newReservationsB2b,
				summary: result.columns[0].summary + value.newReservationsB2b
			}
			result.columns[1] = {
				...result.columns[1],
				[prop]: value.newReservationsB2c,
				summary: result.columns[1].summary + value.newReservationsB2c
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

export const SMS_SENT_STATS_COLOR = '#2277F3'

export const transformSmsDataToStatsData = (source: ISmsTimeStatsPayload['data'], isLoading: boolean, isFailure: boolean, selectedDate: Dayjs): TimeStats => {
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
			{
				data: [],
				backgroundColor: SMS_SENT_STATS_COLOR,
				borderColor: SMS_SENT_STATS_COLOR,
				pointRadius: 1
			}
		],
		columns: [
			{
				type: 'SMS_SENT',
				summary: 0
			}
		],
		breakIndex: 100
	}

	if (source && source?.ranges) {
		Object.entries(source.ranges).forEach(([key, value]) => {
			result.datasets[0].data.push(value.totalSentSmsCount)
			// days and months as result from API are indexed from 1 instead of 0
			const prop = Number(key) - 1
			// 1. 2. 3. ...
			result.labels.push(`${key}.`)

			result.columns[0] = {
				...result.columns[0],
				[prop]: value.totalSentSmsCount,
				summary: result.columns[0].summary + value.totalSentSmsCount
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
			if (currMonth === selectedDate.month()) {
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
