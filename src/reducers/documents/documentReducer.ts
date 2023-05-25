/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { IDocumentPayload, IDocumentsActions, IDocumentsPayload } from './documentActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { DOCUMENTS, DOCUMENT } from './documentTypes'

export const initState = {
	documents: {
		data: null,
		isLoading: false,
		tableData: [],
		isFailure: false
	} as IDocumentsPayload & ILoadingAndFailure,
	document: {
		data: null,
		tableData: [],
		isLoading: false,
		isFailure: false
	} as IDocumentPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IDocumentsActions) => {
	switch (action.type) {
		// Documents
		case DOCUMENTS.DOCUMENTS_LOAD_START:
			return {
				...state,
				documents: {
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
		// Document
		case DOCUMENT.DOCUMENT_LOAD_START:
			return {
				...state,
				document: {
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
