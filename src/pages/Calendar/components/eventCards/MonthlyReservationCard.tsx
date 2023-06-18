/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// assets
import { ReactComponent as CalendarIcon } from '../../../../assets/icons/calendar-icon.svg'

// types
import { ICalendarMonthlyReservationsCardData, PopoverTriggerPosition } from '../../../../types/interfaces'
import { ICalendarPageURLQueryParams } from '../../../../schemas/queryParams'

// utils
import { parseTimeFromMinutes } from '../../calendarHelpers'
import { getAssignedUserLabel } from '../../../../utils/helper'
import { CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'

// hooks
import { formatObjToQuery } from '../../../../hooks/useQueryParamsZod'

interface IMonthlyReservationCardProps {
	date: string
	eventData?: ICalendarMonthlyReservationsCardData['eventData']
	isEventsListPopover?: boolean
	onShowEventsListPopover?: (date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean, employeeID?: string) => void
	query: Pick<ICalendarPageURLQueryParams, 'categoryIDs'>
	parentPath: string
}

const MonthlyReservationCard: FC<IMonthlyReservationCardProps> = (props) => {
	const { eventData, isEventsListPopover, date, onShowEventsListPopover, query, parentPath } = props
	const { employee, eventsCount, eventsDuration } = eventData || {}

	const [t] = useTranslation()

	const bgColor = employee?.color
	const avatar = employee?.image?.resizedImages?.thumbnail
	const duration = parseTimeFromMinutes(eventsDuration || 0)

	const cardRef = useRef<HTMLDivElement | null>(null)

	const getEmployeeLink = () => {
		if (!employee) {
			return ''
		}
		const linkSearchParams: ICalendarPageURLQueryParams = {
			employeeIDs: [employee.id],
			categoryIDs: query.categoryIDs,
			view: CALENDAR_VIEW.DAY,
			eventsViewType: CALENDAR_EVENTS_VIEW_TYPE.RESERVATION,
			date
		}

		return `${parentPath}${t('paths:calendar')}${formatObjToQuery(linkSearchParams)}`
	}

	const handleReservationClick = () => {
		if (cardRef.current && employee) {
			const clientRect = cardRef.current.getBoundingClientRect()

			const position: PopoverTriggerPosition = {
				top: clientRect.top,
				left: clientRect.left,
				width: clientRect.width,
				height: clientRect.bottom - clientRect.top
			}
			if (isEventsListPopover) {
				window.open(getEmployeeLink(), '_blank')
			} else if (onShowEventsListPopover) {
				onShowEventsListPopover(date, position, true, employee.id)
			}
		}
	}

	const employeeName = employee
		? getAssignedUserLabel({
				firstName: employee.firstName,
				lastName: employee.lastName,
				email: employee.email,
				id: employee.id
		  })
		: ''

	return (
		<div
			ref={cardRef}
			className={cx('nc-event nc-month-event reservation', { 'is-events-list-popover': isEventsListPopover, 'is-deleted-employee': employee?.isDeleted })}
			onClick={handleReservationClick}
		>
			<div
				className={'event-accent'}
				style={{
					backgroundColor: bgColor
				}}
			/>
			{!isEventsListPopover && <div className={'event-background'} style={{ backgroundColor: bgColor }} />}
			<div className={'event-content'}>
				<div className={'employee-wrapper'}>
					<div className={'avatar'}>{avatar && <img src={avatar} alt={employeeName} width={16} height={16} />}</div>
					<span className={'name'}>{employeeName}</span>
				</div>
				<div className={'events-stats'}>
					{isEventsListPopover ? (
						<>
							<div className={'events-count count'}>
								<span>{t('loc:Rezervácie')}</span> {eventsCount}
							</div>
							<div className={'events-count duration'}>
								<span>{t('loc:Trvanie')}</span> {duration}
							</div>
						</>
					) : (
						<>
							<CalendarIcon width={10} height={10} />
							<span className={'events-count'}>
								{eventsCount} <span>{`(${duration})`}</span>
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default React.memo(MonthlyReservationCard, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
