import React, { useEffect } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Row } from 'antd'
import { initialize } from 'redux-form'
import { useNavigate } from 'react-router-dom'

// components
import { isEmpty } from 'lodash'
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES, PARAMETERS_UNIT_TYPES } from '../../utils/enums'
import { postReq } from '../../utils/request'

// types
import { IBreadcrumbs, ICategoryParamForm } from '../../types/interfaces'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const CreateCategoryParamsPage = () => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [backUrl] = useBackUrl(t('paths:category-parameters'))

	useEffect(() => {
		dispatch(
			initialize(FORM.CATEGORY_PARAMS, {
				nameLocalizations: EMPTY_NAME_LOCALIZATIONS,
				valueType: PARAMETERS_VALUE_TYPES.ENUM,
				localizedValues: [{ valueLocalizations: EMPTY_NAME_LOCALIZATIONS }],
				values: [{ value: null }]
			})
		)
	}, [dispatch])

	const handleDeleteValue = async (categoryParameterValueID?: string, removeIndex?: (index: number) => void, index?: number) => {
		// NOTE: pri create stave staci zmazat len z field arrayu item nakolko ID este nie je v DB ulozene
		if (removeIndex) {
			removeIndex(index as number)
		}
	}

	const handleSubmit = async (formData: ICategoryParamForm) => {
		let values = []
		let unitType: PARAMETERS_UNIT_TYPES | null = null

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
				unitType
			}

			const { data } = await postReq('/api/b2b/admin/enums/category-parameters/', {}, reqBody)
			const categoryParameterID = data.categoryParameter.id

			await Promise.all(
				// eslint-disable-next-line array-callback-return,consistent-return
				values.map((valueItem: any) => {
					// Iba nad tymi spravit request krore nemaju prazdne hodnoty valueLocalizations (prazdne pole)
					if (!isEmpty(valueItem.valueLocalizations)) {
						if (unitType === PARAMETERS_UNIT_TYPES.MINUTES) {
							return postReq('/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/', { categoryParameterID }, { value: valueItem.value.toString() })
						}
						return postReq(
							'/api/b2b/admin/enums/category-parameters/{categoryParameterID}/values/',
							{ categoryParameterID },
							{ valueLocalizations: valueItem.valueLocalizations }
						)
					}
				})
			)

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
				name: t('loc:Vytvoriť parameter kategórie')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:category-parameters')} />
			</Row>
			<div className='content-body small'>
				<CategoryParamsForm onDeleteValue={handleDeleteValue} onSubmit={handleSubmit} />
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(CreateCategoryParamsPage)
