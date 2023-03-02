/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { IWalletActions, IWalletPayload } from './walletActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { WALLET } from './walletTypes'

export const initState = {
	wallet: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IWalletPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IWalletActions) => {
	switch (action.type) {
		// Customers
		case WALLET.WALLET_LOAD_START:
			return {
				...state,
				wallet: {
					...state.wallet,
					isLoading: true
				}
			}
		case WALLET.WALLET_LOAD_FAIL:
			return {
				...state,
				wallet: {
					...initState.wallet,
					isFailure: true
				}
			}
		case WALLET.WALLET_LOAD_DONE:
			return {
				...state,
				wallet: {
					...initState.wallet,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
