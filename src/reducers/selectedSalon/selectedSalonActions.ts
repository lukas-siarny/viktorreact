/* eslint-disable import/no-cycle */
import { find, uniq, map, get } from 'lodash'

// types
import { IResetStore } from '../generalTypes'
import { ThunkResult } from '../index'
import { SELECTED_SALON, SALON_OPTIONS } from './selectedSalonTypes'
import { Paths } from '../../types/api'
import { ISelectOptionItem, IPermissions, ICurrency } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { ENUMERATIONS_KEYS, DEFAULT_CURRENCY, PERMISSION } from '../../utils/enums'
import { checkPermissions } from '../../utils/Permissions'

export type ISelectedSalonActions = IResetStore | IGetSelectedSalon | ISalonOptions

export interface IGetSelectedSalon {
	type: SELECTED_SALON
	payload: ISelectedSalonPayload
}

export interface ISalonOptions {
	type: SALON_OPTIONS
	payload: ISalonSelectionOptionsPayload
}

export type ISalonPayloadData = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon'] &
	IPermissions & {
		currency: ICurrency
	}

export interface ISelectedSalonPayload {
	data: ISalonPayloadData | null
}

interface ISalonSelectedOptionItem extends ISelectOptionItem {
	logo?: string
}

export interface ISalonSelectionOptionsPayload {
	data: ISalonSelectedOptionItem[] | null
}

export const selectSalon =
	(salonID?: string): ThunkResult<Promise<any>> =>
	async (dispatch, getState) => {
		let payload = {} as ISelectedSalonPayload
		if (!salonID) {
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_CLEAR })
			return
		}

		const state = getState()

		try {
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/{salonID}', { salonID })

			let salonCurrency: ICurrency = {} as ICurrency

			// obtain salon's currency
			try {
				if (data.salon.address) {
					// pick country code from salon address
					const { countryCode } = data.salon.address

					const countries = state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES]
					// find country by code from enumeration values
					const country = find(countries.data, (item) => item.code?.toLowerCase() === countryCode?.toLowerCase())

					const currencies = state.enumerationsStore?.[ENUMERATIONS_KEYS.CURRENCIES]
					// find currency by currency code from country
					const currency = find(currencies.data, (item) => country?.currencyCode === item.code) as any

					salonCurrency = {
						code: currency.code,
						symbol: currency.symbol
					}
				}
			} catch (error) {
				salonCurrency = DEFAULT_CURRENCY
			}

			let permissions: PERMISSION[] = []

			const currentUser = state.user.authUser.data

			if (currentUser && currentUser.uniqPermissions) {
				permissions = currentUser.uniqPermissions
				// SUPER_ADMIN and ADMIN doesn't requires salon's permissions
				if (!checkPermissions(permissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN])) {
					const salon = find(currentUser.salons, (item) => item.id === salonID)
					if (salon && salon.role) {
						permissions = uniq(map(salon.role.permissions, 'name')) as any
					}
				}
			}

			payload = {
				data: {
					...data.salon,
					currency: salonCurrency,
					uniqPermissions: permissions
				}
			}
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_DONE, payload })
			// eslint-disable-next-line consistent-return
			return payload
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_FAIL })
		}
	}

export const setSelectionOptions =
	(salons: Paths.GetApiB2BAdminUsersUserId.Responses.$200['user']['salons']): ThunkResult<void> =>
	(dispatch) => {
		const options = salons.map((salon) => ({
			key: salon.id,
			label: get(salon, 'name', salon.id.toString()),
			value: salon.id,
			logo: get(salon, 'logo.resizedImages.thumbnail')
		}))

		const payload: ISalonSelectionOptionsPayload = {
			data: options
		}

		dispatch({ type: SALON_OPTIONS.SALON_OPTIONS_UPDATE, payload })
	}
