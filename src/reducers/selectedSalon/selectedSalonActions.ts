/* eslint-disable import/no-cycle */
import { find, uniq, map, get } from 'lodash'

// types
import { IResetStore } from '../generalTypes'
import rootReducer, { ThunkResult } from '../index'
import { SELECTED_SALON, SALON_OPTIONS } from './selectedSalonTypes'
import { Paths } from '../../types/api'
import { ISelectOptionItem, IPermissions } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import configureStore from '../../utils/configureStore'
import { ENUMERATIONS_KEYS, DEFAULT_CURRENCY, PERMISSION } from '../../utils/enums'
import { checkPermissions } from '../../utils/Permissions'

const { store } = configureStore(rootReducer)

export type ISelectedSalonActions = IResetStore | IGetSelectedSalon | ISalonOptions

export interface IGetSelectedSalon {
	type: SELECTED_SALON
	payload: ISelectedSalonPayload
}

export interface ISalonOptions {
	type: SALON_OPTIONS
	payload: ISalonSelectionOptionsPayload
}

type IPayloadData = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon'] &
	IPermissions & {
		currency: Pick<Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200['currencies'][0], 'code' | 'symbol'>
	}

export interface ISelectedSalonPayload {
	data: IPayloadData | null
}

export interface ISalonSelectionOptionsPayload {
	data: ISelectOptionItem[] | null
}

export const selectSalon =
	(salonID?: number): ThunkResult<void> =>
	async (dispatch) => {
		if (!salonID || salonID < 1) {
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_CLEAR })
			return
		}

		try {
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/{salonID}', { salonID })

			let salonCurrency = DEFAULT_CURRENCY

			// obtain salon's currency
			if (data.salon.address) {
				// pick country code from salon address
				const { countryCode } = data.salon.address

				const countries = store.getState().enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES]
				// find country by code from enumeration values
				const country = find(countries.data, (item) => item.code === countryCode)

				const currencies = store.getState().enumerationsStore?.[ENUMERATIONS_KEYS.CURRENCIES]
				// find currency by currency code from country
				const currency = find(currencies.data, (item) => country.currencyCode === item.code)

				salonCurrency = {
					code: currency.code,
					symbol: currency.symbol
				}
			}

			const currentUser = store.getState().user.authUser.data

			let permissions = currentUser.uniqPermissions

			// SUPER_ADMIN and ADMIN doesn't requires salon's permissions
			if (!checkPermissions(permissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN])) {
				const salon = find(currentUser.salons, (item) => item.id === salonID)
				if (salon) {
					permissions = uniq(map(salon.role.permissions, 'name'))
				}
			}

			const payload: ISelectedSalonPayload = {
				data: {
					...data.salon,
					currency: salonCurrency,
					uniqPermissions: permissions
				}
			}
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_DONE, payload })
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
			label: get(salon, 'name', salon.id),
			value: salon.id
		}))

		const payload: ISalonSelectionOptionsPayload = {
			data: options
		}

		dispatch({ type: SALON_OPTIONS.SALON_OPTIONS_UPDATE, payload })
	}
