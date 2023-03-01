/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { WALLET } from './walletTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'

export type ICustomerActions = IResetStore | IGetWallet

interface IGetWallet {
	type: WALLET
	payload: ICustomersPayload
}

export interface ICustomerPayload {
	data: Paths.GetApiB2BAdminCustomersCustomerId.Responses.$200 | null
}

export interface ICustomersPayload {
	data: Paths.GetApiB2BAdminCustomers.Responses.$200 | null
}

export const getWallet =
	(salonID: string, walletID: string): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: WALLET.WALLET_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/wallets/{walletID}' as any, { salonID, walletID })

			const payload = {
				data
			}

			dispatch({ type: WALLET.WALLET_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: WALLET.WALLET_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}
