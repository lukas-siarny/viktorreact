/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { ASSET_TYPES, DOCUMENTS_BY_ASSET_TYPE, DOCUMENTS } from './documentTypes'
import { IResetStore } from '../generalTypes'
import { ISearchable, ISelectOptionItem } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

// schemas
import { IDocumentsAssetTypesRequestQueryParams, IDocumentsPageQueryParams } from '../../schemas/queryParams'

export type IDocumentsActions = IResetStore | IGetDocuments | IGetDocumentsByAssetType | IGetAssetTypes

interface IGetDocuments {
	type: DOCUMENTS
	payload: IDocumentsPayload
}

interface IGetAssetTypes {
	type: ASSET_TYPES
	payload: IAssetTypesPayload
}

interface IGetDocumentsByAssetType {
	type: DOCUMENTS_BY_ASSET_TYPE
	payload: IDocumentsByAssetTypePayload
}

export interface IAssetTypesPayload {
	options?: ISelectOptionItem[]
	data: Paths.GetApiB2BAdminEnumsAssetTypes.Responses.$200 | null
}
export interface IDocumentsByAssetTypePayload extends ISearchable<Paths.GetApiB2BAdminDocumentsAssetTypesAssetType.Responses.$200> {}

export interface IDocumentsPayload extends ISearchable<Paths.GetApiB2BAdminDocuments.Responses.$200> {}

export const getDocuments =
	(queryParams: IDocumentsPageQueryParams): ThunkResult<Promise<IDocumentsPayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentsPayload
		try {
			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/documents/', { ...normalizeQueryParams(queryParams) })

			payload = {
				data
			}

			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getDocumentsByAssetType =
	(queryParams: IDocumentsAssetTypesRequestQueryParams): ThunkResult<Promise<IDocumentsByAssetTypePayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentsByAssetTypePayload
		try {
			dispatch({ type: DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/documents/asset-types/{assetType}', { ...(normalizeQueryParams(queryParams) as IDocumentsAssetTypesRequestQueryParams) })

			payload = {
				data
			}

			dispatch({ type: DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: DOCUMENTS_BY_ASSET_TYPE.DOCUMENTS_BY_ASSET_TYPE_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
export const getAssetTypes = (): ThunkResult<Promise<IAssetTypesPayload>> => async (dispatch) => {
	let payload = {} as IAssetTypesPayload

	try {
		dispatch({ type: ASSET_TYPES.ASSET_TYPES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/asset-types/', undefined, undefined, undefined, undefined, true)

		const options: ISelectOptionItem[] = data.assetTypes.map((assetType) => ({
			key: assetType.key,
			label: assetType.name || assetType.key,
			value: assetType.key
		}))

		payload = { data, options }
		dispatch({ type: ASSET_TYPES.ASSET_TYPES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: ASSET_TYPES.ASSET_TYPES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}
