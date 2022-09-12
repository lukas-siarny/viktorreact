import { isEmpty, unionBy } from 'lodash'
import { OpeningHours } from '../../types/interfaces'
import { DAY, MONDAY_TO_FRIDAY } from '../../utils/enums'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type TimeRanges = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours'][0]['timeRanges']

export const week: OpeningHours = [
	{ day: DAY.MONDAY, timeRanges: [] as never },
	{ day: DAY.TUESDAY, timeRanges: [] as never },
	{ day: DAY.WEDNESDAY, timeRanges: [] as never },
	{ day: DAY.THURSDAY, timeRanges: [] as never },
	{ day: DAY.FRIDAY, timeRanges: [] as never }
]

export const daysOrderMap: any = {
	[MONDAY_TO_FRIDAY]: 0,
	[DAY.MONDAY]: 1,
	[DAY.TUESDAY]: 2,
	[DAY.WEDNESDAY]: 3,
	[DAY.THURSDAY]: 4,
	[DAY.FRIDAY]: 5,
	[DAY.SATURDAY]: 6,
	[DAY.SUNDAY]: 7
}

export const orderDaysInWeek = (a: any, b: any) => {
	return daysOrderMap[a?.day] - daysOrderMap[b?.day]
}

// create options for filed array based on length of week
export const initOpeningHours = (openingHours: OpeningHours | undefined, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean): OpeningHours => {
	let workWeek: OpeningHours = [...week]
	if (openOverWeekend) {
		// add weekend days
		workWeek = [...week, { day: DAY.SATURDAY, timeRanges: [] as never }, { day: DAY.SUNDAY, timeRanges: [] as never }]
		workWeek = unionBy(openingHours, workWeek, 'day') as OpeningHours
	} else {
		// remove weekend days
		workWeek = unionBy(
			openingHours?.filter((openingHour) => openingHour?.day !== DAY.SUNDAY && openingHour?.day !== DAY.SATURDAY),
			workWeek,
			'day'
		) as OpeningHours
	}
	if (sameOpenHoursOverWeek) {
		// filter all work days
		workWeek = workWeek?.filter(
			(openingHour) =>
				openingHour.day !== DAY.MONDAY &&
				openingHour.day !== DAY.TUESDAY &&
				openingHour.day !== DAY.WEDNESDAY &&
				openingHour.day !== DAY.THURSDAY &&
				openingHour.day !== DAY.FRIDAY
		) as OpeningHours
		// add monday to friday field
		workWeek?.splice(0, 0, {
			day: MONDAY_TO_FRIDAY as DAY,
			timeRanges: (openingHours?.[0]?.timeRanges as any) || []
		})
	} else {
		// remove same open hours over week
		workWeek = [...(workWeek?.filter((openingHour) => openingHour?.day !== (MONDAY_TO_FRIDAY as any)) || [])]
	}
	return workWeek
}

export const checkWeekend = (openingHours: OpeningHours | undefined): boolean => {
	let result = false
	if (openingHours) {
		// eslint-disable-next-line consistent-return
		openingHours.forEach((openingHour) => {
			if (openingHour.day === DAY.SATURDAY || openingHour.day === DAY.SUNDAY) {
				result = true
			}
		})
	}
	return result
}

export const getDayTimeRanges = (openingHours: OpeningHours, day?: DAY) => {
	let timeRanges: TimeRanges | [] = []
	if (openingHours) {
		// eslint-disable-next-line consistent-return,no-restricted-syntax
		for (const openingHour of openingHours) {
			if (day && openingHour.day === day) {
				timeRanges = openingHour.timeRanges
				break
			} else if (!isEmpty(openingHour.timeRanges) && !isEmpty(openingHour.timeRanges[0]) && isEmpty(day)) {
				timeRanges = openingHour.timeRanges
				break
			}
		}
	}
	return timeRanges
}

export const equals = (ref: TimeRanges, comp: TimeRanges): boolean => JSON.stringify(ref) === JSON.stringify(comp)

export const checkSameOpeningHours = (openingHours: OpeningHours | undefined): boolean => {
	if (openingHours) {
		const checks: boolean[] = []
		let referenceTimeRanges: TimeRanges
		openingHours.forEach((openingHour, index) => {
			if (openingHour?.day !== DAY.SUNDAY && openingHour?.day !== DAY.SATURDAY) {
				// take reference
				if (index === 0) {
					referenceTimeRanges = openingHour.timeRanges
					// init checks array
					checks.push(true)
				} else {
					checks.push(equals(referenceTimeRanges, openingHour.timeRanges))
				}
			}
		})
		// checks length array must be 5 because all days from monday to friday must have same ranges
		if (!isEmpty(checks) && checks.every((value) => value) && checks.length === 5) {
			return true
		}
	}
	return false
}

export const createSameOpeningHours = (openingHours: OpeningHours, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean) => {
	if (sameOpenHoursOverWeek && openingHours) {
		const result: OpeningHours = [] as any
		week.forEach((day) => {
			result?.push({
				day: day?.day,
				timeRanges: openingHours?.[0]?.timeRanges || ([] as any)
			})
		})
		if (openOverWeekend) {
			// add weekend
			openingHours.forEach((openingHour) => {
				if (openingHour.day === DAY.SUNDAY || openingHour.day === DAY.SATURDAY) {
					result?.push({
						day: openingHour.day,
						timeRanges: openingHour.timeRanges
					})
				}
			})
		}
		return result?.filter((openingHour) => openingHour?.timeRanges?.length > 0)
	}
	return openingHours?.filter((openingHour) => openingHour?.timeRanges?.length > 0)
}
