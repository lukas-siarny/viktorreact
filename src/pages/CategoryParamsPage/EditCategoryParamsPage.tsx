import React, { useEffect } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Spin } from 'antd'
import { initialize } from 'redux-form'
import { useNavigate, useParams } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// redux
import { getCategoryParameter } from '../../reducers/categoryParams/categoryParamsActions'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES, PARAMETERS_UNIT_TYPES } from '../../utils/enums'
import { normalizeNameLocalizations } from '../../utils/helper'
import { patchReq, deleteReq } from '../../utils/request'

// types
import { IBreadcrumbs, ICategoryParamForm } from '../../types/interfaces'
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const EditCategoryParamsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { parameterID } = useParams<Required<{ parameterID: string }>>()

	const parameter = useSelector((state: RootState) => state.categoryParams.parameter)

	const [backUrl] = useBackUrl(t('paths:category-parameters'))

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await dispatch(getCategoryParameter(parameterID as string))

			if (data) {
				dispatch(
					initialize(FORM.CATEGORY_PARAMS, {
						valueType: data.valueType,
						nameLocalizations: normalizeNameLocalizations(data.nameLocalizations),
						localizedValues:
							data.valueType === PARAMETERS_VALUE_TYPES.TIME
								? [{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }]
								: data.values.map((item) => ({ valueLocalizations: normalizeNameLocalizations(item.valueLocalizations || []) })),
						values:
							data.valueType === PARAMETERS_VALUE_TYPES.ENUM
								? [{ value: null }]
								: data.values.map((item) => ({
										value: item.value
								  }))
					})
				)
			}
		}

		fetchData()
	}, [dispatch, parameterID])

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
			await patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string }, reqBody)
			dispatch(getCategoryParameter(parameterID as string))
			dispatch(initialize(FORM.CATEGORY_PARAMS, formData))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string })
			navigate(t('paths:category-parameters'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam parametrov kategórií'),
				link: backUrl
			},
			{
				name: t('loc:Upraviť parameter kategórie')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:category-parameters')} />
			</Row>
			<div className='content-body small'>
				<Spin spinning={parameter.isLoading}>
					<CategoryParamsForm onSubmit={handleSubmit} onDelete={handleDelete} />
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(EditCategoryParamsPage)
