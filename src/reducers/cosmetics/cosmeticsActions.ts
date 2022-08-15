/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { COSMETICS } from './cosmeticsTypes'
import { ThunkResult } from '../index'
import { ISelectOptionItem, ICosmetic, ISelectable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { sortData } from '../../utils/helper'

export type ICosmeticsActions = IResetStore | IGetCosmetics

interface IGetCosmetics {
	type: COSMETICS
	payload: ICosmeticsPayload
}

export interface ICosmeticsPayload extends ISelectable<ICosmetic[]> {}

export const getCosmetics = (): ThunkResult<Promise<ICosmeticsPayload>> => async (dispatch) => {
	let payload = {} as ICosmeticsPayload

	try {
		dispatch({ type: COSMETICS.COSMETICS_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/cosmetics/', null)
		const enumerationsOptions: ISelectOptionItem[] = data.cosmetics
			.map((cosmetic) => ({
				key: `Cosmetic_${cosmetic.id}`,
				label: cosmetic.name,
				value: cosmetic.id,
				extra: {
					image: cosmetic.image?.resizedImages?.thumbnaill || cosmetic.image?.original
				}
			}))
			.sort((a, b) => sortData(a.label, b.label))

		payload = { data: data?.cosmetics, enumerationsOptions }
		dispatch({ type: COSMETICS.COSMETICS_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: COSMETICS.COSMETICS_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}
