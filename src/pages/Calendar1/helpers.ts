import { ICalendarTimeOffPayload, ICalendarShiftsPayload, ICalendarEmployeesPayload, ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'

interface IComposeEventsArgs {
	events?: ICalendarEventsPayload['data']
	employees?: ICalendarEmployeesPayload['data']
	services?: ICalendarEmployeesPayload['data']
	shifts?: ICalendarTimeOffPayload['data']
	timeOff?: ICalendarShiftsPayload['data']
}

interface IComposeBackgroundEventsArgs {
	shifts?: ICalendarTimeOffPayload['data']
	timeOff?: ICalendarShiftsPayload['data']
	employees?: ICalendarEmployeesPayload['data']
}

export const composeEvents = ({ events, employees, services, shifts, timeOff }: IComposeEventsArgs) => {
	return events?.map((calendarEvent) => {
		const employee = employees?.find((e) => calendarEvent.employeeId === e.id)
		const service = services?.find((s) => calendarEvent.serviceID === s.id)
		return {
			id: calendarEvent.id,
			resourceID: calendarEvent.employeeId,
			title: calendarEvent.title,
			start: calendarEvent.start,
			end: calendarEvent.end,
			service,
			employee,
			allDay: false
		}
	})
}

export const composeBackgroundEvents = ({ shifts, timeOff, employees }: IComposeBackgroundEventsArgs) => {}
