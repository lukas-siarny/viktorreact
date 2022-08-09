/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { SYSTEM_ROLES, SALON_ROLES } from './rolesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { ISelectOptionItem } from '../../types/interfaces'

export type IRolesActions = IResetStore | IGetSystemRoles | IGetSalonRoles

interface IGetSystemRoles {
	type: SYSTEM_ROLES
	payload: IRolesPayload
}

interface IGetSalonRoles {
	type: SALON_ROLES
	payload: IRolesPayload
}

export interface IRolesPayload {
	data: Paths.GetApiB2BAdminRolesSystemUser.Responses.$200 | null
}

export const getSystemRoles =
	(filterByPermission = false): ThunkResult<Promise<void>> =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_START })

			const currentUserRole = getState().user.authUser.data?.roles[0]

			const { data } = await getReq('/api/b2b/admin/roles/system-user', null)

			const parsedData: ISelectOptionItem[] = []

			if (filterByPermission) {
				// return only roles that current user have permission to assign them
				const highestUserRoleIndex = data.roles.findIndex((role) => role?.id === currentUserRole?.id)
				const currentUserAllowedRolesOptions = data.roles.slice(highestUserRoleIndex)

				currentUserAllowedRolesOptions.forEach((role) => {
					parsedData.push({
						label: role?.name || '',
						value: role?.id,
						key: role?.id,
						extra: { permissions: role?.permissions }
					})
				})
			} else {
				// return all roles
				data.roles.forEach((role) => {
					parsedData.push({
						label: role?.name || '',
						value: role?.id,
						key: role?.id,
						extra: { permissions: role?.permissions }
					})
				})
			}

			dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_DONE, payload: { data: parsedData } })
		} catch (err) {
			dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getSalonRoles = (): ThunkResult<Promise<ISelectOptionItem[]>> => async (dispatch) => {
	const options: ISelectOptionItem[] = []
	try {
		dispatch({ type: SALON_ROLES.SALON_ROLES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/roles/salon', null)
		const parsedData: ISelectOptionItem[] = []
		data.roles.forEach((role) => {
			parsedData.push({
				label: role?.name || '',
				value: role?.id,
				key: role?.id,
				extra: { permissions: role?.permissions }
			})
		})
		dispatch({ type: SALON_ROLES.SALON_ROLES_LOAD_DONE, payload: { data: parsedData } })
	} catch (error) {
		dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(error)
	}
	return options
}
