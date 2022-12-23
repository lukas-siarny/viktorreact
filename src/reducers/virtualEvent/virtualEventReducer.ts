/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import VIRTUAL_EVENT from './virtualEventTypes'
import { IVirtualEventActions, IVirtualEventPayload } from './virtualEventActions'

export const initState = {
	virtualEvent: {
		data: null
	} as IVirtualEventPayload
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IVirtualEventActions) => {
	switch (action.type) {
		case VIRTUAL_EVENT.VIRTUAL_EVENT_CHANGE:
			return {
				...state,
				virtualEvent: {
					...state.virtualEvent,
					data: action.payload.data
				}
			}
		case VIRTUAL_EVENT.VIRTUAL_EVENT_CLEAR:
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
