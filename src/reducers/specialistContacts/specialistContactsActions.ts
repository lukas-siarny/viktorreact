/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { SPECIALIST_CONTACTS, SPECIALIST_CONTACT } from './specialistContactsTypes'

// types
import { Paths } from '../../types/api'
import { ISelectOptionItem } from '../../types/interfaces'

export type ISpecialistsContactsActions = IResetStore | IGetSpecialistContacts | IGetSpecialistContact

interface IGetSpecialistContacts {
	type: SPECIALIST_CONTACTS
	payload: ISpecialistContactsPayload
}

export interface IGetSpecialistContact {
	type: SPECIALIST_CONTACT
	payload: ISpecialistContactPayload
}

export interface ISpecialistContactsPayload {
	data: Paths.GetApiB2BAdminEnumsContacts.Responses.$200['contacts'] | null
	options: ISelectOptionItem[]
}

export interface ISpecialistContactPayload {
	data: Paths.GetApiB2BAdminEnumsContactsContactId.Responses.$200['contact'] | null
}
export const getSpecialistContacts = (): ThunkResult<Promise<ISpecialistContactsPayload>> => async (dispatch) => {
	let payload = {} as ISpecialistContactsPayload
	try {
		dispatch({ type: SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_START })
		const { data } = await getReq('/api/b2b/admin/enums/contacts/', undefined)

		const options: ISelectOptionItem[] =
			data?.contacts?.map((item: any) => {
				return {
					key: item.id,
					label: item.country.name || item.country.code,
					value: item.id,
					extra: {
						image: item.country.flag
					}
				}
			}) || []

		payload = {
			data: data.contacts,
			options
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
	(contactID?: string): ThunkResult<Promise<ISpecialistContactPayload>> =>
	async (dispatch) => {
		let payload = {} as ISpecialistContactPayload

		if (!contactID) {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE, payload })
			return payload
		}

		try {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_START })
			const { data } = await getReq('/api/b2b/admin/enums/contacts/{contactID}', { contactID })

			payload = {
				data: data.contact
			}
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE, payload })
		} catch (err) {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
