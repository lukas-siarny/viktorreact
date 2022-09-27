import i18next from 'i18next'
import { isEmpty, unionBy } from 'lodash'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { change } from 'redux-form'

// types
import { OpeningHours, RawOpeningHours, RawOpeningHoursPatch } from '../../types/interfaces'

// utils
import { DAY, MONDAY_TO_FRIDAY, OPENING_HOURS_STATES } from '../../utils/enums'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type TimeRanges = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours'][0]['timeRanges']

export const week: OpeningHours = [
	{ day: DAY.MONDAY, timeRanges: [] as never, onDemand: false },
	{ day: DAY.TUESDAY, timeRanges: [] as never, onDemand: false },
	{ day: DAY.WEDNESDAY, timeRanges: [] as never, onDemand: false },
	{ day: DAY.THURSDAY, timeRanges: [] as never, onDemand: false },
	{ day: DAY.FRIDAY, timeRanges: [] as never, onDemand: false }
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
		workWeek = [...week, { day: DAY.SATURDAY, timeRanges: [] as never, onDemand: false }, { day: DAY.SUNDAY, timeRanges: [] as never, onDemand: false }]
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
			timeRanges: (openingHours?.[0]?.timeRanges as any) || [],
			onDemand: !!openingHours?.[0]?.onDemand
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

export const createSameOpeningHours = (openingHours: OpeningHours, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean): RawOpeningHoursPatch => {
	if (sameOpenHoursOverWeek && openingHours) {
		const result: RawOpeningHoursPatch = []
		week.forEach((day) => {
			result?.push({
				day: day?.day,
				timeRanges: openingHours?.[0]?.onDemand ? undefined : ((openingHours?.[0]?.timeRanges || []) as any),
				state: openingHours?.[0]?.onDemand ? OPENING_HOURS_STATES.CUSTOM_ORDER : undefined
			})
		})
		if (openOverWeekend) {
			// add weekend
			openingHours.forEach((openingHour) => {
				if (openingHour.day === DAY.SUNDAY || openingHour.day === DAY.SATURDAY) {
					result?.push({
						day: openingHour.day,
						timeRanges: openingHour.onDemand ? undefined : ((openingHour.timeRanges || []) as any),
						state: openingHour.onDemand ? OPENING_HOURS_STATES.CUSTOM_ORDER : undefined
					})
				}
			})
		}
		return result?.filter((openingHour) => (openingHour?.timeRanges?.length || []) > 0) as RawOpeningHoursPatch
	}
	return openingHours
		?.map((openingHour) => ({
			day: openingHour.day,
			timeRanges: openingHour.onDemand ? undefined : ((openingHour.timeRanges || []) as any),
			state: openingHour.onDemand ? OPENING_HOURS_STATES.CUSTOM_ORDER : undefined
		}))
		.filter((openingHour) => openingHour?.timeRanges?.length > 0 || openingHour.state === OPENING_HOURS_STATES.CUSTOM_ORDER) as RawOpeningHoursPatch
}

export const useChangeOpeningHoursFormFields = (
	formName: string,
	openingHours: OpeningHours | undefined,
	sameOpenHoursOverWeekFormValue: boolean,
	openOverWeekendFormValue: boolean,
	fieldName = 'openingHours'
) => {
	const dispatch = useDispatch()

	useEffect(() => {
		if (!openingHours) {
			return
		}
		if (sameOpenHoursOverWeekFormValue) {
			if (openOverWeekendFormValue) {
				// set switch same open hours over week with weekend
				dispatch(
					change(formName, fieldName, [
						{ day: MONDAY_TO_FRIDAY, timeRanges: getDayTimeRanges(openingHours), onDemand: openingHours?.[0]?.onDemand },
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(openingHours, DAY.SUNDAY) }
					])
				)
			} else {
				// set switch same open hours over week without weekend
				dispatch(
					change(formName, fieldName, [
						{
							day: MONDAY_TO_FRIDAY,
							timeRanges: getDayTimeRanges(openingHours),
							onDemand: openingHours?.[0]?.onDemand
						}
					])
				)
			}
		} else {
			// set to init values
			// in initOpeningHours function input openOverWeekend is set to false because also we need to get weekend time Ranges
			const initHours: OpeningHours = initOpeningHours(openingHours, sameOpenHoursOverWeekFormValue, false)?.sort(orderDaysInWeek)

			if (openOverWeekendFormValue && initHours) {
				const updatedOpeningHours = unionBy(
					[
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(openingHours, DAY.SUNDAY) }
					],
					initHours,
					'day'
				)?.sort(orderDaysInWeek)
				dispatch(change(formName, fieldName, updatedOpeningHours))
			} else {
				dispatch(change(formName, fieldName, initHours?.sort(orderDaysInWeek)))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sameOpenHoursOverWeekFormValue, openOverWeekendFormValue])
}

export const mapRawOpeningHoursToComponentOpeningHours = (rawOpeningHours?: RawOpeningHours): OpeningHours =>
	(rawOpeningHours || []).map((day) => {
		const newOpeningHours: any = { ...day }
		delete newOpeningHours.state
		newOpeningHours.onDemand = (day.state as OPENING_HOURS_STATES) === OPENING_HOURS_STATES.CUSTOM_ORDER
		return newOpeningHours
	})

export const validateOpeningHours = (values: OpeningHours) => {
	const openingHoursErrors: { [key: number]: any } = {}

	values.forEach((day, index) => {
		const dayErrors: any = {}
		const timeRangesErrors: any = {}
		if (!day.onDemand && day.timeRanges) {
			day.timeRanges.forEach((timeRange, i) => {
				const timeRangeError: any = {}
				if (timeRange.timeFrom === null) {
					timeRangeError.timeFrom = i18next.t('loc:Toto pole je povinné')
				}
				if (timeRange.timeTo === null) {
					timeRangeError.timeTo = i18next.t('loc:Toto pole je povinné')
				}
				if (!isEmpty(timeRangeError)) {
					timeRangesErrors[i] = timeRangeError
				}
			})
		}
		if (!isEmpty(timeRangesErrors)) {
			dayErrors.timeRanges = timeRangesErrors
		}
		if (!isEmpty(dayErrors)) {
			openingHoursErrors[index] = dayErrors
		}
	})

	return openingHoursErrors
}
