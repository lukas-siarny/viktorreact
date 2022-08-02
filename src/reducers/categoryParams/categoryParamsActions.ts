/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { CATEGORY_PARAMETERS } from './categoryParamsTypes'
import { ThunkResult } from '../index'
import { ISelectOptionItem, ICategoryParameters, ISelectable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'

export type ICategoryParametersActions = IResetStore | IGetCategoryParameters

export interface IParametersPayload extends ISelectable<ICategoryParameters> {}

interface IGetCategoryParameters {
	type: CATEGORY_PARAMETERS
	payload: IParametersPayload
}

export const getCategoryParameters = (): ThunkResult<Promise<IParametersPayload>> => async (dispatch) => {
	let payload = {} as IParametersPayload

	try {
		dispatch({ type: CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_START })

		const { data } = await getReq('/api/b2b/admin/enums/category-parameters/', null)
		const enumerationsOptions: ISelectOptionItem[] = data.categoryParameters.map((param) => ({
			key: `Param_${param.id}`,
			label: param.name || '-',
			value: param.id,
			extra: {
				values: param.values,
				valueType: param.valueType,
				unitType: param.unitType
			}
		}))

		payload = {
			data: data.categoryParameters,
			enumerationsOptions
		}

		dispatch({ type: CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_DONE, payload })
	} catch (error) {
		dispatch({ type: CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(error)
	}

	return payload
}
