/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { compose } from 'redux'
import { uniqueId } from 'lodash'

// big calendar
import { Calendar, dateFnsLocalizer, NavigateAction, View, Views } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import cs from 'date-fns/locale/cs'
import addHours from 'date-fns/addHours'
import startOfHour from 'date-fns/startOfHour'

import { PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// assets
import Avatar from '../../assets/images/avatar.png'

// utils

const EMPLOYEES = [
	{
		id: '1',
		name: 'Tadej Pogacar',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#2EAF00'
	},
	{
		id: '2',
		name: 'Primoz Roglic',
		times: '8:00 - 11:00, 12:00 - 18:00',
		image: Avatar,
		color: '#4656E6'
	},
	{
		id: '3',
		name: 'Egan Bernal',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#DC7C0C'
	},
	{
		id: '4',
		name: 'Remco Evenpoel',
		times: '8:00 - 12:00, 13:00 - 16:00',
		image: Avatar,
		color: '#FF5353'
	},
	{
		id: '5',
		name: 'Alechandro Valverde',
		times: 'Time off',
		image: Avatar,
		color: '#000'
	}
]

const INITIAL_CALENDAR_STATE = {
	events: [
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Janice Runolfsson',
			start: new Date(2022, 9, 4, 9, 0, 0),
			end: new Date(2022, 9, 4, 11, 0, 0),
			allDay: false,
			description: 'Woman’s cut + Styling',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Vincent Oberbrunner',
			start: new Date(2022, 9, 4, 12, 0, 0),
			end: new Date(2022, 9, 4, 13, 0, 0),
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Dianna Harris',
			start: new Date(2022, 9, 4, 13, 0, 0),
			end: new Date(2022, 9, 4, 9, 17, 0),
			allDay: false,
			description: 'Woman’s cut + Balayage',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: new Date(2022, 9, 4, 8, 0, 0),
			end: new Date(2022, 9, 4, 4, 0, 0),
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Albert Emmerich',
			start: new Date(2022, 9, 4, 9, 0, 0),
			end: new Date(2022, 9, 4, 10, 0, 0),
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Luther Skiles',
			start: new Date(2022, 9, 4, 14, 0, 0),
			end: new Date(2022, 9, 4, 15, 0, 0),
			allDay: false,
			description: 'Man’s cut with washing and styling',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: new Date(2022, 9, 4, 15, 0, 0),
			end: new Date(2022, 9, 4, 16, 30, 0),
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: new Date(2022, 9, 4, 15, 0, 0),
			end: new Date(2022, 9, 4, 18, 30, 0),
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		}
	],
	backgroundEvents: [
		{
			resourceId: EMPLOYEES[0].id,
			start: new Date(2022, 9, 4, 9, 0, 0),
			end: new Date(2022, 9, 4, 10, 0, 0),
			backgroundColor: '#000'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: new Date(2022, 9, 4, 10, 0, 0),
			end: new Date(2022, 9, 4, 11, 0, 0),
			backgroundColor: '#000'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: new Date(2022, 9, 4, 11, 0, 0),
			end: new Date(2022, 9, 4, 9, 12, 0),
			backgroundColor: '#000'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: new Date(2022, 9, 4, 8, 0, 0),
			end: new Date(2022, 9, 4, 11, 0, 0),
			backgroundColor: '#000'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: new Date(2022, 9, 4, 12, 0, 0),
			end: new Date(2022, 9, 4, 18, 0, 0),
			backgroundColor: '#000'
		},
		// backgroundEvents - timeOff
		{
			resourceId: EMPLOYEES[2].id,
			start: new Date(2022, 9, 4, 0, 0, 0),
			end: new Date(2022, 9, 4, 23, 0, 0),
			backgroundColor: '#DC0069'
		}
	],
	resources: [
		{ id: EMPLOYEES[0].id, resourceTitle: EMPLOYEES[0].name, employeeData: EMPLOYEES[0] },
		{ id: EMPLOYEES[1].id, resourceTitle: EMPLOYEES[1].name, employeeData: EMPLOYEES[1] },
		{ id: EMPLOYEES[2].id, resourceTitle: EMPLOYEES[2].name, employeeData: EMPLOYEES[2] },
		{ id: EMPLOYEES[3].id, resourceTitle: EMPLOYEES[3].name, employeeData: EMPLOYEES[3] },
		{ id: EMPLOYEES[4].id, resourceTitle: EMPLOYEES[4].name, employeeData: EMPLOYEES[4] }
	]
}

const locales = {
	cs
}
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1)
const now = new Date()
const start = endOfHour(now)
const end = addHours(start, 2)
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales
})

// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

const CustomEvent = (eventInfo: any) => {
	console.log({ eventInfo })

	return (
		<div className={'bg-notino-black'}>
			<div className={''}>{eventInfo.title}</div>
		</div>
	)
}

const Calendar3 = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [calendarStore, setCalendarStore] = useState<any>(INITIAL_CALENDAR_STATE)
	const [calendarView, setCalendarView] = useState<View>(Views.DAY)

	const { defaultDate, views } = useMemo(
		() => ({
			defaultDate: new Date(2022, 9, 4),
			views: ['day', 'week', 'month']
		}),
		[]
	)

	const handleViewChange = (newView: View) => {
		// fetch new data
		// set new events
		// set new view
		setCalendarView(newView)
	}

	const handleNavigateChange = (newDate: Date, view: View, action: NavigateAction) => {
		// fetch new data
		// set new events
		// set new date
		console.log({ newDate, view, action })
	}

	const handleRangeChange = (
		range:
			| Date[]
			| {
					start: Date
					end: Date
			  },
		view?: View | undefined
	) => {
		// fetch new data
		// set new events
		// set new date
		console.log({ range, view })
	}

	const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
		const { start: eventStart, end: eventEnd } = data

		setCalendarStore((currentEvents: any) => {
			const firstEvent = {
				start: new Date(eventStart),
				end: new Date(eventEnd)
			}
			return { ...currentEvents, evnets: [firstEvent, ...currentEvents.events] }
		})
	}

	const onEventDrop: withDragAndDropProps['onEventDrop'] = (data) => {
		console.log(data)
	}

	return (
		<div className='bg-notino-white'>
			<DnDCalendar
				components={{
					day: {
						event: CustomEvent
					}
				}}
				defaultDate={defaultDate}
				localizer={localizer}
				onNavigate={handleNavigateChange}
				onRangeChange={handleRangeChange}
				view={calendarView}
				onView={handleViewChange}
				events={calendarStore.events}
				backgroundEvents={calendarStore.backgroundEvents}
				resources={calendarStore.resources}
				resourceIdAccessor={(resource: any) => resource.id}
				resourceTitleAccessor={(resource: any) => resource.resourceTitle}
				defaultView='day'
				views={['day', 'work_week', 'month']}
				onEventDrop={onEventDrop}
				onEventResize={onEventResize}
				resizable
				selectable
				style={{ height: 'auto', minHeight: '100vh' }}
			/>
		</div>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar3)
