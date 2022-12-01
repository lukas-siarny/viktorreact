/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import VIRTUAL_EVENTS from './virtualEventsTypes'
import { ThunkResult } from '../index'
import { ICalendarEventForm, ICosmetic, ISelectable, CalendarEvent, ICalendarEventCardData } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { CALENDAR_EVENT_TYPE, HANDLE_CALENDAR_ACTIONS } from '../../utils/enums'
// import { createBaseEvent } from '../../pages/Calendar/calendarHelpers'

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
	(formAction: HANDLE_CALENDAR_ACTIONS | string, payload?: Partial<ICalendarEventForm>): ThunkResult<void> =>
	(dispatch, getState) => {
		if (!payload) {
		}
	}
