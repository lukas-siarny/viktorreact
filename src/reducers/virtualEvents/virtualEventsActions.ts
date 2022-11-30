/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import VIRTUAL_EVENTS from './virtualEventsTypes'
import { ThunkResult } from '../index'
import { ISelectOptionItem, ICosmetic, ISelectable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { CALENDAR_EVENT_TYPE, CALENDAR_FORM_HANDLER } from '../../utils/enums'

export type IVirtualEventActions = IResetStore | IChangeVirtualEvents

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
	(type: CALENDAR_EVENT_TYPE, actionType: CALENDAR_FORM_HANDLER | string, payload?: any): ThunkResult<void> =>
	(dispatch, getState) => {
		console.log('🚀 ~ file: virtualEventsActions.ts ~ line 29 ~ actionType', actionType)
		console.log('🚀 ~ file: virtualEventsActions.ts ~ line 28 ~ updateEvents ~ type', type)
		console.log('🚀 ~ file: virtualEventsActions.ts ~ line 28 ~ updateEvents ~ payload', payload)

		// let payload = {} as IVirtualEventsPayload

		// return payload
	}
