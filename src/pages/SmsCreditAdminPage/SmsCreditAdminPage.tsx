import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import SmsUnitPricesTable from './components/SmsUnitPricesTable'
import SmsTimeStats from '../../components/Dashboards/SmsTimeStats'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// utils
import { PERMISSION } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { RootState } from '../../reducers'
import { getSmsTimeStatsForCountry } from '../../reducers/sms/smsActions'

const SmsCreditAdiminPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [smsStatsDate, setSmsStatsDate] = useState(dayjs())
	const [smsStatsCountryCode, setSmsStatsCountryCode] = useState()

	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)

	useEffect(() => {
		if (smsStatsCountryCode) {
			dispatch(getSmsTimeStatsForCountry(smsStatsCountryCode, smsStatsDate.year(), smsStatsDate.month() + 1))
		}
	}, [dispatch, smsStatsCountryCode, smsStatsDate])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:SMS kredit')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			{/* <div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto mt-10'> */}
			<div className='content-body dashboard-content'>
				<div className={'w-full flex justify-end'}>
					<Permissions
						allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								onClick={() => {
									if (hasPermission) {
										navigate(t('paths:'))
									} else {
										openForbiddenModal()
									}
								}}
								type='primary'
								htmlType='button'
								className={'noti-btn'}
								icon={<PlusIcon />}
							>
								{t('loc:Dobiť kredity salónom')}
							</Button>
						)}
					/>
				</div>

				<SmsTimeStats
					onPickerChange={(date) => {
						if (date) {
							setSmsStatsDate(date)
						}
					}}
					title={<h3>{t('loc:Spotreba SMS kreditu za obdobie')}</h3>}
					selectedDate={smsStatsDate}
					smsTimeStats={smsTimeStats}
					className={'mb-6 mt-10 pb-0'}
				/>
				<SmsUnitPricesTable />
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO]))(SmsCreditAdiminPage)
