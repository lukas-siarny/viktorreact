import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'
import { useDispatch } from 'react-redux'
import { compose } from 'redux'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

const Calendar2 = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Kalendár 1')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>

			<div className='content-body'>{'TU pojde kalendar 2'}</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar2)
