import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { compose } from 'redux'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// components
import CategoriesTree from './components/CategoriesTree'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'

const CategoriesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { isLoading } = useSelector((state: RootState) => state.categories.categories)

	useEffect(() => {
		dispatch(getCategories())
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={24}>
						<div className='content-body'>
							<CategoriesTree />
						</div>
					</Col>
				</Row>
			</Spin>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(CategoriesPage)
