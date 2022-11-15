import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import ReservationSystemSettingsForm from './components/ReservationSystemSettingsForm'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, SalonSubPageProps, IReservationSystemSettingsForm } from '../../types/interfaces'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const SalonSettingsPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const { salonID, parentPath } = props

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenia rezervačného systému')
			}
		]
	}

	const submitSettings = async (formData: IReservationSystemSettingsForm) => {
		// TODO
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={false}>
							{/* <Permissions allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_CREATE]} render={() => <ServicesFilter onSubmit={handleSubmit} />} /> */}
							<ReservationSystemSettingsForm onSubmit={submitSettings} salonID={salonID} />
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default withPermissions(permissions)(SalonSettingsPage)
