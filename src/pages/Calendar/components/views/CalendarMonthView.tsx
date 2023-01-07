import React, { useMemo, useCallback, FC, useRef, useEffect, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { DelimitedArrayParam, useQueryParams } from 'use-query-params'

// full calendar
import FullCalendar, { DayCellContentArg, DayHeaderContentArg, MoreLinkContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { t } from 'i18next'
import { Spin } from 'antd'
import { CalendarEvent, ICalendarDayEvents, ICalendarDayEventsMap, ICalendarEventContent, ICalendarView, PopoverTriggerPosition } from '../../../../types/interfaces'

// enums
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_DAY_EVENTS_SHOWN,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_DISPLAY_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW
} from '../../../../utils/enums'
import { composeMonthViewEvents, getBusinessHours, getOpnenigHoursMap, OpeningHoursMap } from '../../calendarHelpers'
import { RootState } from '../../../../reducers'
import eventContent from '../../eventContent'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down-currentColor-12.svg'
import { getDayDetialEvents } from '../../../../reducers/calendar/calendarActions'
import { ReactComponent as LoadingIcon } from '../../../../assets/icons/loading-icon.svg'

const getDayEventsMap = (dayEvents: ICalendarDayEvents): ICalendarDayEventsMap => {
	return Object.entries(dayEvents).reduce((dayEventsMap, [date, events]) => {
		return {
			...dayEventsMap,
			[date]: Math.max(events.length - CALENDAR_DAY_EVENTS_SHOWN, 0)
		}
	}, {} as ICalendarDayEventsMap)
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
	onShowMore: (date: string, data: CalendarEvent[], position?: PopoverTriggerPosition) => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const DayCellContent: FC<IDayCellContent> = memo((props) => {
	const { onShowMore, date, dayNumberText } = props

	const dayEvents = useSelector((state: RootState) => state.calendar.dayEvents)
	const dayEventsMap = useMemo(() => getDayEventsMap(dayEvents), [dayEvents])

	const cellDate = dayjs(date).format(CALENDAR_DATE_FORMAT.QUERY)
	const cellDateEvents = useMemo(() => dayEvents[cellDate], [dayEvents, cellDate])

	const dayNumerRef = useRef<HTMLSpanElement | null>(null)

	const eventsCount = dayEventsMap[cellDate]

	useEffect(() => {
		if (dayNumerRef.current) {
			const dayGridDayBottom = dayNumerRef.current.parentNode?.parentNode?.parentNode?.querySelector('.fc-daygrid-day-events')?.querySelector('.fc-daygrid-day-bottom')
			if (dayGridDayBottom) {
				/*
					const existingLink = dayGridDayBottom.querySelector('.nc-more-link')
					if (existingLink) {
						if (!eventsCount) {
							existingLink.remove()
						} else {
							const button = existingLink.querySelector('.nc-month-more-button')
							if (button) {
								button.innerHTML = getLinkMoreText(eventsCount)
							}
					}
				*/

				const existingButton = dayGridDayBottom.querySelector('.nc-month-more-button')
				if (existingButton) {
					if (!eventsCount) {
						existingButton.innerHTML = ''
						existingButton.classList.add('nc-month-more-button-hidden')
					} else {
						const textMore = existingButton.querySelector('.text-more')
						if (textMore) {
							textMore.innerHTML = getLinkMoreText(eventsCount)
							existingButton.classList.remove('nc-month-more-button-hidden')
						}
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
							onShowMore(cellDate, cellDateEvents, position)
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
					span.innerHTML = getLinkMoreText(eventsCount)

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
	}, [eventsCount, cellDate, cellDateEvents])

	return <span ref={dayNumerRef}>{dayNumberText}</span>
})

interface ICalendarMonthView extends ICalendarView {
	salonID: string
	onShowMore: (date: string, data: CalendarEvent[], position?: PopoverTriggerPosition) => void
}

const CalendarMonthView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarMonthView>((props, ref) => {
	const { selectedDate, eventsViewType, reservations, shiftsTimeOffs, onEditEvent, onReservationClick, salonID, onShowMore } = props

	const openingHours = useSelector((state: RootState) => state.selectedSalon.selectedSalon).data?.openingHours

	// const dispatch = useDispatch()

	const events = useMemo(() => {
		const data = composeMonthViewEvents(eventsViewType, reservations || [], shiftsTimeOffs)
		// ak je virtualEvent definovany, zaradi sa do zdroja eventov pre Calendar
		// return virtualEvent ? [...data, virtualEvent] : data
		return data
	}, [eventsViewType, reservations, shiftsTimeOffs])

	const openingHoursMap = useMemo(() => getOpnenigHoursMap(openingHours), [openingHours])
	const businessHours = useMemo(() => getBusinessHours(openingHoursMap), [openingHoursMap])

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
