import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'antd'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// components
import CategoriesTree from './components/CategoriesTree'

// utils
import { ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import Breadcrumbs from '../../components/Breadcrumbs'
import { getPath } from '../../utils/history'
import { IBreadcrumbs } from '../../types/interfaces'

const CategoriesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getCategories())
	}, [])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Správa kategórií')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={getPath(t('paths:home'))} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<CategoriesTree />
					</div>
				</Col>
			</Row>
		</>
	)
}

export default CategoriesPage
