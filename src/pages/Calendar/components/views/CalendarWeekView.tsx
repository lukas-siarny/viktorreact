/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import useResizeObserver from '@react-hook/resize-observer'
import { useDispatch } from 'react-redux'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import { DateSelectArg, EventContentArg, SlotLabelContentArg } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// components
import CalendarEventContent from '../CalendarEventContent'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW, DEFAULT_TIME_FORMAT } from '../../../../utils/enums'
import { composeWeekResources, composeWeekViewEvents, getWeekDayResourceID } from '../../calendarHelpers'
import { getDateTime } from '../../../../utils/helper'

// types
import { ICalendarView, IWeekViewResourceExtenedProps } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'
import { clearEvent } from '../../../../reducers/virtualEvent/virtualEventActions'

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
		headerContent: <span />, // NOTE: do not delete this - calendar header won't render correctly without this
		width: 55,
		cellContent: <span /> // NOTE: do not delete this - calendar header won't render correctly without this
	},
	{
		field: 'employee',
		headerContent: <span />, // NOTE: do not delete this - calendar header won't render correctly without this
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
		setTimeout(() => {
			const todayLabel = document.getElementById(getTodayLabelId(dayjs()))

			if (todayLabel) {
				const top = todayLabel?.parentElement?.parentElement?.offsetTop as number
				const height = todayLabel?.clientHeight
				setIndicatorDimmensions({ top, height })
			}
		}, 0)
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
	const {
		salonID,
		selectedDate,
		eventsViewType,
		shiftsTimeOffs,
		reservations,
		employees,
		onEditEvent,
		onReservationClick,
		onEventChange,
		weekDays,
		updateCalendarSize,
		onAddEvent,
		virtualEvent,
		setEventManagement,
		enabledSalonReservations,
		onEventChangeStart,
		onEventChangeStop
	} = props

	const dispatch = useDispatch()
	const events = useMemo(() => {
		const data = composeWeekViewEvents(selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees)

		if (virtualEvent) {
			const { eventData, ...otherProps } = virtualEvent
			// pre WeekView sa musi resourceId upravit do tvaru Date_ResourceID, lebo skrz tieto ID su mapovane eventy do prislusnych dni
			const resourceId = getWeekDayResourceID(virtualEvent.resourceId as string, eventData.date)

			// NOTE: start a end na root urovni su vzdy rovnakeho datumu, lebo Week View je v podstate Daily View (inak vyskladane).
			// Pozor! Tieto hodnoty su iba pre ucely FullCalendar, aby vedel korektne vyrenderovat eventy. Realne datumy (zobrazene aj v SiderForme) odpovedaju hodnotam v evenData: date, startDateTime, endDateTime, start, end
			const newEvent = {
				...otherProps,
				eventData: {
					...eventData,
					resourceId
				},
				resourceId,
				start: getDateTime(selectedDate, eventData.start.time),
				end: getDateTime(selectedDate, eventData.end.time)
			}

			return [...data, newEvent]
		}

		return data
	}, [selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees, virtualEvent])

	const handleNewEvent = (event: DateSelectArg) => {
		// NOTE: ak by bol vytvoreny virualny event a pouzivatel vytvori dalsi tak predhadzajuci zmazat a vytvorit novy
		dispatch(clearEvent())
		setEventManagement(undefined)

		if (event.resource) {
			// eslint-disable-next-line no-underscore-dangle
			const { day, employee } = event.resource._resource.extendedProps

			// korektny datum, na ktory prislucha dany event sa zoberie z EventData - suvis s logikou popisanou v commente vyssie L:172
			onAddEvent({
				date: day,
				timeFrom: dayjs(event.startStr).format(DEFAULT_TIME_FORMAT),
				timeTo: dayjs(event.endStr).format(DEFAULT_TIME_FORMAT),
				employee: {
					value: employee.id,
					key: employee.id,
					label: employee.name
				}
			})
		}
	}

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
							const alreadyExistingDayLabel = row.children[2]

							if (alreadyExistingDayLabel) {
								alreadyExistingDayLabel.setAttribute('rowspan', employees.length.toString())
							} else if (resourceElemenet && resourceElemenet instanceof HTMLElement) {
								const resourceDayLabel = createDayLabelElement(resourceElemenet, employees.length)
								row.appendChild(resourceDayLabel)
							}
						} else if (row.classList.contains('is-first-row')) {
							row.classList.remove('is-first-row')
							const alreadyExistingDayLabel = row.children[2]
							if (alreadyExistingDayLabel) {
								alreadyExistingDayLabel.remove()
							}
						}
					})
				}, 0))()
		}
	}, [employees.length, selectedDate])

	useEffect(() => {
		// NOTE: ak neni je povoleny online booking tak sa nastavi disabled state nad kalendarom
		if (!enabledSalonReservations) {
			const body = document.getElementsByClassName('fc-timeline-body')[0]
			body.classList.add('active')
		}
	}, [enabledSalonReservations])

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
				resourceGroupField={'day'}
				height='auto'
				slotMinWidth={25} // ak sa zmeni tato hodnota, je potrebne upravit min-width v _calendar.sass => .nc-week-event
				eventMinWidth={25}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={selectedDate}
				editable={enabledSalonReservations}
				weekends
				stickyFooterScrollbar
				nowIndicator
				selectable={enabledSalonReservations}
				// data sources
				events={events}
				resources={resources}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				resourceGroupLaneContent={resourceGroupLaneContent}
				resourceGroupLabelContent={resourceGroupLabelContent}
				slotLabelContent={slotLabelContent}
				eventContent={(data: EventContentArg) => (
					<CalendarEventContent calendarView={CALENDAR_VIEW.WEEK} data={data} salonID={salonID} onEditEvent={onEditEvent} onReservationClick={onReservationClick} />
				)}
				nowIndicatorContent={() => <NowIndicator />}
				// handlers
				eventDrop={onEventChange}
				eventResize={onEventChange}
				eventDragStart={onEventChangeStart}
				eventResizeStart={onEventChangeStart}
				eventDragStop={onEventChangeStop}
				eventResizeStop={onEventChangeStop}
				select={(selectedEvent) => handleNewEvent(selectedEvent)}
				resourcesSet={() => setTimeout(updateCalendarSize, 0)}
				eventsSet={() => {
					setTimeout(() => {
						updateCalendarSize()
					}, 0)
				}}
			/>
		</div>
	)
})

export default React.memo(CalendarWeekView, (prevProps, nextProps) => {
	if (nextProps.disableRender) {
		return true
	}
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
