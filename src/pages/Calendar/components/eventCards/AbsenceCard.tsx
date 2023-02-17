/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW, NEW_ID_PREFIX } from '../../../../utils/enums'
import { parseTimeFromMinutes } from '../../calendarHelpers'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'
import { ReactComponent as BreakIcon } from '../../../../assets/icons/break-icon-16.svg'
import { ReactComponent as RepeatIcon } from '../../../../assets/icons/repeat.svg'

// types
import { IEventCardProps } from '../../../../types/interfaces'
import { getAssignedUserLabel } from '../../../../utils/helper'

interface IAbsenceCardProps extends IEventCardProps {
	eventType: CALENDAR_EVENT_TYPE
	isBulkEvent?: boolean
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
}

const getWrapperClassnames = (params: {
	calendarView: CALENDAR_VIEW
	eventType: CALENDAR_EVENT_TYPE
	diff: number
	isPlaceholder?: boolean
	isEdit?: boolean
	isMultiDayEvent?: boolean
	isFirstMultiDayEventInCurrentRange?: boolean
	isLastMultiDaylEventInCurrentRange?: boolean
	isEventsListPopover?: boolean
}) => {
	const { calendarView, eventType, isPlaceholder, isEdit, isMultiDayEvent, isFirstMultiDayEventInCurrentRange, isLastMultiDaylEventInCurrentRange, diff, isEventsListPopover } =
		params

	const commonProps = {
		'nc-day-event': calendarView === CALENDAR_VIEW.DAY,
		'nc-week-event': calendarView === CALENDAR_VIEW.WEEK,
		shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
		timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
		break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
		'multiday-event': isMultiDayEvent,
		'multiday-event-first': isFirstMultiDayEventInCurrentRange,
		'multiday-event-last': isLastMultiDaylEventInCurrentRange,
		placeholder: isPlaceholder,
		edit: isEdit || isPlaceholder,
		'is-events-list-popover': isEventsListPopover
	}

	if (calendarView === CALENDAR_VIEW.MONTH) {
		return {
			...commonProps,
			'nc-month-event': true
		}
	}

	return {
		...commonProps,
		'min-15': Math.abs(diff) <= 15,
		'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
		'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
		'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45
	}
}

const AbsenceCard: FC<IAbsenceCardProps> = (props) => {
	const {
		eventType,
		isMultiDayEvent,
		isLastMultiDaylEventInCurrentRange,
		isFirstMultiDayEventInCurrentRange,
		employee,
		calendarView,
		diff,
		timeText,
		onEditEvent,
		originalEventData,
		backgroundColor,
		isBulkEvent,
		isPlaceholder,
		isEdit,
		isEventsListPopover,
		timeLeftClassName
	} = props

	const duration = parseTimeFromMinutes(diff)
	const [t] = useTranslation()

	const employeeColorIndicator = <span className={'color'} style={{ backgroundColor }} />
	const employeeName = getAssignedUserLabel({
		firstName: employee?.firstName,
		lastName: employee?.lastName,
		email: employee?.email,
		id: employee?.id || '-'
	})
	return (
		<div
			className={cx(
				'nc-event',
				timeLeftClassName,
				getWrapperClassnames({
					calendarView,
					eventType,
					isMultiDayEvent,
					isFirstMultiDayEventInCurrentRange,
					isLastMultiDaylEventInCurrentRange,
					diff,
					isPlaceholder,
					isEdit,
					isEventsListPopover
				})
			)}
			onClick={() => {
				// NOTE: prevent proti kliknutiu na virutalny event rezervacie neotvori sa popover
				if (originalEventData?.id && !originalEventData.id?.startsWith(NEW_ID_PREFIX)) {
					onEditEvent(eventType, originalEventData.id)
				}
			}}
		>
			{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT && <div className={'event-background'} style={{ backgroundColor }} />}
			<div className={'event-content'}>
				{(() => {
					switch (calendarView) {
						case CALENDAR_VIEW.MONTH: {
							return (
								<>
									<div className={'event-info'}>
										{employeeColorIndicator}
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
										{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
										<span className={'title'}>{employeeName}</span>
									</div>
									<span className={'duration'}>{duration}</span>
								</>
							)
						}
						case CALENDAR_VIEW.WEEK: {
							return (
								<>
									<div className={'sticky-container'}>
										<div className={'event-info'}>
											{employeeColorIndicator}
											{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
											{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
											{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
										</div>
									</div>
									<span className={'duration'}>{duration}</span>
								</>
							)
						}
						case CALENDAR_VIEW.DAY:
						default: {
							return (
								<>
									<div className={'event-info'}>
										<div className={'flex items-center gap-1 min-w-0'}>
											{employeeColorIndicator}
											{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
											{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
											{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'title'}>{employeeName}</span>}
										</div>
										<span className={'duration'}>{duration}</span>
									</div>
									{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
									{isBulkEvent && (
										<div className={'bulk-event flex gap-1 items-start text-notino-grayDark text-xxs leading-3'}>
											<RepeatIcon className={'shrink-0'} width={10} height={10} style={{ marginTop: 3 }} />
											<span className={'truncate max-w-full'}>{t('loc:Opakuje sa')}</span>
										</div>
									)}
								</>
							)
						}
					}
				})()}
			</div>
		</div>
	)
}

export default React.memo(AbsenceCard, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
