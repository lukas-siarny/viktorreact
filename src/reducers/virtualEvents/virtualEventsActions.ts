/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import VIRTUAL_EVENTS from './virtualEventsTypes'
import { ThunkResult } from '../index'
import { ICalendarEventForm, ICosmetic, ISelectable, CalendarEvent, ICalendarEventCardData } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { CALENDAR_EVENT_TYPE, CALENDAR_FORM_HANDLER } from '../../utils/enums'
import { createBaseEvent } from '../../pages/Calendar/calendarHelpers'

export type IVirtualEventActions = IResetStore | IChangeVirtualEvents

const NEW_ID_PREFIX = 'NEW'

interface IChangeVirtualEvents {
	type: VIRTUAL_EVENTS
	payload: IVirtualEventsPayload
}

interface IVirtualEventsPayload {
	events: []
	newEvent?: any | null
}

export interface ICosmeticsPayload extends ISelectable<ICosmetic[]> {}

export const updateEvents =
	(formAction: CALENDAR_FORM_HANDLER | string, payload?: Partial<ICalendarEventForm>): ThunkResult<void> =>
	(dispatch, getState) => {
		if (!payload) {
			return
		}

		const { calendarApi } = payload

		if (!calendarApi) {
			console.warn(`Missing Calendar API, new event can't be dispalyed`)
			return
		}

		if (payload.date && payload?.timeFrom && payload.timeTo && payload.employee) {
			let { eventId } = payload

			if (!eventId) {
				eventId = `${NEW_ID_PREFIX}_${payload.employee.key}`
			}
		}

		console.log('🚀 ~ file: virtualEventsActions.ts ~ line 29 ~ formAction', formAction)
		console.log('🚀 ~ file: virtualEventsActions.ts ~ line 28 ~ updateEvents ~ payload', payload)

		// let payload = {} as IVirtualEventsPayload

		// return payload
	}
