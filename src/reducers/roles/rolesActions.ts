/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { SYSTEM_ROLES, SALON_ROLES } from './rolesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'
import { IAuthUserPayload } from '../users/userActions'

// utils
import { getReq } from '../../utils/request'
import { ISelectOptionItem } from '../../types/interfaces'
import { ADMIN_PERMISSIONS, SALON_PERMISSION } from '../../utils/enums'

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

type SalonRole = Paths.GetApiB2BAdminRolesSystemUser.Responses.$200['roles'][0]

export const getSystemRoles =
	(filterByPermission = false): ThunkResult<Promise<void>> =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/roles/system-user', null)

			const parsedData: ISelectOptionItem[] = []

			if (filterByPermission) {
				// return only roles that current user have permission to assign them
				const currentUserRole = getState().user.authUser.data?.roles[0]
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

export const getSalonRoles =
	(filterByPermission = false, salonID?: string, authUser?: IAuthUserPayload['data']): ThunkResult<Promise<ISelectOptionItem[]>> =>
	async (dispatch) => {
		const options: ISelectOptionItem[] = []
		try {
			dispatch({ type: SALON_ROLES.SALON_ROLES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/roles/salon', null)

			const mapDataAndPushToOptions = (source: SalonRole[], disabled = false) => {
				source.forEach((role) => {
					options.push({
						label: role?.name || '',
						value: role?.id,
						key: role?.id,
						extra: { permissions: role?.permissions },
						disabled
					})
				})
			}

			if (filterByPermission && salonID && authUser) {
				console.log(authUser)
				if (authUser?.uniqPermissions?.some((permission) => [...ADMIN_PERMISSIONS, SALON_PERMISSION.PARTNER_ADMIN].includes(permission as any))) {
					// admin and super admin roles have access to all salons, so salons array in authUser data is empty (no need to list there all existing salons)
					// they automatically see all options
					mapDataAndPushToOptions(data.roles)
				} else {
					// other salon roles can see only options they have permission to assign them
					const currentUserSalonRole = authUser?.salons?.find((salon) => salon.id === salonID)?.role
					if (currentUserSalonRole) {
						const highestUserRoleIndex = data.roles.findIndex((role) => role?.id === currentUserSalonRole?.id)
						if (highestUserRoleIndex === 0) {
							// highest salon rol has all permissions
							mapDataAndPushToOptions(data.roles)
						} else {
							const currentUserHighestRolesOptions = data.roles.slice(0, highestUserRoleIndex)
							const currentUserLowerRolesOptions = data.roles.slice(highestUserRoleIndex)
							// options above will always be disabled
							mapDataAndPushToOptions(currentUserHighestRolesOptions, true)
							// options below will be allowed only if user has USER_ROLE_EDIT PERMISSION
							const hasEditPermission = currentUserSalonRole.permissions.some((permission) => permission.name === SALON_PERMISSION.USER_ROLE_EDIT)
							mapDataAndPushToOptions(currentUserLowerRolesOptions /* , !hasEditPermission */)
						}
					}
				}
			} else if (!filterByPermission) {
				mapDataAndPushToOptions(data.roles)
			}
			dispatch({ type: SALON_ROLES.SALON_ROLES_LOAD_DONE, payload: { data: options } })
		} catch (error) {
			dispatch({ type: SYSTEM_ROLES.SYSTEM_ROLES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(error)
		}
		return options
	}
