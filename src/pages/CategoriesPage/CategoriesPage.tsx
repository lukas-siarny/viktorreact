import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'antd'
import { compose } from 'redux'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// components
import CategoriesTree from './components/CategoriesTree'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

const browsePermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]

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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:home')} />
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

export default compose(withPermissions(browsePermissions))(CategoriesPage)
