/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { ROLES } from './rolesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'

export type IRolesActions = IResetStore | IGetRoles

interface IGetRoles {
	type: ROLES
	payload: IRolesPayload
}

export interface IRolesPayload {
	data: Paths.GetApiB2BAdminRoles.Responses.$200 | null
}

export const getRoles = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: ROLES.ROLES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/roles/', null)
		const parsedData: any[] = []
		data.roles.forEach((role: any) => {
			parsedData.push({
				label: role?.name,
				value: role?.id,
				key: role?.id,
				extra: { permissions: role?.permissions }
			})
		})
		dispatch({ type: ROLES.ROLES_LOAD_DONE, payload: { data: parsedData } })
	} catch (err) {
		dispatch({ type: ROLES.ROLES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
}
