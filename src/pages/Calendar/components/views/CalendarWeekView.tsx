/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo, useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import useResizeObserver from '@react-hook/resize-observer'
import Scroll, { Element } from 'react-scroll'

// full calendar
import FullCalendar, { CalendarApi, EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// components
import CalendarEventContent from '../CalendarEventContent'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'
import { composeWeekResources, composeWeekViewEvents, eventAllow } from '../../calendarHelpers'

// types
import { ICalendarView, IWeekViewResourceExtenedProps } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

const getTodayLabelId = (date: string | dayjs.Dayjs) => `${dayjs(date).format(CALENDAR_DATE_FORMAT.QUERY)}-is-today`

const resourceAreaColumns = [
	{
		group: true,
		field: 'day',
		headerContent: null,
		width: 55,
		cellContent: (args: any) => {
			const { groupValue, fieldValue } = args || {}

			// ked je len jeden zamestnanec tak to posiela fieldValue, ak viacero tak groupValue
			const date = groupValue || fieldValue

			const dayName = dayjs(date).format('ddd')
			const dayNumber = dayjs(date).format('D')
			const isToday = dayjs(date).isToday()

			return (
				<Element name={date} className={cx('nc-week-label-day', { 'is-today': isToday })} id={isToday ? getTodayLabelId(date) : undefined}>
					<span>{dayName}</span>
					{dayNumber}
				</Element>
			)
		}
	},
	{
		field: 'employee',
		headerContent: null,
		width: 145,
		cellContent: (args: any) => {
			const { resource } = args || {}
			const { eventBackgroundColor } = resource || {}
			const extendedProps = resource?.extendedProps as IWeekViewResourceExtenedProps
			const employee = extendedProps?.employee

			return (
				<div className={'nc-week-label-resource'}>
					<div className={'image'} style={{ backgroundImage: `url("${employee?.image}")`, borderColor: eventBackgroundColor }} />
					<span className={'info block text-xs font-normal min-w-0 truncate max-w-full'}>{employee?.name}</span>
					{employee?.isTimeOff && (
						<div className={'absence-icon'}>
							<AbsenceIcon />
						</div>
					)}
				</div>
			)
		}
	}
]

const LabelContent = React.memo(({ labelDate }: { labelDate: string }) => <div className={'nc-week-slot-label'}>{labelDate}</div>)

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { date } = data || {}

	return <LabelContent labelDate={dayjs(date).format('HH:mm')} />
}

const NowIndicator = () => {
	const [size, setSize] = useState<number>(0)
	const [indicatorDimmensions, setIndicatorDimmensions] = useState({
		top: 0,
		height: 0
	})

	const datagridBody = document.querySelector('.fc-datagrid-body')

	useResizeObserver(datagridBody as HTMLElement | null, (entry) => setSize(entry.contentRect.height))

	useEffect(() => {
		const todayLabel = document.getElementById(getTodayLabelId(dayjs()))
		if (todayLabel) {
			const top = todayLabel?.parentElement?.parentElement?.parentElement?.parentElement?.offsetTop as number
			const height = todayLabel?.clientHeight
			setIndicatorDimmensions({ top, height })
		}
	}, [size])

	return <div className={'fc-week-now-indicator'} style={{ top: indicatorDimmensions.top, height: indicatorDimmensions.height }} />
}

interface ICalendarWeekView extends ICalendarView {
	updateCalendarSize: () => void
	weekDays: string[]
}

const CalendarWeekView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarWeekView>((props, ref) => {
	const { salonID, selectedDate, eventsViewType, shiftsTimeOffs, reservations, employees, onEditEvent, onEventChange, refetchData, weekDays, updateCalendarSize } = props

	const events = useMemo(
		() => composeWeekViewEvents(selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees),
		[selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees]
	)
	const resources = useMemo(() => composeWeekResources(weekDays, shiftsTimeOffs, employees), [weekDays, shiftsTimeOffs, employees])

	return (
		<div className={'nc-calendar-wrapper'} id={'nc-calendar-week-wrapper'}>
			<FullCalendar
				ref={ref}
				// plugins
				plugins={[interactionPlugin, scrollGrid, resourceTimelinePlugin]}
				// settings
				schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
				timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
				slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
				slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
				fixedMirrorParent={CALENDAR_COMMON_SETTINGS.FIXED_MIRROR_PARENT}
				eventConstraint={CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT}
				scrollTimeReset={false}
				height='auto'
				slotMinWidth={25} // ak sa zmeni tato hodnota, je potrebne upravit min-width v _calendar.sass => .nc-week-event
				eventMinWidth={25}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={selectedDate}
				weekends={true}
				editable
				selectable
				stickyFooterScrollbar
				nowIndicator
				// data sources
				events={events}
				resources={resources}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				slotLabelContent={slotLabelContent}
				eventContent={(data: EventContentArg) => (
					<CalendarEventContent calendarView={CALENDAR_VIEW.WEEK} data={data} salonID={salonID} onEditEvent={onEditEvent} refetchData={refetchData} />
				)}
				nowIndicatorContent={() => <NowIndicator />}
				// handlers
				eventAllow={eventAllow}
				eventDrop={(arg) => onEventChange(CALENDAR_VIEW.WEEK, arg)}
				eventResize={(arg) => onEventChange(CALENDAR_VIEW.WEEK, arg)}
				resourcesSet={() => setTimeout(updateCalendarSize, 0)}
				eventsSet={() => setTimeout(updateCalendarSize, 0)}
			/>
		</div>
	)
})

export default React.memo(CalendarWeekView, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
