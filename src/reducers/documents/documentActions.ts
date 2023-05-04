/* eslint-disable import/no-cycle */
// types
import { map } from 'lodash'
import { ThunkResult } from '../index'
import { DOCUMENT, DOCUMENTS } from './documentTypes'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'

export type ICustomerActions = IResetStore | IGetDocuments | IGetDocument

interface IGetDocuments {
	type: DOCUMENTS
	payload: IDocumentsPayload
}

interface IGetDocument {
	type: DOCUMENT
	payload: IDocumentPayload
}

export interface IDocumentPayload {
	data: any
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
	(queryParams: any): ThunkResult<Promise<IDocumentsPayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentsPayload
		try {
			dispatch({ type: DOCUMENTS.DOCUMENTS_LOAD_START })
			// TODO: naparovat s BE
			// const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams(queryParams) })
			const data = {
				documents: [
					{
						id: '1',
						name: 'John'
					},
					{
						id: '2',
						name: 'Doe'
					},
					{
						id: '3',
						name: 'Smith'
					}
				]
			}

			const tableData = map(data.documents, (employee) => ({
				...employee,
				key: employee.id
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

export const getDocument =
	(documentID: string): ThunkResult<Promise<IDocumentPayload>> =>
	async (dispatch) => {
		let payload = {} as IDocumentPayload
		try {
			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_START })
			// TODO: naparovat s BE
			// const { data } = await getReq('/api/b2b/admin/customers/{customerID}', { customerID })

			payload = {
				data: {
					id: '1',
					name: 'John'
				}
			}

			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: DOCUMENT.DOCUMENT_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
