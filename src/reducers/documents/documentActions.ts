/* eslint-disable import/no-cycle */
// types
import { map } from 'lodash'
import { ThunkResult } from '../index'
import { DOCUMENT, DOCUMENTS } from './documentTypes'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { IDocumentsAssetTypesPageQueryParams, IDocumentsPageQueryParams } from '../../schemas/queryParams'

export type IDocumentsActions = IResetStore | IGetDocuments | IGetDocumentsByAssetType

interface IGetDocuments {
	type: DOCUMENTS
	payload: IDocumentsPayload
}

interface IGetDocumentsByAssetType {
	type: DOCUMENT
	payload: IDocumentPayload
}

export interface IDocumentPayload {
	data: any
	tableData: any
	// TODO: naparovat s BE
	// data: Paths.GetApiB2BAdminCustomersCustomerId.Responses.$200 | null
}

export interface IDocumentsPayload {
	data: any
	tableData: any
	// TODO: naparovat s BE
	// data: Paths.GetApiB2BAdminCustomers.Responses.$200 | null
}

export const getDocuments =
	(queryParams: IDocumentsPageQueryParams): ThunkResult<Promise<IDocumentsPayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentsPayload
		try {
			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_START })
			console.log('queryParams', queryParams)
			// TODO: naparovat s BE
			const { data } = await getReq('/api/b2b/admin/documents/', { ...normalizeQueryParams(queryParams) })
			console.log('data', data)
			const tableData = map(data.documents, (document) => ({
				...document,
				key: document.id
			}))

			payload = {
				data,
				tableData
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
	(queryParams: IDocumentsAssetTypesPageQueryParams): ThunkResult<Promise<IDocumentPayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentPayload
		try {
			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/documents/asset-types/{assetType}', { ...(normalizeQueryParams(queryParams) as IDocumentsAssetTypesPageQueryParams) })

			const tableData = map(data.documents, (document) => ({
				...document,
				key: document.id
			}))

			payload = {
				data,
				tableData
			}

			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
