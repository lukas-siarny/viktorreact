import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { ICustomerActions, ICustomersPayload } from './customerActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { CUSTOMERS } from './customerTypes'

export const initState = {
	customers: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICustomersPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICustomerActions) => {
	switch (action.type) {
		// Services
		case CUSTOMERS.CUSTOMERS_LOAD_START:
			return {
				...state,
				customers: {
					...state.customers,
					isLoading: true
				}
			}
		case CUSTOMERS.CUSTOMERS_LOAD_FAIL:
			return {
				...state,
				customers: {
					...initState.customers,
					isFailure: true
				}
			}
		case CUSTOMERS.CUSTOMERS_LOAD_DONE:
			return {
				...state,
				customers: {
					...initState.customers,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
