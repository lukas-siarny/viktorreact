/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { SPECIALIST_CONTACTS, SPECIALIST_CONTACT } from './specialistContactsTypes'

// types
import { Paths } from '../../types/api'

export type ISpecialistsContactsActions = IResetStore | IGetSpecialistContacts | IGetSpecialistContact

interface IGetSpecialistContacts {
	type: SPECIALIST_CONTACTS
	payload: ISpecialistContactsPayload
}

export interface IGetSpecialistContact {
	type: SPECIALIST_CONTACT
	payload: ISpecialistContactPayload
}

// TODO: remove any when BE is done
export interface ISpecialistContactsPayload {
	data: any | null
}

// TODO: remove any when BE is done
export interface ISpecialistContactPayload {
	data: any | null
}

export const getSpecialistContacts = (): ThunkResult<Promise<ISpecialistContactsPayload>> => async (dispatch) => {
	let payload = {} as ISpecialistContactsPayload
	try {
		dispatch({ type: SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_START })
		// TODO: remove any when BE is done
		const { data } = await getReq('/api/b2b/admin/enums/contacts' as any, undefined)

		payload = {
			data
		}

		dispatch({ type: SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_DONE, payload })
	} catch (err) {
		dispatch({ type: SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}

export const getSpecialistContact =
	(ContactID?: string): ThunkResult<Promise<ISpecialistContactPayload>> =>
	async (dispatch) => {
		let payload = {} as ISpecialistContactPayload

		if (!ContactID) {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE, payload })
			return payload
		}

		try {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_START })
			// TODO: remove any when BE is done
			const { data } = await getReq('/api/b2b/admin/enums/contacts/{ContactID}' as any, { ContactID })

			payload = {
				data
			}
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE, payload })
		} catch (err) {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
