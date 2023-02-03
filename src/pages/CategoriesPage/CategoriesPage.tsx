import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { compose } from 'redux'

// reducers
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { getCategoryParameters } from '../../reducers/categoryParams/categoryParamsActions'

// components
import CategoriesTree from './components/CategoriesTree'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, ADMIN_PERMISSIONS } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

const CategoriesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { isLoading } = useSelector((state: RootState) => state.categories.categories)

	useEffect(() => {
		dispatch(getCategories())
		dispatch(getCategoryParameters())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam kategórií')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={isLoading}>
							<CategoriesTree />
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([...ADMIN_PERMISSIONS, PERMISSION.ENUM_EDIT]))(CategoriesPage)
