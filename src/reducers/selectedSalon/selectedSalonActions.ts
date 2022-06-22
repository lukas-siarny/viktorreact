/* eslint-disable import/no-cycle */
import { IResetStore, RESET_STORE } from '../generalTypes'

// types
import SELECTED_SALON from './selectedSalonTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'

export type ISelectedSalonActions = IResetStore | IGetSelectedSalon

export interface IGetSelectedSalon {
	type: SELECTED_SALON
	payload: ISelectedSalonPayload
}

type IPayloadData = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon'] & {
	currency?: Pick<Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200['currencies'][0], 'code' | 'symbol'>
}

export interface ISelectedSalonPayload {
	data: IPayloadData | null
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

			// TODO Set currency salon.countryCode -> pick from enumsCountries currencyCode -> pick code and symbol from enumsCurrencies
			const payload: ISelectedSalonPayload = {
				data: data.salon
			}
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_DONE, payload })
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			dispatch({ type: SELECTED_SALON.SELECTED_SALON_LOAD_FAIL })
		}
	}
