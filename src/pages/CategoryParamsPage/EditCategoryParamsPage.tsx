import React, { useEffect, useState, useCallback } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Spin } from 'antd'
import { initialize, getFormInitialValues } from 'redux-form'
import { useNavigate, useParams } from 'react-router-dom'
import { difference, isEmpty } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// redux
import { getCategoryParameter } from '../../reducers/categoryParams/categoryParamsActions'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES, PARAMETERS_UNIT_TYPES, NOTIFICATION_TYPE } from '../../utils/enums'
import { normalizeNameLocalizations } from '../../utils/helper'
import { patchReq, deleteReq, postReq } from '../../utils/request'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'

// schema
import { ICategoryParamsForm } from '../../schemas/categoryParams'

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

	const [isRemoving, setIsRemoving] = useState(false)

	const fetchData = useCallback(async () => {
		const { data } = await dispatch(getCategoryParameter(parameterID as string))
		if (!data?.id) {
			navigate('/404')
		} else {
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
									value: Number(item.value),
									id: item.id
							  }))
				})
			)
		}
	}, [dispatch, navigate, parameterID])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleSubmit = async (formData: ICategoryParamsForm) => {
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

			const hasDiffrenceParameter = difference(formData.nameLocalizations, initFormValues?.nameLocalizations)
			if (unitType === PARAMETERS_UNIT_TYPES.MINUTES) {
				const changedValues = values?.filter((obj1: any) => !initFormValues?.values?.some((obj2: any) => obj1.value === obj2.value))
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
					!isEmpty(hasDiffrenceParameter) &&
						patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string }, reqBody),
					...requests
				])
			} else {
				// Zmene hodnoty localizedValues - zamedzi sa volaniu zbytocnych requestov aj pre tych ktore sa nezmenili
				const changedValues = difference(formData.localizedValues, initFormValues.localizedValues)
				const requests: any[] = changedValues.map((valueItem: any) => {
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
					!isEmpty(hasDiffrenceParameter) &&
						patchReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}', { categoryParameterID: parameterID as string }, reqBody),
					...requests
				])
			}
			fetchData()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}
	const handleDeleteValue = async (categoryParameterValueID?: string) => {
		if (isRemoving) {
			return
		}
		try {
			// UPDATE parameter
			if (parameterID) {
				if (categoryParameterValueID) {
					setIsRemoving(true)
					await deleteReq(
						'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/{categoryParameterValueID}',
						{ categoryParameterID: parameterID, categoryParameterValueID },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				}

				setIsRemoving(false)
				// Po delete initni formular aby sa dal zasa pristine a disabled state spravne (aj po BE zmazani, aj po tom ak sa zmazal item ktory nebol ulozeny v DB)
				if (fetchData) {
					await fetchData()
				}
			}
		} catch (e) {
			setIsRemoving(false)
			// eslint-disable-next-line no-console
			console.error(e)
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
					<CategoryParamsForm onSubmit={handleSubmit} onDeleteValue={handleDeleteValue} onDelete={handleDelete} />
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(EditCategoryParamsPage)
