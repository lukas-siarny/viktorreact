/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// assets
import { ReactComponent as CalendarIcon } from '../../../../assets/icons/calendar-24.svg'

// types
import { EmployeeTooltipPopoverData, ICalendarMonthlyReservationsCardData, PopoverTriggerPosition } from '../../../../types/interfaces'
import { parseTimeFromMinutes } from '../../calendarHelpers'
import { getAssignedUserLabel } from '../../../../utils/helper'

interface IMonthlyReservationCardProps {
	date: string
	eventData?: ICalendarMonthlyReservationsCardData['eventData']
	isEventsListPopover?: boolean
	onMonthlyReservationClick: (data: EmployeeTooltipPopoverData, position?: PopoverTriggerPosition) => void
}

const MonthlyReservationCard: FC<IMonthlyReservationCardProps> = (props) => {
	const { eventData, isEventsListPopover, onMonthlyReservationClick, date } = props
	const { employee, eventsCount, eventsDuration } = eventData || {}

	const [t] = useTranslation()

	const bgColor = employee?.color
	const avatar = employee?.image?.resizedImages?.thumbnail
	const duration = parseTimeFromMinutes(eventsDuration || 0)

	const cardRef = useRef<HTMLDivElement | null>(null)

	const handleReservationClick = () => {
		if (cardRef.current && employee) {
			const data: EmployeeTooltipPopoverData = {
				employee,
				date
			}

			const clientRect = cardRef.current.getBoundingClientRect()

			const position: PopoverTriggerPosition = {
				top: clientRect.top,
				left: clientRect.left,
				width: clientRect.width,
				height: clientRect.bottom - clientRect.top
			}
			onMonthlyReservationClick(data, position)
		}
	}

	return (
		<div ref={cardRef} className={cx('nc-event nc-month-event reservation', { 'is-events-list-popover': isEventsListPopover })} onClick={handleReservationClick}>
			<div
				className={'event-accent'}
				style={{
					backgroundColor: bgColor
				}}
			/>
			{!isEventsListPopover && <div className={'event-background'} style={{ backgroundColor: bgColor }} />}
			<div className={'event-content'}>
				<div className={'event-avatar'}>
					{avatar && (
						<img
							src={avatar}
							alt={
								employee
									? getAssignedUserLabel({
											firstName: employee.firstName,
											lastName: employee.lastName,
											email: employee.email,
											id: employee.id
									  })
									: ''
							}
							width={16}
							height={16}
						/>
					)}
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
