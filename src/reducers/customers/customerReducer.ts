/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ICustomerActions, ICustomerPayload, ICustomersPayload } from './customerActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { CUSTOMER, CUSTOMERS } from './customerTypes'

export const initState = {
	customers: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICustomersPayload & ILoadingAndFailure,
	customer: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICustomerPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICustomerActions) => {
	switch (action.type) {
		// Customers
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
		// Customer
		case CUSTOMER.CUSTOMER_LOAD_START:
			return {
				...state,
				customer: {
					...state.customer,
					isLoading: true
				}
			}
		case CUSTOMER.CUSTOMER_LOAD_FAIL:
			return {
				...state,
				customer: {
					...initState.customer,
					isFailure: true
				}
			}
		case CUSTOMER.CUSTOMER_LOAD_DONE:
			return {
				...state,
				customer: {
					...initState.customer,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
