/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { ASSET_TYPES, DOCUMENTS_BY_ASSET_TYPE, DOCUMENTS, SET_DOCUMENTS_ACTIVE_KEYS } from './documentTypes'
import { IResetStore } from '../generalTypes'
import { DocumentsActiveKeys, ISearchable, ISelectOptionItem } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { LANGUAGE } from '../../utils/enums'

// schemas
import { IDocumentsAssetTypesRequestQueryParams, IDocumentsPageQueryParams } from '../../schemas/queryParams'

export type IDocumentsActions = IResetStore | IGetDocuments | IGetDocumentsByAssetType | IGetAssetTypes | ISetDocumentsActiveKeys

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

interface ISetDocumentsActiveKeys {
	type: typeof SET_DOCUMENTS_ACTIVE_KEYS
	payload: DocumentsActiveKeys
}

export interface IAssetTypesPayload {
	options?: ISelectOptionItem[]
	data: Paths.GetApiB2BAdminEnumsAssetTypes.Responses.$200 | null
}
export interface IDocumentsByAssetTypePayload extends ISearchable<Paths.GetApiB2BAdminDocumentsAssetTypesAssetType.Responses.$200> {}

type Document = Paths.GetApiB2BAdminDocuments.Responses.$200['documents'][0]

export interface IDocumentLangaugeItem {
	id?: string
	createdAt?: string
	lastUpdatedAt?: string
	languageCode: string
	isEmpty: boolean
}
export interface IDocumentAssetTypeItem {
	assetType: Document['assetType']
	langauges: IDocumentLangaugeItem[]
}

export interface IDocumentsPayload extends ISearchable<Paths.GetApiB2BAdminDocuments.Responses.$200> {
	tableData: IDocumentAssetTypeItem[] | null
	documentsActiveKeys: DocumentsActiveKeys
}

const languages = Object.values(LANGUAGE)

export const getDocuments =
	(queryParams: IDocumentsPageQueryParams): ThunkResult<Promise<IDocumentsPayload>> =>
	async (dispatch, getState) => {
		let payload = {} as IDocumentsPayload

		const selectedKeys = getState().documents.documents.documentsActiveKeys

		try {
			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/documents/', { ...normalizeQueryParams(queryParams) })

			const d = data.documents.reduce(
				(acc, document) => {
					const languageItem: IDocumentLangaugeItem = {
						id: document.id,
						languageCode: document.languageCode,
						isEmpty: !document.files.length,
						createdAt: document.createdAt,
						lastUpdatedAt: document.createdAt
					}

					if (acc[document.assetType.key]) {
						acc[document.assetType.key].languages = {
							...acc[document.assetType.key].languages,
							[document.languageCode]: languageItem
						}
					} else {
						acc[document.assetType.key] = {
							assetType: document.assetType,
							languages: {
								[document.languageCode]: languageItem
							}
						}
					}
					return acc
				},
				{} as {
					[key: string]: {
						assetType: IDocumentAssetTypeItem['assetType']
						languages: { [key: string]: IDocumentLangaugeItem }
					}
				}
			)

			const tableData: IDocumentAssetTypeItem[] = Object.values(d).map((assetType) => {
				return {
					...assetType,
					langauges: languages.map((language) => {
						if (assetType.languages[language]) {
							return assetType.languages[language]
						}
						return {
							languageCode: language,
							isEmpty: true
						}
					})
				}
			})

			payload = {
				data,
				tableData,
				// use existing keys or first asset type
				documentsActiveKeys: selectedKeys?.length ? selectedKeys : [tableData[0].assetType.key]
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
			value: assetType.key,
			extra: {
				mimeTypes: assetType.mimeTypes,
				fileType: assetType.fileType,
				maxFilesCount: assetType.maxFilesCount
			}
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

export const setDocumentsActiveKeys =
	(newActiveKeys: DocumentsActiveKeys): ThunkResult<DocumentsActiveKeys> =>
	(dispatch) => {
		dispatch({ type: SET_DOCUMENTS_ACTIVE_KEYS, payload: newActiveKeys })
		return newActiveKeys
	}
