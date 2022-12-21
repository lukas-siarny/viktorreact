import React, { useMemo, useCallback, FC, useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

// full calendar
import FullCalendar, { DayHeaderContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { t } from 'i18next'
import { ICalendarView } from '../../../../types/interfaces'

// enums
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'
import { composeMonthViewEvents, getBusinessHours, getOpnenigHoursMap, OpeningHoursMap } from '../../calendarHelpers'
import { RootState } from '../../../../reducers'

// components
import CalendarEventContent from '../CalendarEventContent'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down-currentColor-12.svg'

type DayEventsMap = {
	[key: string]: number
}

const dayEventsMapMockup = {
	'2022-12-01': 2,
	'2022-12-02': 2,
	'2022-12-03': 1,
	'2022-12-04': 2,
	'2022-12-05': 4,
	'2022-12-06': 0,
	'2022-12-07': 0,
	'2022-12-08': 3,
	'2022-12-09': 0,
	'2022-12-10': 3,
	'2022-12-11': 3,
	'2022-12-12': 0,
	'2022-12-13': 1,
	'2022-12-14': 2,
	'2022-12-15': 2,
	'2022-12-16': 0,
	'2022-12-17': 1,
	'2022-12-18': 1,
	'2022-12-19': 10,
	'2022-12-20': 15,
	'2022-12-21': 25,
	'2022-12-22': 6,
	'2022-12-23': 5,
	'2022-12-24': 5,
	'2022-12-25': 5,
	'2022-12-26': 5,
	'2022-12-27': 5,
	'2022-12-28': 5,
	'2022-12-29': 5,
	'2022-12-30': 5,
	'2022-12-31': 5
}

const dayHeaderContent = (arg: DayHeaderContentArg, openingHoursMap: OpeningHoursMap) => {
	const { date } = arg || {}
	const dayNumber = dayjs(date).day()
	return <div className={cx('nc-month-day-header', { shaded: !openingHoursMap[dayNumber] })}>{dayjs(date).format(CALENDAR_DATE_FORMAT.MONTH_HEADER_DAY_NAME)}</div>
}

const MoreLinkContent: FC<{ dayEventsMap: DayEventsMap }> = React.memo((props) => {
	const { dayEventsMap } = props

	const [cellDate, setCellDate] = useState<string | null>(null)
	const moreLinkRef = useRef<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (moreLinkRef.current) {
			const { date } = moreLinkRef.current.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.dataset || {}
			moreLinkRef.current?.parentElement?.setAttribute('title', '')
			if (date) {
				setCellDate(date)
				const eventsCount = dayEventsMap[date]
				const moreLink = moreLinkRef.current.querySelector('.text-more')
				if (moreLink) {
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
				console.log(cellDate)
			}}
			className={'fc-month-more-button'}
			ref={moreLinkRef}
		>
			<span className={'text-more'}>{t('loc:viac')}</span>
			<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
		</button>
	)
})

const moreLinkClick = () => 'day'

interface ICalendarMonthView extends ICalendarView {}

const CalendarMonthView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarMonthView>((props, ref) => {
	const { selectedDate, eventsViewType, reservations, shiftsTimeOffs, salonID, onEditEvent, onReservationClick } = props

	const openingHours = useSelector((state: RootState) => state.selectedSalon.selectedSalon).data?.openingHours

	// const dispatch = useDispatch()

	const events = useMemo(() => {
		const data = composeMonthViewEvents(eventsViewType, (reservations || []).slice(0, 150), shiftsTimeOffs)
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
				dayHeaderContent={(args) => dayHeaderContent(args, openingHoursMap)}
				eventContent={(data) => (
					<CalendarEventContent calendarView={CALENDAR_VIEW.MONTH} data={data} salonID={salonID} onEditEvent={onEditEvent} onReservationClick={onReservationClick} />
				)}
				moreLinkContent={() => <MoreLinkContent dayEventsMap={dayEventsMapMockup} />}
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
