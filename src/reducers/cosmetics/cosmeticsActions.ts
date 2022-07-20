/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { COSMETICS } from './cosmeticsTypes'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { ISelectOptionItem, ICosmetic } from '../../types/interfaces'

export type ICosmeticsActions = IResetStore | IGetCosmetics

interface IGetCosmetics {
	type: COSMETICS
	payload: ICosmeticsPayload
}

export interface ICosmeticsPayload {
	data: ICosmetic[] | undefined
	enumerationsOptions: ISelectOptionItem[]
}

export const getCosmetics = (): ThunkResult<Promise<ICosmeticsPayload>> => async (dispatch) => {
	let payload = {} as ICosmeticsPayload

	try {
		dispatch({ type: COSMETICS.COSMETICS_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/cosmetics/', null)
		const enumerationsOptions: ISelectOptionItem[] = data.cosmetics.map((cosmetic) => ({
			key: `Cosmetic_${cosmetic.id}`,
			label: cosmetic.name,
			value: cosmetic.id,
			extra: {
				image: cosmetic.image
			}
		}))

		payload = { data: data?.cosmetics, enumerationsOptions }
		dispatch({ type: COSMETICS.COSMETICS_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: COSMETICS.COSMETICS_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}
