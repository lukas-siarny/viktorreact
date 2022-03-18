import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'antd'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'
import { RootState } from '../../reducers'

// components
import CategoriesTree from './components/CategoriesTree'

// utils
import { ROW_GUTTER_X_DEFAULT } from '../../utils/enums'

const CategoriesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getCategories())
	}, [])

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<CategoriesTree />
				</div>
			</Col>
		</Row>
	)
}

export default CategoriesPage
