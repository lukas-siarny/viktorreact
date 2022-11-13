/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ISupportContactsPayload, ISupportContactPayload, ISupportContactsActions } from './supportContactsActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SUPPORT_CONTACTS, SUPPORT_CONTACT, SET_SUPPORT_CONTACT_OPTIONS } from './supportContactsTypes'

export const initState = {
	supportContacts: {
		data: null,
		tableData: undefined,
		options: [],
		isLoading: false,
		isFailure: false
	} as ISupportContactsPayload & ILoadingAndFailure,
	supportContact: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISupportContactPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISupportContactsActions) => {
	switch (action.type) {
		case SUPPORT_CONTACTS.SUPPORT_CONTACTS_START:
			return {
				...state,
				supportContacts: {
					...state.supportContacts,
					isLoading: true
				}
			}
		case SUPPORT_CONTACTS.SUPPORT_CONTACTS_FAIL:
			return {
				...state,
				supportContacts: {
					...initState.supportContacts,
					isFailure: true
				}
			}
		case SUPPORT_CONTACTS.SUPPORT_CONTACTS_DONE:
			return {
				...state,
				supportContacts: {
					...initState.supportContacts,
					data: action.payload.data,
					tableData: action.payload.tableData,
					options: action.payload.options
				}
			}
		case SUPPORT_CONTACT.SUPPORT_CONTACT_START:
			return {
				...state,
				supportContact: {
					...state.supportContact,
					isLoading: true
				}
			}
		case SUPPORT_CONTACT.SUPPORT_CONTACT_FAIL:
			return {
				...state,
				supportContact: {
					...initState.supportContact,
					isFailure: true
				}
			}
		case SUPPORT_CONTACT.SUPPORT_CONTACT_DONE:
			return {
				...state,
				supportContact: {
					...initState.supportContact,
					data: action.payload.data
				}
			}
		case SET_SUPPORT_CONTACT_OPTIONS: {
			return {
				...state,
				supportContacts: {
					...state.supportContacts,
					options: action.payload.options
				}
			}
		}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
