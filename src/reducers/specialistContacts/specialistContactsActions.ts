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

const contactsData = [
	{
		id: '1',
		email: 'lukas.siarny@goodrequest.sk',
		phonePrefixCountryCode: 'SK',
		phone: '902111222',
		countryCode: 'SK'
	},
	{
		id: '2',
		email: 'lukas.siarny@goodrequest.hu',
		phonePrefixCountryCode: 'HU',
		phone: '902111222',
		countryCode: 'HU'
	},
	{
		id: '3',
		email: 'lukas.siarny@goodrequest.it',
		phonePrefixCountryCode: 'IT',
		phone: '902111222',
		countryCode: 'IT'
	}
]

const contactData = {
	id: '1',
	email: 'lukas.siarny@goodrequest.sk',
	phonePrefixCountryCode: 'SK',
	phone: '902111222',
	countryCode: 'SK'
}

export const getSpecialistContacts = (): ThunkResult<Promise<ISpecialistContactsPayload>> => async (dispatch) => {
	let payload = {} as ISpecialistContactsPayload
	try {
		dispatch({ type: SPECIALIST_CONTACTS.SPECIALIST_CONTACTS_START })
		// TODO: remove any when BE is done
		// onst { data } = await getReq('/api/b2b/admin/enums/contacts' as any, undefined)

		payload = {
			data: contactsData
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
			// const { data } = await getReq('/api/b2b/admin/enums/contacts/{ContactID}' as any, { ContactID })

			payload = {
				data: contactData
			}
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_DONE, payload })
		} catch (err) {
			dispatch({ type: SPECIALIST_CONTACT.SPECIALIST_CONTACT_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
