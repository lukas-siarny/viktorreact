/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import VIRTUAL_EVENTS from './virtualEventsTypes'
import { IVirtualEventActions } from './virtualEventsActions'

export const initState = {
	events: []
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IVirtualEventActions) => {
	switch (action.type) {
		case VIRTUAL_EVENTS.VIRTUAL_EVENTS_ADD:
			return {
				...state,
				events: [...state.events, action.payload.newEvent]
			}
		case VIRTUAL_EVENTS.VIRTUAL_EVENTS_UPDATE:
			return {
				...state,
				events: [...action.payload.events]
			}
		case VIRTUAL_EVENTS.VIRTUAL_EVENTS_CLEAR:
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
