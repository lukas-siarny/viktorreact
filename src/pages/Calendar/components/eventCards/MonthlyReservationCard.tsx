/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// assets
import { ReactComponent as CalendarIcon } from '../../../../assets/icons/calendar-24.svg'

// types
import { EmployeeReservationsPopoverData, ICalendarMonthlyReservationsCardData, PopoverTriggerPosition } from '../../../../types/interfaces'
import { parseTimeFromMinutes } from '../../calendarHelpers'

interface IMonthlyReservationCardProps {
	date: string
	eventData?: ICalendarMonthlyReservationsCardData['eventData']
	isDayEventsPopover?: boolean
	onMonthlyReservationClick: (data: EmployeeReservationsPopoverData, position?: PopoverTriggerPosition) => void
}

const MonthlyReservationCard: FC<IMonthlyReservationCardProps> = (props) => {
	const { eventData, isDayEventsPopover, onMonthlyReservationClick, date } = props
	const { employee, eventsCount, eventsDuration } = eventData || {}

	const [t] = useTranslation()

	const bgColor = employee?.color
	const avatar = employee?.image?.resizedImages?.thumbnail
	const duration = parseTimeFromMinutes(eventsDuration || 0)

	const cardRef = useRef<HTMLDivElement | null>(null)

	const handleReservationClick = () => {
		if (cardRef.current && employee) {
			const data: EmployeeReservationsPopoverData = {
				employeeId: employee.id,
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
		<div ref={cardRef} className={cx('nc-event nc-month-event reservation', { 'is-day-events-popover': isDayEventsPopover })} onClick={handleReservationClick}>
			<div
				className={'event-accent'}
				style={{
					backgroundColor: bgColor
				}}
			/>
			{!isDayEventsPopover && <div className={'event-background'} style={{ backgroundColor: bgColor }} />}
			<div className={'event-content'}>
				<div className={'event-avatar'}>{avatar && <img src={avatar} alt={''} width={16} height={16} />}</div>
				<div className={'events-stats'}>
					{isDayEventsPopover ? (
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
