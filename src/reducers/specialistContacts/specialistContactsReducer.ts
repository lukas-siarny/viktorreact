import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { ISpecialistContactPayload, ISpecialistContactsPayload, ISpecialistsContactsActions } from './specialistContactsActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { SPECIALIST_CONTACTS, SPECIALIST_CONTACT } from './specialistContactsTypes'

export const initState = {
	specialistContacts: {
		data: null,
		tableData: undefined,
		options: [],
		isLoading: false,
		isFailure: false
	} as ISpecialistContactsPayload & ILoadingAndFailure,
	specialistContact: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISpecialistContactPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISpecialistsContactsActions) => {
	switch (action.type) {
		case SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_START:
			return {
				...state,
				specialistContacts: {
					...state.specialistContacts,
					isLoading: true
				}
			}
		case SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_FAIL:
			return {
				...state,
				specialistContacts: {
					...initState.specialistContacts,
					isFailure: true
				}
			}
		case SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_DONE:
			return {
				...state,
				specialistContacts: {
					...initState.specialistContacts,
					data: action.payload.data
				}
			}
		case SPECIALIST_CONTACT.SPECIALIST_CONTACT_START:
			return {
				...state,
				specialistContact: {
					...state.specialistContact,
					isLoading: true
				}
			}
		case SPECIALIST_CONTACT.SPECIALIST_CONTACT_FAIL:
			return {
				...state,
				specialistContact: {
					...initState.specialistContact,
					isFailure: true
				}
			}
		case SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE:
			return {
				...state,
				specialistContact: {
					...initState.specialistContact,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
