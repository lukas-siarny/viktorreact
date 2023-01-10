/* eslint-disable import/no-cycle */
import React, { FC, useEffect, useCallback } from 'react'
import { Divider, Popover, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-16.svg'

// components
import CalendarEventContent from './CalendarEventContent'

// types
import { RootState } from '../../../reducers'
import { CalendarEvent, ICalendarDayEventsPopover, ICalendarEventContent, PopoverTriggerPosition, ReservationPopoverData } from '../../../types/interfaces'

/// utils
import { CALENDAR_EVENT_DISPLAY_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { sortCalendarEvents } from '../calendarHelpers'

// hooks
import useKeyUp from '../../../hooks/useKeyUp'
import { IVirtualEventPayload } from '../../../reducers/virtualEvent/virtualEventActions'

const getEventsForPopover = (
	date: string | null,
	events: CalendarEvent[],
	virtualEvent: IVirtualEventPayload['data'] | null,
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void,
	onReservationClick: (data: ReservationPopoverData, position: PopoverTriggerPosition) => void
): ICalendarEventContent[] => {
	const newEvents = (events || []).reduce((editedEvents: ICalendarEventContent[], event) => {
		if (event.id === virtualEvent?.id) {
			return editedEvents
		}

		return [
			...editedEvents,
			{
				id: event.id,
				start: (event.originalEvent?.startDateTime || event.startDateTime) as unknown as Date,
				end: (event.originalEvent?.endDateTime || event.endDateTime) as unknown as Date,
				eventDisplayType: CALENDAR_EVENT_DISPLAY_TYPE.REGULAR,
				backgroundColor: event.employee.color,
				calendarView: CALENDAR_VIEW.MONTH,
				onEditEvent,
				onReservationClick,
				eventData: event
			}
		]
	}, [])

	const virtualEventStartTime = virtualEvent?.event?.eventData?.start.date
	const virtualEventEndTime = virtualEvent?.event?.eventData?.end.date
	if (virtualEventStartTime && virtualEventEndTime && date && dayjs(date).isBetween(virtualEventStartTime, virtualEventEndTime, 'day', '[]')) {
		newEvents.push({
			id: virtualEvent.id,
			start: (virtualEvent.event.start as Date) || null,
			end: (virtualEvent.event.end as Date) || null,
			backgroundColor: virtualEvent?.event?.eventData?.employee?.color,
			eventDisplayType: CALENDAR_EVENT_DISPLAY_TYPE.REGULAR,
			calendarView: CALENDAR_VIEW.MONTH,
			onEditEvent,
			onReservationClick,
			eventData: virtualEvent?.event?.eventData
		})
	}
	return sortCalendarEvents(newEvents)
}

type ContentProps = {
	date: string | null
	events: ICalendarEventContent[]
	onClose: () => void
	isLoading?: boolean
	isUpdatingEvent?: boolean
}

const PopoverContent: FC<ContentProps> = (props) => {
	const [t] = useTranslation()
	const { date, onClose, events, isLoading, isUpdatingEvent } = props

	const isToday = dayjs(date).isToday()

	return (
		<div className='nc-day-events-popover-content text-notino-black w-56'>
			<header className={'flex items-center justify-between px-6 h-16 min-w-0 gap-2'}>
				<span className={'capitalize text-sm font-semibold truncate'}>{dayjs(date).format('dddd, D MMM')}</span>
				<button className={'nc-popover-header-button'} type={'button'} onClick={onClose}>
					<CloseIcon />
				</button>
			</header>
			<Divider className={'m-0'} />
			{/* footerHeight = 72px, headerHeight = 52px. dividerHeight = 1px (header and footer dividers), padding top and bottom = 2*16px */}
			<main className={'overflow-y-auto'} style={{ maxHeight: 'calc(100vh - 120px)' }}>
				<Spin spinning={isUpdatingEvent || isLoading}>
					<div className={'flex flex-col gap-1 p-6'}>
						{events?.map((event, i) => {
							return (
								<React.Fragment key={i}>
									<CalendarEventContent
										id={event.id}
										start={event.start}
										end={event.end}
										eventData={event.eventData}
										onEditEvent={event.onEditEvent}
										onReservationClick={event.onReservationClick}
										backgroundColor={event.backgroundColor}
										calendarView={event.calendarView}
										eventDisplayType={event.eventDisplayType}
										isDayEventsPopover
									/>
								</React.Fragment>
							)
						})}
					</div>
				</Spin>
			</main>
		</div>
	)
}

const CalendarDayEventsPopover: FC<ICalendarDayEventsPopover> = (props) => {
	const { position, setIsOpen, isOpen, date, onEditEvent, onReservationClick, isHidden, isLoading, isUpdatingEvent } = props

	const [t] = useTranslation()

	const overlayClassName = `nc-event-popover-overlay_${date || ''}`

	const dayEvents = useSelector((state: RootState) => state.calendar.dayEvents)

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)

	const cellDateEvents = date ? dayEvents[date] : []

	const handleClosePopover = useCallback(() => setIsOpen(false), [setIsOpen])

	useEffect(() => {
		const contentOverlay = document.querySelector('#nc-content-overlay') as HTMLElement

		const listener = (e: Event) => {
			const overlayElement = document.querySelector(`.${overlayClassName}`)
			if (overlayElement && (e?.target as HTMLElement)?.classList?.contains(overlayClassName)) {
				handleClosePopover()
			}
		}

		if (contentOverlay) {
			if (isOpen) {
				document.addEventListener('mousedown', listener)
				document.addEventListener('touchstart', listener)
				contentOverlay.style.display = 'block'
			} else {
				contentOverlay.style.display = 'none'
			}
		}

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [isOpen, overlayClassName, handleClosePopover])

	useKeyUp('Escape', isOpen ? handleClosePopover : undefined)

	const eventsForPopover = getEventsForPopover(date, cellDateEvents, virtualEvent, onEditEvent, onReservationClick)

	return (
		<Popover
			visible={isOpen}
			destroyTooltipOnHide={{ keepParent: true }}
			trigger={'click'}
			placement={'right'}
			overlayClassName={`${overlayClassName} nc-day-events-popover-overlay ${isHidden ? 'is-hidden' : ''}`}
			content={!isHidden && <PopoverContent date={date} events={eventsForPopover} onClose={handleClosePopover} isLoading={isLoading} isUpdatingEvent={isUpdatingEvent} />}
		>
			<div style={{ top: position?.top, left: position?.left, width: position?.width, height: position?.height, position: 'fixed' }} />
		</Popover>
	)
}

export default CalendarDayEventsPopover
