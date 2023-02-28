import React, { useEffect } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Spin } from 'antd'
import { getFormValues, initialize, getFormInitialValues } from 'redux-form'
import { useNavigate, useParams } from 'react-router-dom'

// components
import { difference, forEach, isEmpty } from 'lodash'
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// redux
import { getCategoryParameter } from '../../reducers/categoryParams/categoryParamsActions'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES, PARAMETERS_UNIT_TYPES } from '../../utils/enums'
import { normalizeNameLocalizations } from '../../utils/helper'
import { patchReq, deleteReq, postReq } from '../../utils/request'

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
	const initFormValues: any = useSelector((state: RootState) => getFormInitialValues(FORM.CATEGORY_PARAMS)(state))

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await dispatch(getCategoryParameter(parameterID as string))
			if (!data?.id) {
				navigate('/404')
			}

			if (data) {
				dispatch(
					initialize(FORM.CATEGORY_PARAMS, {
						valueType: data.valueType,
						nameLocalizations: normalizeNameLocalizations(data.nameLocalizations),
						localizedValues:
							data.valueType === PARAMETERS_VALUE_TYPES.TIME
								? [{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }]
								: data.values.map((item) => ({ valueLocalizations: normalizeNameLocalizations(item.valueLocalizations || []), id: item.id })),
						values:
							data.valueType === PARAMETERS_VALUE_TYPES.ENUM
								? [{ value: null }]
								: data.values.map((item) => ({
										value: item.value,
										id: item.id
								  }))
					})
				)
			}
		}

		fetchData()
	}, [dispatch, parameterID])

	const handleSubmit = async (formData: ICategoryParamForm) => {
		let values: any = []
		let unitType = null

		if (formData.valueType === PARAMETERS_VALUE_TYPES.TIME) {
			unitType = PARAMETERS_UNIT_TYPES.MINUTES
			values = formData.values.filter((item) => item.value).map((item: any) => ({ value: item.value.toString(), id: item.id }))
		} else {
			values =
				formData.localizedValues?.map((item: any) => ({ valueLocalizations: item.valueLocalizations.filter((valueLocalization: any) => !!valueLocalization.value) })) || []
		}

		try {
			const reqBody: any = {
				nameLocalizations: formData.nameLocalizations.filter((nameLocalization: any) => !!nameLocalization.value),
				valueType: formData.valueType,
				unitType
			}
			// console.log('formData', formData)
			// console.log('reqBody', reqBody)
			// console.log('initFormValues', initFormValues)
			// console.log('values', values)
			const nonNullableInitNameLocalizations = initFormValues?.nameLocalizations.filter((nameLocalization: any) => !!nameLocalization.value)
			const hasDiffrence = difference(nonNullableInitNameLocalizations, reqBody.nameLocalizations)

			if (unitType === PARAMETERS_UNIT_TYPES.MINUTES) {
				const changedValues = values?.filter((obj1: any) => !initFormValues?.values?.some((obj2: any) => obj1.value.toString() === obj2.value.toString()))
				const requests: any[] = changedValues.map((valueItem: any) => {
					// Ak existuje ID tak sa urobi update
					if (valueItem.id) {
						return patchReq(
							'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/{categoryParameterValueID}',
							{ categoryParameterID: parameterID as string, categoryParameterValueID: valueItem.id },
							{ value: valueItem.value.toString() }
						)
						// Ak sa prida novy parameter tak sa vytvori
					}
					return postReq(
						'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/',
						{ categoryParameterID: parameterID as string },
						{ value: valueItem.value.toString() }
					)
				})

				await Promise.all([
					// Iba ak sa zmenili nameLocalizations tak sa zavola request nad patchom
					!isEmpty(hasDiffrence) && patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string }, reqBody),
					...requests
				])
			} else {
				// TODO: pre jazykove mutacie spravit obdobnu logiku + porovnavanie poli
				const initLocalizedValues = initFormValues.localizedValues.map((localizedValue: any) => localizedValue.valueLocalizations)
				const formLocalizedValues = formData.localizedValues.map((localizedValue: any) => localizedValue.valueLocalizations)
				console.log('initLocalizedValues', initLocalizedValues)
				console.log('formLocalizedValues', formLocalizedValues)
				const requests: any[] = formData.localizedValues.map((valueItem: any) => {
					// Ak existuje ID tak sa urobi update
					if (valueItem.id) {
						return patchReq(
							'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/{categoryParameterValueID}',
							{ categoryParameterID: parameterID as string, categoryParameterValueID: valueItem.id },
							{ valueLocalizations: valueItem.valueLocalizations.filter((nameLocalization: any) => !!nameLocalization.value) }
						)
						// Ak sa prida novy parameter tak sa vytvori
					}
					return postReq(
						'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/',
						{ categoryParameterID: parameterID as string },
						{ valueLocalizations: valueItem.valueLocalizations.filter((nameLocalization: any) => !!nameLocalization.value) }
					)
				})
				await Promise.all([
					// Iba ak sa zmenili nameLocalizations tak sa zavola request nad patchom
					!isEmpty(hasDiffrence) && patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string }, reqBody),
					...requests
				])
			}
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
