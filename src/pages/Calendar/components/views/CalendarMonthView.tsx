import React, { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

// full calendar
import FullCalendar, { DayHeaderContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import dayjs from 'dayjs'
import { ICalendarView } from '../../../../types/interfaces'

// enums
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'
import { composeMonthViewEvents, getBusinessHours, getOpnenigHoursMap, OpeningHoursMap } from '../../calendarHelpers'
import { RootState } from '../../../../reducers'
import CalendarEventContent from '../CalendarEventContent'

const dayHeaderContent = (data: DayHeaderContentArg, openingHoursMap: OpeningHoursMap) => {
	const { date } = data || {}
	const dayNumber = dayjs(date).day()
	return <div className={cx('nc-month-day-header', { shaded: !openingHoursMap[dayNumber] })}>{dayjs(date).format(CALENDAR_DATE_FORMAT.MONTH_HEADER_DAY_NAME)}</div>
}

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
				dayMinWidth={50}
				// data sources
				events={events}
				businessHours={businessHours}
				// render hooks
				dayHeaderContent={(args) => dayHeaderContent(args, openingHoursMap)}
				eventContent={(data) => (
					<CalendarEventContent calendarView={CALENDAR_VIEW.MONTH} data={data} salonID={salonID} onEditEvent={onEditEvent} onReservationClick={onReservationClick} />
				)}
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
