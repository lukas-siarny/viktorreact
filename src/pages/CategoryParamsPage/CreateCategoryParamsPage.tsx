import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Spin } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
import { map, get } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CategoryParamsForm from './components/CategoryParamsForm'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// reducers
import { RootState } from '../../reducers'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, PARAMETERS_VALUE_TYPES } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'

// types
import { IBreadcrumbs } from '../../types/interfaces'

const CreateCategoryParamsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			initialize(FORM.CATEGORY_PARAMS, {
				nameLocalizations: EMPTY_NAME_LOCALIZATIONS,
				valueType: PARAMETERS_VALUE_TYPES.ENUM,
				values: [{ value: null, valueLocalizations: EMPTY_NAME_LOCALIZATIONS }]
			})
		)
	}, [dispatch])

	const handleSubmit = async (formData: any) => {
		console.log('🚀 ~ file: CreateCategoryParamsPage.tsx ~ line 40 ~ handleSubmit ~ formData', formData)
		let values = []

		if (formData.valueType === PARAMETERS_VALUE_TYPES.TIME) {
			values = formData.values.map((item: any) => ({ value: item.value }))
		} else {
			values = formData.values.map((item: any) => ({ valueLocalizations: item.valueLocalizations.filter((valueLocalization: any) => !!valueLocalization.value) }))
		}

		try {
			// TODO
			const reqBody = {
				nameLocalizations: formData.nameLocalizations.filter((nameLocalization: any) => !!nameLocalization.value),
				valueType: formData.valueType,
				values
			}
			const { data } = await postReq('/api/b2b/admin/enums/category-parameters/', {}, reqBody as any)
			history.push(t('paths:category-parameters/{{parameterID}}', { parameterID: data.categoryParameter.id }))
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
				<CategoryParamsForm onSubmit={handleSubmit} />
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CreateCategoryParamsPage)
