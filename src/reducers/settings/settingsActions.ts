/* eslint-disable import/no-cycle */

import { SET_IS_SIDER_COLLAPSED } from './settingsTypes'

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

export type ISettingsActions = IResetStore | ISetIsSiderCollapsed

interface ISetIsSiderCollapsed {
	type: typeof SET_IS_SIDER_COLLAPSED
	payload: boolean
}

export const setIsSiderCollapsed =
	(isCollapsed: boolean): ThunkResult<void> =>
	async (dispatch) =>
		dispatch({ type: SET_IS_SIDER_COLLAPSED, payload: isCollapsed })
