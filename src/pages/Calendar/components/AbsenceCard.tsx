/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import cx from 'classnames'

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { getHoursMinutesFromMinutes } from '../calendarHelpers'

// assets
import { ReactComponent as AbsenceIcon } from '../../../assets/icons/absence-icon.svg'
import { ReactComponent as BreakIcon } from '../../../assets/icons/break-icon-16.svg'

// types
import { IEventCardProps } from '../../../types/interfaces'

interface IAbsenceCardProps extends IEventCardProps {}

const AbsenceCard: FC<IAbsenceCardProps> = ({ calendarView, data, diff, timeText, onEditEvent }) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType, originalEvent, isMultiDayEvent, isLastMultiDaylEventInCurrentRange, isFirstMultiDayEventInCurrentRange } = extendedProps || {}

	const duration = getHoursMinutesFromMinutes(diff)

	return (
		<div
			className={cx('nc-event', {
				'nc-day-event': calendarView === CALENDAR_VIEW.DAY,
				'nc-week-event': calendarView === CALENDAR_VIEW.WEEK,
				shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'multiday-event': isMultiDayEvent,
				'multiday-event-first': isFirstMultiDayEventInCurrentRange,
				'multiday-event-last': isLastMultiDaylEventInCurrentRange,
				'min-15': Math.abs(diff) <= 15,
				'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
				'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45
			})}
			onClick={() => onEditEvent(originalEvent.id || event.id, eventType)}
		>
			{(() => {
				switch (calendarView) {
					case CALENDAR_VIEW.WEEK: {
						return (
							<div className={'event-content'}>
								<div className={'sticky-container'}>
									<div className={'event-info'}>
										<span className={'color'} style={{ backgroundColor }} />
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
										{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
									</div>
								</div>
								<span className={'duration'}>{duration}</span>
							</div>
						)
					}
					case CALENDAR_VIEW.DAY:
					default: {
						return (
							<div className={'event-content'}>
								<div className={'event-info'}>
									<div className={'flex items-center gap-1 min-w-0'}>
										<span className={'color'} style={{ backgroundColor }} />
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
										{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && (
											<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
										)}
									</div>
									<span className={'duration'}>{duration}</span>
								</div>
								{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
							</div>
						)
					}
				}
			})()}
		</div>
	)
}

export default AbsenceCard
