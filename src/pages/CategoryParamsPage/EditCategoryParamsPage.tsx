import React, { useEffect } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Spin } from 'antd'
import { initialize } from 'redux-form'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// redux
import { getCategoryParameter } from '../../reducers/categoryParams/categoryParamsActions'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES, PARAMETERS_UNIT_TYPES, DEFAULT_LANGUAGE } from '../../utils/enums'
import { normalizeNameLocalizations } from '../../utils/helper'
import { patchReq, deleteReq } from '../../utils/request'
import { history } from '../../utils/history'

// types
import { IBreadcrumbs, IComputedMatch, ICategoryParamForm } from '../../types/interfaces'
import { RootState } from '../../reducers'

type Props = {
	computedMatch: IComputedMatch<{ parameterID: string }>
}

function EditCategoryParamsPage(props: Props) {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { parameterID } = props.computedMatch.params
	const parameter = useSelector((state: RootState) => state.categoryParams.parameter)
	const { data } = parameter

	useEffect(() => {
		dispatch(getCategoryParameter(parameterID))
	}, [dispatch, parameterID])

	useEffect(() => {
		if (data) {
			dispatch(
				initialize(FORM.CATEGORY_PARAMS, {
					valueType: data.valueType,
					nameLocalizations: normalizeNameLocalizations(data.nameLocalizations, DEFAULT_LANGUAGE),
					localizedValues:
						data.valueType === PARAMETERS_VALUE_TYPES.TIME
							? [{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }]
							: data.values.map((item) => ({ valueLocalizations: normalizeNameLocalizations(item.valueLocalizations || [], DEFAULT_LANGUAGE) })),
					values:
						data.valueType === PARAMETERS_VALUE_TYPES.ENUM
							? [{ value: null }]
							: data.values.map((item) => ({
									value: item.value
							  }))
				})
			)
		}
	}, [data, dispatch])

	const handleSubmit = async (formData: ICategoryParamForm) => {
		let values = []
		let unitType = null

		if (formData.valueType === PARAMETERS_VALUE_TYPES.TIME) {
			unitType = PARAMETERS_UNIT_TYPES.MINUTES
			values = formData.values.filter((item) => item.value).map((item: any) => ({ value: item.value.toString() }))
		} else {
			values =
				formData.localizedValues?.map((item: any) => ({ valueLocalizations: item.valueLocalizations.filter((valueLocalization: any) => !!valueLocalization.value) })) || []
		}

		try {
			const reqBody: any = {
				nameLocalizations: formData.nameLocalizations.filter((nameLocalization: any) => !!nameLocalization.value),
				valueType: formData.valueType,
				values,
				unitType
			}
			await patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID }, reqBody)
			dispatch(getCategoryParameter(parameterID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID })
			history.push(t('paths:category-parameters'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam parametrov kategórií'),
				link: t('paths:category-parameters')
			},
			{
				name: t('loc:Vytvoriť parameter kategórie')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:category-parameters')} />
			</Row>
			<div className='content-body small mt-2'>
				<Spin spinning={parameter.isLoading}>
					<CategoryParamsForm onSubmit={handleSubmit} onDelete={handleDelete} />
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(EditCategoryParamsPage)