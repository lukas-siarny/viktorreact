import React, { useMemo, FC, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import { DateSelectArg, DayCellContentArg, DayHeaderContentArg } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { t } from 'i18next'
import { CalendarEvent, ICalendarMonthlyReservationsPayload, ICalendarMonthlyViewEvent, ICalendarView, PopoverTriggerPosition } from '../../../../types/interfaces'

// enums
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_DAY_EVENTS_SHOWN,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	MONTHLY_RESERVATIONS_KEY
} from '../../../../utils/enums'
import {
	compareAndSortDayEvents,
	composeMonthViewAbsences,
	composeMonthViewReservations,
	getBusinessHours,
	getOpnenigHoursMap,
	OpeningHoursMap,
	compareMonthlyReservations
} from '../../calendarHelpers'
import { RootState } from '../../../../reducers'
import eventContent from '../../eventContent'

// assets
import { IVirtualEventPayload } from '../../../../reducers/virtualEvent/virtualEventActions'
import MonthlyReservationCard from '../eventCards/MonthlyReservationCard'

const getCurrentDayEventsCount = (selectedDate: string, dayEvents: (CalendarEvent | ICalendarMonthlyViewEvent)[], virtualEvent?: IVirtualEventPayload['data'] | null): number => {
	let eventsCount = dayEvents.reduce((count, event) => {
		// virtualny event odignorujeme, pretoze kolekcia
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
	return `Viac (${eventsCount})`
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
	onShowMore: (date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean) => void
	isReservationsView: boolean
}

const DayCellContent: FC<IDayCellContent> = (props) => {
	const { onShowMore, date, dayNumberText, isReservationsView } = props

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const dayEvents = useSelector((state: RootState) => state.calendar.dayEvents)
	const monthlyReservations = useSelector((state: RootState) => state.calendar[MONTHLY_RESERVATIONS_KEY])

	const cellDate = dayjs(date).format(CALENDAR_DATE_FORMAT.QUERY)

	const currentDayEvents = isReservationsView ? (monthlyReservations?.data || {})[cellDate] : dayEvents[cellDate]

	const dayNumerRef = useRef<HTMLSpanElement | null>(null)

	const eventsCount = getCurrentDayEventsCount(cellDate, currentDayEvents || [], isReservationsView ? undefined : virtualEvent)

	useEffect(() => {
		/**
		 * v tomto useEffecte sa vytvara custom "show more" button
		 * hlavne z optimalizacnych dovodov - kvoli odlachceniu DOMka sa do Fullcalendara neposielaju vsetky eventy, ale len tie, ktore je vidiet v zakladnom zobrazeni (momentalne 5 na den)
		 * ak ich je pre dany den viac ako poskytuje zobrazenie, zobrazi sa button "show more"
		 * fullcalendar sice poskytuje aj vlastny showMore button, avsak aby sa zobrazoval spravne, museli by sme do neho poslat vsetky eventy, ktore su potom aj vyrendrovane v DOMku (sice s visibility hidden, ale nody existuju)
		 * pri pridavani custom buttonu je potrebne, aby bol vytvoreny element <a> a mal priradene class='fc-daygrid-more-link fc-more-link'
		 * inak by pri kliku na tento element potom FC volal "select" Callback, takto ho odignoruje
		 */
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
							onShowMore(cellDate, position, isReservationsView)
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
	}, [eventsCount, cellDate, isReservationsView])

	return <span ref={dayNumerRef}>{dayNumberText}</span>
}

const eventOrder = (a: any, b: any) => {
	const aStart = a.eventData?.originalEvent?.startDateTime || a.eventData?.startDateTime
	const aEnd = a.eventData?.originalEvent?.endDateTime || a.eventData?.endDateTime
	const bStart = b.eventData?.originalEvent?.startDateTime || b.eventData?.startDateTime
	const bEnd = b.eventData?.originalEvent?.endDateTime || b.eventData?.endDateTime
	return compareAndSortDayEvents(aStart, aEnd, bStart, bEnd, a.id, b.id)
}

const reservationOrder = (a: any, b: any) => {
	const aIndex = a.eventData?.orderIndex || 0
	const bIndex = b.eventData?.orderIndex || 0
	return compareMonthlyReservations(aIndex, bIndex)
}

interface ICalendarMonthView extends Omit<ICalendarView, 'reservations'> {
	salonID: string
	onShowMore: (date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean) => void
	monthlyReservations: ICalendarMonthlyReservationsPayload['data']
}

const CalendarMonthView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarMonthView>((props, ref) => {
	const {
		selectedDate,
		monthlyReservations,
		eventsViewType,
		shiftsTimeOffs,
		onEditEvent,
		onReservationClick,
		salonID,
		onShowMore,
		onEventChange,
		onEventChangeStart,
		virtualEvent,
		onAddEvent,
		employees
	} = props

	const openingHours = useSelector((state: RootState) => state.selectedSalon.selectedSalon).data?.openingHours
	const isReservationsView = eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION

	const events = useMemo(() => {
		if (isReservationsView) {
			return composeMonthViewReservations(monthlyReservations, employees)
		}
		const data = composeMonthViewAbsences(shiftsTimeOffs)
		// ak je virtualEvent definovany, zaradi sa do zdroja eventov pre Calendar
		return virtualEvent ? [...data, virtualEvent] : data
	}, [isReservationsView, monthlyReservations, shiftsTimeOffs, virtualEvent, employees])

	const openingHoursMap = useMemo(() => getOpnenigHoursMap(openingHours), [openingHours])
	const businessHours = useMemo(() => getBusinessHours(openingHoursMap), [openingHoursMap])

	/**
	 * Spracuje input z calendara click/select a vytvori z neho init data, ktore vyuzije form v SiderEventManager
	 */
	const handleNewEvent = (event: DateSelectArg) => {
		// NOTE: ak by bol vytvoreny virualny event a pouzivatel vytvori dalsi tak predhadzajuci zmazat a vytvorit novy
		const eventStart = dayjs(event.startStr)

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
				editable={!isReservationsView}
				selectable={!isReservationsView}
				weekends
				stickyFooterScrollbar
				showNonCurrentDates
				firstDay={1}
				dayMaxEvents={5}
				dayMinWidth={120}
				eventOrderStrict
				eventOrder={isReservationsView ? reservationOrder : eventOrder}
				selectConstraint={CALENDAR_COMMON_SETTINGS.SELECT_CONSTRAINT}
				// data sources
				events={events}
				businessHours={businessHours}
				// render hooks
				dayCellContent={(args: DayCellContentArg) => (
					<DayCellContent date={args.date} dayNumberText={args.dayNumberText} salonID={salonID} isReservationsView={isReservationsView} onShowMore={onShowMore} />
				)}
				dayHeaderContent={(args) => dayHeaderContent(args, openingHoursMap)}
				eventContent={(data) =>
					isReservationsView ? (
						<MonthlyReservationCard eventData={data?.event?.extendedProps?.eventData} />
					) : (
						eventContent(data, CALENDAR_VIEW.MONTH, onEditEvent, onReservationClick)
					)
				}
				moreLinkContent={null}
				// handlers
				eventDrop={isReservationsView ? undefined : onEventChange}
				eventDragStart={isReservationsView ? undefined : onEventChangeStart}
				select={isReservationsView ? undefined : handleNewEvent}
			/>
		</div>
	)
})

export default React.memo(CalendarMonthView, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
