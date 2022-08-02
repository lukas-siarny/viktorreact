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
import { LOCALES } from '../../components/LanguagePicker'

// reducers
import { RootState } from '../../reducers'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, DEFAULT_LANGUAGE } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'
import { normalizeNameLocalizations } from '../../utils/helper'

// types
import { IBreadcrumbs } from '../../types/interfaces'

const emptyNameLocalizations = Object.keys(LOCALES)
	.sort((a: string, b: string) => {
		if (a === DEFAULT_LANGUAGE) {
			return -1
		}
		return b === DEFAULT_LANGUAGE ? 1 : 0
	})
	.map((language) => ({ language }))

const CreateCategoryParamsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			initialize(FORM.CATEGORY_PARAMS, {
				nameLocalizations: emptyNameLocalizations,
				valuesInMinutes: false,
				values: [{ value: '', valueLocalizations: emptyNameLocalizations }]
			})
		)
	}, [dispatch])

	const handleSubmit = async (formData: any) => {
		try {
			// TODO
			const reqBody = {}
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
