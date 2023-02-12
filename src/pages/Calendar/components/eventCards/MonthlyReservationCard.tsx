/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as CalendarIcon } from '../../../../assets/icons/calendar-24.svg'

// types
import { ICalendarMonthlyReservationsCardData } from '../../../../types/interfaces'
import { parseTimeFromMinutes } from '../../calendarHelpers'

interface IMonthlyReservationCardProps {
	eventData?: ICalendarMonthlyReservationsCardData['eventData']
	isDayEventsPopover?: boolean
}

const MonthlyReservationCard: FC<IMonthlyReservationCardProps> = (props) => {
	const { eventData, isDayEventsPopover } = props
	const { employee, eventsCount, eventsDuration } = eventData || {}

	const [t] = useTranslation()

	const bgColor = employee?.color
	const avatar = employee?.image?.resizedImages?.thumbnail
	const duration = parseTimeFromMinutes(eventsDuration || 0)

	const cardRef = useRef<HTMLDivElement | null>(null)

	const handleReservationClick = () => {
		// NOTE: prevent proti kliknutiu na virutalny event rezervacie neotvori sa popover
	}

	return (
		<div ref={cardRef} className={'nc-event nc-month-event reservation'} onClick={handleReservationClick}>
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
					<CalendarIcon width={10} height={10} />
					<span className={'events-count'}>
						{eventsCount} <span className={'duration'}>{`(${duration})`}</span>
					</span>
				</div>
			</div>
		</div>
	)
}

export default React.memo(MonthlyReservationCard, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
