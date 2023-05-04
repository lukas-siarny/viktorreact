/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ICustomerActions, IDocumentPayload, IDocumentsPayload } from './documentActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { DOCUMENTS, DOCUMENT } from './documentTypes'

export const initState = {
	documents: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IDocumentsPayload & ILoadingAndFailure,
	document: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IDocumentPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICustomerActions) => {
	switch (action.type) {
		// Customers
		case DOCUMENTS.DOCUMENTS_LOAD_START:
			return {
				...state,
				customers: {
					...state.documents,
					isLoading: true
				}
			}
		case DOCUMENTS.DOCUMENTS_LOAD_FAIL:
			return {
				...state,
				documents: {
					...initState.documents,
					isFailure: true
				}
			}
		case DOCUMENTS.DOCUMENTS_LOAD_DONE:
			return {
				...state,
				documents: {
					...initState.documents,
					data: action.payload.data
				}
			}
		// Customer
		case DOCUMENT.DOCUMENT_LOAD_START:
			return {
				...state,
				customer: {
					...state.document,
					isLoading: true
				}
			}
		case DOCUMENT.DOCUMENT_LOAD_FAIL:
			return {
				...state,
				document: {
					...initState.document,
					isFailure: true
				}
			}
		case DOCUMENT.DOCUMENT_LOAD_DONE:
			return {
				...state,
				document: {
					...initState.document,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
