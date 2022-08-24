import i18next from 'i18next'
import dayjs from 'dayjs'

export type ValueAndUnit = {
	value: number
	unit: 'hour' | 'week'
	name: string
}

export const intervals: ValueAndUnit[] = [
	{ name: i18next.t('loc:24 hodín'), value: 24, unit: 'hour' },
	{ name: i18next.t('loc:48 hodín'), value: 48, unit: 'hour' },
	{ name: i18next.t('loc:Týždeň'), value: 1, unit: 'week' }
]

export const getSalonFilterRanges = (values: ValueAndUnit[]): { [key: string]: dayjs.Dayjs[] } => {
	const now = dayjs()
	return values.reduce((ranges, value) => {
		return {
			...ranges,
			[value.name]: [now.subtract(value.value, value.unit), now]
		}
	}, {})
}
