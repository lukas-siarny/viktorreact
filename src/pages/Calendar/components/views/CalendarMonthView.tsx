import React, { useMemo, useCallback, FC, useRef, useEffect, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { DelimitedArrayParam, useQueryParams } from 'use-query-params'

// full calendar
import FullCalendar, { DayHeaderContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { t } from 'i18next'
import { Spin } from 'antd'
import { CalendarEvent, ICalendarDayEvents, ICalendarDayEventsMap, ICalendarEventContent, ICalendarView, PopoverTriggerPosition } from '../../../../types/interfaces'

// enums
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_DISPLAY_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'
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
			[date]: events.length
		}
	}, {} as ICalendarDayEventsMap)
}

const dayHeaderContent = (arg: DayHeaderContentArg, openingHoursMap: OpeningHoursMap) => {
	const { date } = arg || {}
	const dayNumber = dayjs(date).day()
	return <div className={cx('nc-month-day-header', { shaded: !openingHoursMap[dayNumber] })}>{dayjs(date).format(CALENDAR_DATE_FORMAT.MONTH_HEADER_DAY_NAME)}</div>
}

interface IMoreLinkContent {
	salonID: string
	onShowMore: (date: string, data: CalendarEvent[], position?: PopoverTriggerPosition) => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const MoreLinkContent: FC<IMoreLinkContent> = memo((props) => {
	const { salonID, onShowMore, eventsViewType } = props
	const dispatch = useDispatch()
	const dayEvents = useSelector((state: RootState) => state.calendar.dayEvents)
	const dayEventsMap = useMemo(() => getDayEventsMap(dayEvents), [dayEvents])

	const [query] = useQueryParams({
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam
	})

	const [cellDate, setCellDate] = useState<string | null>(null)
	const [isFetching, setIsFetching] = useState(false)

	const moreLinkRef = useRef<HTMLButtonElement | null>(null)

	const dayDetilEvents = useSelector((state: RootState) => state.calendar.dayDetail)

	/* const handleShowMore = useCallback(async () => {
		if (cellDate) {
			try {
				setIsFetching(true)
				const { data } = await dispatch(
					getDayDetialEvents(cellDate, {
						salonID,
						categoryIDs: query.categoryIDs,
						employeeIDs: query.employeeIDs,
						eventTypes: [
							eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION
								? CALENDAR_EVENT_TYPE.RESERVATION
								: (CALENDAR_EVENT_TYPE.RESERVATION, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK)
						]
					})
				)
				console.log({ data })
			} catch (e) {
				// eslint-disable-next-line no-console
				console.log(e)
			} finally {
				setIsFetching(false)
			}
		}
	}, [cellDate, dispatch, query.categoryIDs, query.employeeIDs, eventsViewType, salonID]) */

	const handleShowMore = useCallback(async () => {
		if (cellDate && moreLinkRef.current) {
			const currentDateEvents = dayEvents[cellDate]

			const clientRect = moreLinkRef.current.getBoundingClientRect()

			const position: PopoverTriggerPosition = {
				top: clientRect.top,
				left: clientRect.left,
				width: clientRect.width + 10,
				height: clientRect.bottom - clientRect.top
			}
			onShowMore(cellDate, currentDateEvents, position)
		}
	}, [cellDate, dayEvents, onShowMore])

	useEffect(() => {
		if (moreLinkRef.current) {
			const { date } = moreLinkRef.current.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.dataset || {}
			moreLinkRef.current?.parentElement?.setAttribute('title', '')
			if (date) {
				setCellDate(date)
				/* const eventsCount = dayEventsMap[date]
				const moreLink = moreLinkRef.current.querySelector('.text-more')
				if (moreLink) {
					moreLink.innerHTML = `${eventsCount} ${t('loc:viac')}`
				} */
				const eventsCount = dayEventsMap[date]
				const moreLink = moreLinkRef.current.querySelector('.text-more')
				if (moreLink && eventsCount) {
					moreLink.innerHTML = `${eventsCount} ${t('loc:viac')}`
				}
			}
		}
	}, [dayEventsMap])

	return (
		<button
			type={'button'}
			onClick={(e) => {
				e.stopPropagation()
				handleShowMore()
			}}
			className={'fc-month-more-button'}
			ref={moreLinkRef}
			disabled={dayDetilEvents?.isLoading}
		>
			<Spin spinning={isFetching} size={'small'}>
				<span className={'text-more'}>{t('loc:viac')}</span>
				<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
			</Spin>
		</button>
	)
})

const moreLinkClick = () => 'day'

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
				dayCellContent={<div>daycell</div>}
				dayHeaderContent={(args) => dayHeaderContent(args, openingHoursMap)}
				eventContent={(data) => eventContent(data, CALENDAR_VIEW.MONTH, onEditEvent, onReservationClick)}
				moreLinkContent={() => <MoreLinkContent salonID={salonID} eventsViewType={eventsViewType} onShowMore={onShowMore} />}
				// handlers
				moreLinkClick={moreLinkClick}
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
