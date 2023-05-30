/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { IAssetTypesPayload, IDocumentsByAssetTypePayload, IDocumentsActions, IDocumentsPayload } from './documentActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { DOCUMENTS, DOCUMENTS_BY_ASSET_TYPE, ASSET_TYPES } from './documentTypes'

export const initState = {
	documents: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IDocumentsPayload & ILoadingAndFailure,
	documentsByAssetType: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IDocumentsByAssetTypePayload & ILoadingAndFailure,
	assetTypes: {
		data: null,
		options: [],
		isLoading: false,
		isFailure: false
	} as IAssetTypesPayload & ILoadingAndFailure
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
		// Documents by asset type
		case DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_START:
			return {
				...state,
				documentsByAssetType: {
					...state.documentsByAssetType,
					isLoading: true
				}
			}
		case DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_FAIL:
			return {
				...state,
				documentsByAssetType: {
					...initState.documentsByAssetType,
					isFailure: true
				}
			}
		case DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_DONE:
			return {
				...state,
				documentsByAssetType: {
					...initState.documentsByAssetType,
					data: action.payload.data
				}
			}
		// Asset types
		case ASSET_TYPES.ASSET_TYPES_LOAD_START:
			return {
				...state,
				assetTypes: {
					...state.assetTypes,
					isLoading: true
				}
			}
		case ASSET_TYPES.ASSET_TYPES_LOAD_FAIL:
			return {
				...state,
				assetTypes: {
					...initState.assetTypes,
					isFailure: true
				}
			}
		case ASSET_TYPES.ASSET_TYPES_LOAD_DONE:
			return {
				...state,
				assetTypes: {
					...initState.assetTypes,
					data: action.payload.data,
					options: action.payload.options
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
