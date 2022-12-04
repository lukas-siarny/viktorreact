/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import useResizeObserver from '@react-hook/resize-observer'

// full calendar
import FullCalendar, { EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
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

const resourceGroupLabelContent = () => {
	return (
		<>
			<div className={'nc-resource-group-label-bg'} />
			<div className={'nc-resource-group-label-content'} />
		</>
	)
}

const resourceGroupLaneContent = () => {
	return (
		<>
			<div className={'nc-resource-group-lane-bg'} />
			<div className={'nc-resource-group-lane-content'} />
		</>
	)
}

const resourceAreaColumns = [
	{
		field: 'day',
		headerContent: null,
		width: 55,
		cellContent: () => null
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

const createDayLabelElement = (resourceElemenet: HTMLElement, employeesLength: number) => {
	const td = document.createElement('td')
	td.setAttribute('rowspan', employeesLength.toString())
	td.setAttribute('style', 'position: relative; width: 1px;')

	const div = document.createElement('div')
	div.classList.add('nc-week-label-day')

	const { resourceId } = resourceElemenet.dataset || {}
	const date = resourceId?.split('_')[0]

	if (date) {
		div.setAttribute('name', date)

		if (dayjs(date).isToday()) {
			div.classList.add('is-today')
			div.setAttribute('id', getTodayLabelId(date))
		}

		const dayNumber = document.createElement('span')
		dayNumber.innerHTML = dayjs(date).format('D')

		const dayName = document.createElement('span')
		dayName.classList.add('day-name')
		dayName.innerHTML = dayjs(date).format('ddd')

		div.appendChild(dayNumber)
		div.appendChild(dayName)
		td.appendChild(div)
	}
	return td
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

	useEffect(() => {
		if (employees.length) {
			;(() =>
				setTimeout(() => {
					const dataGridBody = document.querySelector('.fc-datagrid-body')
					const rows = dataGridBody?.querySelectorAll('tr')
					rows?.forEach((row, i) => {
						if (i % (employees.length + 1) === 1) {
							row.classList.add('is-first-row')
							const resourceElemenet = row.querySelector('[data-resource-id]')
							const dayLabelAleradyExsit = !!row.children[2]

							if (resourceElemenet && resourceElemenet instanceof HTMLElement && !dayLabelAleradyExsit) {
								const resourceDayLabel = createDayLabelElement(resourceElemenet, employees.length)
								row.appendChild(resourceDayLabel)
							}
						}
					})
				}, 0))()
		}
	}, [employees.length, selectedDate])

	return (
		<div className={'nc-calendar-wrapper'} id={'nc-calendar-week-wrapper'}>
			<FullCalendar
				key={'nc-calendar-week'}
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
				resourceGroupField={'day'}
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
				resourceGroupLaneContent={resourceGroupLaneContent}
				resourceGroupLabelContent={resourceGroupLabelContent}
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
