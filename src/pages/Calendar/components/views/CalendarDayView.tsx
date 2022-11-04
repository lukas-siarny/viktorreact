import React, { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'

// full calendar
import FullCalendar, { EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE, CALENDAR_EVENT_TYPE_FILTER } from '../../../../utils/enums'
import { composeDayEventResources, composeDayViewEvents, getHoursMinutesFromMinutes } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon-16.svg'
import { RootState } from '../../../../reducers'

const renderEventContent = (data: EventContentArg, eventType: CALENDAR_EVENT_TYPE_FILTER) => {
	const { event, timeText } = data || {}
	const { extendedProps } = event || {}

	// console.log({ event, timeText, extendedProps })

	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

	if (event.display === 'background') {
		return (
			<div
				className={cx('nc-bg-event', {
					break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
				})}
			/>
		)
	}

	const diff = dayjs(event.end).diff(event.start, 'minutes')

	return (
		<div
			className={cx('nc-day-event', {
				reservation: extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION,
				shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'min-15': Math.abs(diff) <= 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 15
			})}
		>
			{(() => {
				if (eventType === CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF) {
					return (
						<div className={'event-content'}>
							<div className={'flex gap-1 justify-between min-w-0'}>
								<div className={'flex gap-1 min-w-0'}>
									<div className={'avatar w-4 h-4 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.employee?.image}")` }} />
									<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
								</div>
								<span className={'duration'}>{getHoursMinutesFromMinutes(diff)}</span>
							</div>
							<span className={'time'}>{timeText}</span>
						</div>
					)
				}

				if (eventType === CALENDAR_EVENT_TYPE_FILTER.RESERVATION) {
					return (
						<>
							<div className={'event-accent'} style={{ backgroundColor: extendedProps.employee?.color }} />
							<div className={'event-background'} style={{ backgroundColor: extendedProps.employee?.color }} />
							<div className={'event-content'}>
								<div className={'flex flex-col gap-1'}>
									<span className={'time'}>{timeText}</span>
									<span className={'title'}>{extendedProps.customer?.name}</span>
									<span className={'desc'}>{extendedProps.service?.name}</span>
								</div>
								<div className={'service-icon'} style={{ backgroundImage: `url("${extendedProps.service?.icon}")` }} />
							</div>
						</>
					)
				}

				return null
			})()}
		</div>
	)
}

const resourceLabelContent = (data: any) => {
	const extendedProps = data?.resource.extendedProps || {}

	console.log(data)

	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.image}")` }} />
			<div className={'info flex flex-col justify-start text-xs font-normal min-w-0'}>
				<span className={'name'}>{extendedProps.name}</span>
				<span className={'description'}>{extendedProps.wokringHours}</span>
			</div>
			{extendedProps.isTimeOff && (
				<div className={'absence-icon'}>
					<AbsenceIcon />
				</div>
			)}
		</div>
	)
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format('HH:mm')}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView: FC<ICalendarDayView> = (props) => {
	const { selectedDate, eventType, reservations, shiftsTimeOffs, employees } = props

	const isSiderCollapsed = useSelector((state: RootState) => state.settings.isSiderCollapsed)

	const [t] = useTranslation()

	const handleDateClick = (arg: DateClickArg) => {
		// console.log({ arg })
	}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info
	}

	const calendarRef = useRef<any>()

	useEffect(() => {
		// je potrebne pockat kym skonci animacia pri zasuvani menu a az potom updatetnut velkost
		const calendarApi = calendarRef.current.getApi()
		setTimeout(() => calendarApi.updateSize(), 300)
	}, [isSiderCollapsed])

	return (
		<FullCalendar
			ref={calendarRef}
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
			height='100%'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={selectedDate}
			scrollTime={CALENDAR_COMMON_SETTINGS.SCROLL_TIME}
			slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
			slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
			dayMinWidth={200}
			editable
			selectable
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			// data sources
			events={composeDayViewEvents(selectedDate, eventType, reservations, shiftsTimeOffs, employees)}
			resources={composeDayEventResources(shiftsTimeOffs, employees)}
			// render hooks
			resourceLabelContent={resourceLabelContent}
			eventContent={(args) => renderEventContent(args, eventType)}
			slotLabelContent={slotLabelContent}
			// handlers
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
}

export default CalendarDayView
