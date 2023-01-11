import React, { useMemo, FC, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

// full calendar
import FullCalendar, { DateSelectArg, DayCellContentArg, DayHeaderContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { t } from 'i18next'
import { CalendarEvent, ICalendarView, PopoverTriggerPosition } from '../../../../types/interfaces'

// enums
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_DAY_EVENTS_SHOWN,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT
} from '../../../../utils/enums'
import { compareAndSortDayEvents, composeMonthViewEvents, getBusinessHours, getOpnenigHoursMap, OpeningHoursMap, eventAllow } from '../../calendarHelpers'
import { RootState } from '../../../../reducers'
import eventContent from '../../eventContent'

// assets
import { clearEvent, IVirtualEventPayload } from '../../../../reducers/virtualEvent/virtualEventActions'

const getCurrentDayEventsCount = (selectedDate: string, dayEvents: CalendarEvent[], virtualEvent: IVirtualEventPayload['data'] | null): number => {
	let eventsCount = dayEvents.reduce((count, event) => {
		if (event.id === virtualEvent?.id) {
			return count
		}

		return count + 1
	}, 0)

	const virtualEventStartTime = virtualEvent?.event?.eventData?.start.date
	const virtualEventEndTime = virtualEvent?.event?.eventData?.end.date
	if (virtualEventStartTime && virtualEventEndTime && selectedDate && dayjs(selectedDate).isBetween(virtualEventStartTime, virtualEventEndTime, 'day', '[]')) {
		eventsCount += 1
	}
	return Math.max(eventsCount - CALENDAR_DAY_EVENTS_SHOWN, 0)
}

const getLinkMoreText = (eventsCount?: number) => {
	switch (eventsCount) {
		case undefined:
		case 0:
			return t('loc:ďalšie')
		case 1:
			return `${eventsCount} ${t('loc:ďalší')}`
		case 2:
		case 3:
		case 4:
			return `${eventsCount} ${t('loc:ďalšie')}`
		default:
			return `${eventsCount} ${t('loc:ďalších')}`
	}
}

const dayHeaderContent = (arg: DayHeaderContentArg, openingHoursMap: OpeningHoursMap) => {
	const { date } = arg || {}
	const dayNumber = dayjs(date).day()
	return <div className={cx('nc-month-day-header', { shaded: !openingHoursMap[dayNumber] })}>{dayjs(date).format(CALENDAR_DATE_FORMAT.MONTH_HEADER_DAY_NAME)}</div>
}
interface IDayCellContent {
	date: Date
	dayNumberText: string
	salonID: string
	onShowMore: (date: string, position?: PopoverTriggerPosition) => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const DayCellContent: FC<IDayCellContent> = (props) => {
	const { onShowMore, date, dayNumberText } = props

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const dayEvents = useSelector((state: RootState) => state.calendar.dayEvents)

	const cellDate = dayjs(date).format(CALENDAR_DATE_FORMAT.QUERY)

	const currentDayEvents = dayEvents[cellDate]

	const dayNumerRef = useRef<HTMLSpanElement | null>(null)

	const eventsCount = getCurrentDayEventsCount(cellDate, currentDayEvents || [], virtualEvent)

	useEffect(() => {
		if (dayNumerRef.current) {
			const dayGridDayBottom = dayNumerRef.current.parentNode?.parentNode?.parentNode?.querySelector('.fc-daygrid-day-events')?.querySelector('.fc-daygrid-day-bottom')

			if (dayGridDayBottom) {
				const existingButton = dayGridDayBottom?.querySelector('.nc-month-more-button')
				const textMore = existingButton?.querySelector('.text-more')
				if (existingButton && textMore) {
					if (!eventsCount) {
						textMore.innerHTML = ''
						existingButton.classList.add('nc-month-more-button-hidden')
					} else {
						textMore.innerHTML = getLinkMoreText(eventsCount)
						existingButton.classList.remove('nc-month-more-button-hidden')
					}
				} else if (eventsCount) {
					const handleShowMore = async (clientRect: DOMRect) => {
						if (cellDate && clientRect) {
							const position: PopoverTriggerPosition = {
								top: clientRect.top,
								left: clientRect.left,
								width: clientRect.width + 10,
								height: clientRect.bottom - clientRect.top
							}
							onShowMore(cellDate, position)
						}
					}

					const link = document.createElement('a')
					link.className = 'fc-daygrid-more-link fc-more-link nc-more-link'
					link.setAttribute('aria-expanded', 'false')
					link.setAttribute('tabindex', '0')

					const button = document.createElement('button')
					button.className = 'nc-month-more-button'

					const span = document.createElement('span')
					span.className = 'text-more'
					span.innerHTML = getLinkMoreText(eventsCount || 0)

					const arrow = document.createElement('span')
					arrow.className = 'arrow'

					button.appendChild(span)
					button.appendChild(arrow)
					link.appendChild(button)
					dayGridDayBottom.appendChild(link)

					button.addEventListener('click', () => {
						const clientRect = button.getBoundingClientRect()
						handleShowMore(clientRect)
					})
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventsCount, cellDate])

	return <span ref={dayNumerRef}>{dayNumberText}</span>
}

const eventOrder = (a: any, b: any) => {
	const aStart = a.eventData?.originalEvent?.startDateTime || a.eventData?.startDateTime
	const aEnd = a.eventData?.originalEvent?.endDateTime || a.eventData?.endDateTime
	const bStart = b.eventData?.originalEvent?.startDateTime || b.eventData?.startDateTime
	const bEnd = b.eventData?.originalEvent?.endDateTime || b.eventData?.endDateTime
	return compareAndSortDayEvents(aStart, aEnd, bStart, bEnd, a.id, b.id)
}

interface ICalendarMonthView extends ICalendarView {
	salonID: string
	onShowMore: (date: string, position?: PopoverTriggerPosition) => void
}

const CalendarMonthView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarMonthView>((props, ref) => {
	const {
		selectedDate,
		eventsViewType,
		reservations,
		shiftsTimeOffs,
		onEditEvent,
		onReservationClick,
		salonID,
		onShowMore,
		onEventChange,
		onEventChangeStart,
		virtualEvent,
		onAddEvent,
		setEventManagement,
		onEventChangeStop
	} = props

	const openingHours = useSelector((state: RootState) => state.selectedSalon.selectedSalon).data?.openingHours

	const dispatch = useDispatch()

	const events = useMemo(() => {
		const data = composeMonthViewEvents(eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION ? reservations : shiftsTimeOffs)
		// ak je virtualEvent definovany, zaradi sa do zdroja eventov pre Calendar
		return virtualEvent ? [...data, virtualEvent] : data
	}, [eventsViewType, reservations, shiftsTimeOffs, virtualEvent])

	const openingHoursMap = useMemo(() => getOpnenigHoursMap(openingHours), [openingHours])
	const businessHours = useMemo(() => getBusinessHours(openingHoursMap), [openingHoursMap])

	/**
	 * Spracuje input z calendara click/select a vytvori z neho init data, ktore vyuzije form v SiderEventManager
	 */
	const handleNewEvent = (event: DateSelectArg) => {
		// NOTE: ak by bol vytvoreny virualny event a pouzivatel vytvori dalsi tak predhadzajuci zmazat a vytvorit novy
		const eventStart = dayjs(event.startStr)
		dispatch(clearEvent())
		setEventManagement(undefined)

		onAddEvent({
			date: eventStart.format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: eventStart.format(DEFAULT_TIME_FORMAT),
			timeTo: dayjs(event.endStr).format(DEFAULT_TIME_FORMAT),
			employee: {
				value: '',
				key: '',
				label: ''
			}
		})
	}

	return (
		<div className={'nc-calendar-wrapper'}>
			<FullCalendar
				ref={ref}
				// plugins
				plugins={[interactionPlugin, scrollGrid, dayGridPlugin]}
				// settings
				schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
				timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
				slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				height={'auto'}
				headerToolbar={false}
				initialView={'dayGridMonth'}
				initialDate={selectedDate}
				eventMinHeight={15}
				editable
				selectable
				weekends
				stickyFooterScrollbar
				showNonCurrentDates
				firstDay={1}
				dayMaxEvents={5}
				dayMinWidth={120}
				eventOrderStrict
				eventOrder={eventOrder as any}
				selectConstraint={CALENDAR_COMMON_SETTINGS.SELECT_CONSTRAINT}
				// data sources
				events={events}
				businessHours={businessHours}
				// render hooks
				dayCellContent={(args: DayCellContentArg) => (
					<DayCellContent date={args.date} dayNumberText={args.dayNumberText} salonID={salonID} eventsViewType={eventsViewType} onShowMore={onShowMore} />
				)}
				dayHeaderContent={(args) => dayHeaderContent(args, openingHoursMap)}
				eventContent={(data) => eventContent(data, CALENDAR_VIEW.MONTH, onEditEvent, onReservationClick)}
				moreLinkContent={null}
				// handlers
				eventAllow={(dropInfo, movingEvent) => eventAllow(dropInfo, movingEvent, CALENDAR_VIEW.MONTH)}
				eventDrop={(arg) => {
					if (onEventChange) {
						onEventChange(CALENDAR_VIEW.MONTH, arg)
					}
				}}
				eventDragStart={() => onEventChangeStart && onEventChangeStart()}
				eventDragStop={onEventChangeStop}
				eventResizeStop={onEventChangeStop}
				select={handleNewEvent}
			/>
		</div>
	)
})

export default React.memo(CalendarMonthView, (prevProps, nextProps) => {
	if (nextProps.disableRender) {
		return true
	}
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
