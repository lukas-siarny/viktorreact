import React, { useMemo, FC, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import dayjs from 'dayjs'
import i18next from 'i18next'

// full calendar
import FullCalendar, { DateSelectArg, DayCellContentArg, DayHeaderContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import {
	CalendarEvent,
	EmployeeTooltipPopoverData,
	ICalendarMonthlyReservationsPayload,
	ICalendarMonthlyViewEvent,
	ICalendarView,
	PopoverTriggerPosition
} from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'
import { IVirtualEventPayload } from '../../../../reducers/virtualEvent/virtualEventActions'

// enums
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_DAY_EVENTS_SHOWN,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	MONTHLY_RESERVATIONS_KEY
} from '../../../../utils/enums'

// utils
import {
	compareAndSortDayEvents,
	composeMonthViewAbsences,
	composeMonthViewReservations,
	getBusinessHours,
	getOpnenigHoursMap,
	OpeningHoursMap,
	compareMonthlyReservations
} from '../../calendarHelpers'
import eventContent from '../../eventContent'

// components
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
	return `${i18next.t('loc:Viac')} (${eventsCount})`
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
		 * hlavne z optimalizacnych dovodov - kvoli odlachceniu DOMka sa do Fullcalendara neposielaju vsetky eventy, ale len tie, ktore je vidiet v zakladnom zobrazeni (momentalne 5 na den) + v pripade ze je povoleny DND (teda u nas pri zmenach), tak este o jeden naviac (samozrejmel len ak ich je v dany den viac ako 5), ktory sa po presune nejakeho eventu na iny den posunie na jeho miesto
		 * ak ich je pre dany den viac ako poskytuje zobrazenie, zobrazi sa button "show more"
		 * fullcalendar sice poskytuje aj vlastny showMore button, avsak aby sa zobrazoval spravne, museli by sme do neho poslat vsetky eventy, ktore su potom aj vyrendrovane v DOMku (sice s visibility hidden, ale nody existuju)
		 * pri pridavani custom buttonu je potrebne, aby bol vytvoreny element <a> a mal priradene class='fc-daygrid-more-link fc-more-link'
		 * inak by pri kliku na tento element potom FC volal "select" Callback, takto ho odignoruje
		 */
		if (dayNumerRef.current) {
			const dayGridDayBottom = dayNumerRef.current.parentNode?.parentNode?.parentNode?.querySelector('.fc-daygrid-day-events')?.querySelector('.fc-daygrid-day-bottom')
			const handleShowMore = (clientRect: DOMRect) => {
				if (cellDate && clientRect) {
					const position: PopoverTriggerPosition = {
						top: clientRect.top,
						left: clientRect.left,
						width: clientRect.width + 20,
						height: clientRect.bottom - clientRect.top
					}
					onShowMore(cellDate, position, isReservationsView)
				}
			}
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
						existingButton.addEventListener('click', () => {
							const clientRect = existingButton.getBoundingClientRect()
							handleShowMore(clientRect)
						})
					}
				} else if (eventsCount) {
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
	}, [eventsCount, cellDate, isReservationsView, onShowMore])

	return <span ref={dayNumerRef}>{dayNumberText}</span>
}

const eventOrder = (a: any, b: any) => {
	const aData = {
		start: a.eventData?.originalEvent?.startDateTime || a.eventData?.startDateTime,
		end: a.eventData?.originalEvent?.endDateTime || a.eventData?.endDateTime,
		id: a.id,
		employeeId: a.eventData?.employee.id,
		eventType: a.eventData?.eventType as CALENDAR_EVENT_TYPE,
		orderIndex: a.eventData?.employee.orderIndex
	}
	const bData = {
		start: b.eventData?.originalEvent?.startDateTime || b.eventData?.startDateTime,
		end: b.eventData?.originalEvent?.endDateTime || b.eventData?.endDateTime,
		id: b.eventData?.id,
		employeeId: b.eventData?.employee.id,
		eventType: b.eventData?.eventType as CALENDAR_EVENT_TYPE,
		orderIndex: b.eventData?.employee.orderIndex
	}

	return compareAndSortDayEvents(aData, bData)
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
	onMonthlyReservationClick: (data: EmployeeTooltipPopoverData, position?: PopoverTriggerPosition) => void
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
		onMonthlyReservationClick,
		enabledSalonReservations
	} = props

	const openingHours = useSelector((state: RootState) => state.selectedSalon.selectedSalon).data?.openingHours
	const isReservationsView = eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION

	const events = useMemo(() => {
		if (isReservationsView) {
			return composeMonthViewReservations(monthlyReservations)
		}
		const data = composeMonthViewAbsences(shiftsTimeOffs)
		// ak je virtualEvent definovany, zaradi sa do zdroja eventov pre Calendar
		return virtualEvent ? [...data, virtualEvent] : data
	}, [isReservationsView, monthlyReservations, shiftsTimeOffs, virtualEvent])

	const openingHoursMap = useMemo(() => getOpnenigHoursMap(openingHours), [openingHours])
	const businessHours = useMemo(() => getBusinessHours(openingHoursMap), [openingHoursMap])

	/**
	 * Spracuje input z calendara click/select a vytvori z neho init data, ktore vyuzije form v SiderEventManager
	 */
	const handleNewEvent = (event: DateSelectArg) => {
		const eventStart = dayjs(event.startStr)
		onAddEvent({
			date: eventStart.format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: dayjs().format(DEFAULT_TIME_FORMAT),
			timeTo: dayjs().add(1, 'hours').format(DEFAULT_TIME_FORMAT),
			employee: {
				value: '',
				key: '',
				label: ''
			}
		})
	}

	useEffect(() => {
		// NOTE: ak neni je povoleny online booking tak sa nastavi disabled state nad kalendarom
		if (!enabledSalonReservations) {
			const body = document.getElementsByClassName('fc-daygrid-body')[0]
			body.classList.add('active')
		}
	}, [enabledSalonReservations])

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
				editable={!isReservationsView && enabledSalonReservations}
				selectable={!isReservationsView && enabledSalonReservations}
				weekends
				stickyFooterScrollbar
				showNonCurrentDates
				firstDay={1}
				dayMaxEvents={5}
				dayMinWidth={120}
				eventOrderStrict
				eventOrder={isReservationsView ? (reservationOrder as any) : (eventOrder as any)}
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
						<MonthlyReservationCard
							date={dayjs(data.event.start).format(CALENDAR_DATE_FORMAT.QUERY)}
							eventData={data?.event?.extendedProps?.eventData}
							onMonthlyReservationClick={onMonthlyReservationClick}
						/>
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
