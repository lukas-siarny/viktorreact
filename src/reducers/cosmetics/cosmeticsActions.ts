/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { COSMETICS } from './cosmeticsTypes'
import { ThunkResult } from '../index'
import { ISelectOptionItem, ICosmetic, ISearchableWithoutPagination, IQueryParams } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

export type ICosmeticsActions = IResetStore | IGetCosmetics

interface IGetCosmetics {
	type: COSMETICS
	payload: ICosmeticsPayload
}

export interface ICosmeticsPayload extends ISearchableWithoutPagination<ICosmetic[]> {}

export const getCosmetics =
	(queryParams?: IQueryParams): ThunkResult<Promise<ICosmeticsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICosmeticsPayload

		try {
			dispatch({ type: COSMETICS.COSMETICS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/enums/cosmetics/', { ...normalizeQueryParams(queryParams) })
			const options: ISelectOptionItem[] = data.cosmetics.map((cosmetic) => ({
				key: `Cosmetic_${cosmetic.id}`,
				label: cosmetic.name,
				value: cosmetic.id,
				extra: {
					image: cosmetic.image?.resizedImages?.thumbnail || cosmetic.image?.original
				}
			}))

			payload = { data: data?.cosmetics, options }
			dispatch({ type: COSMETICS.COSMETICS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: COSMETICS.COSMETICS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
