import React, { useEffect, FC, useState } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'

// redux
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION, FORM, DEFAULT_DATE_INIT_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import { ISmsCreditPartnerPageQueryParams } from '../../schemas/queryParams'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// components
import RemainingSmsCredit from '../../components/Dashboards/RemainingSmsCredit'
import SmsStats from '../../components/Dashboards/SmsStats'
import SmsHistory from './components/SmsHistory'
import SmsTimeStats from '../../components/Dashboards/SmsTimeStats'
import Alert from '../../components/Dashboards/Alert'

// redux
import { getSmsHistory, getSmsTimeStatsForSalon } from '../../reducers/sms/smsActions'

const SmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)
	const smsHistory = useSelector((state: RootState) => state.sms.history)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const walletID = selectedSalon?.data?.wallet?.id

	const [query, setQuery] = useState<ISmsCreditPartnerPageQueryParams>({
		order: 'createdAt:desc',
		limit: 25,
		page: 1,
		date: dayjs().startOf('month')
	})

	useEffect(() => {
		if (!walletID || salonID !== selectedSalon.data?.id) {
			return
		}
		dispatch(
			getSmsHistory({
				salonID,
				page: query.page,
				limit: query.limit,
				search: query.search,
				order: query.order,
				dateFrom: query.date.startOf('month').format(DEFAULT_DATE_INIT_FORMAT),
				dateTo: query.date.endOf('month').format(DEFAULT_DATE_INIT_FORMAT)
			})
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, query.date, salonID, walletID, selectedSalon.data?.id])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_HISTORY_FILTER, { search: query.search }))
	}, [query.search, dispatch])

	useEffect(() => {
		if (!walletID || salonID !== selectedSalon.data?.id) {
			return
		}
		dispatch(getSmsTimeStatsForSalon(salonID, query.date.year(), query.date.month() + 1))
	}, [dispatch, salonID, query.date, selectedSalon.data?.id, walletID])

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

			<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto mt-10'>
				{!walletID ? (
					<Alert
						id={'sms-credit-no-wallet-id'}
						className='mt-6'
						title={t('loc:Nastavte si adresu salóna')}
						subTitle={t(
							'loc:Aby ste mohli používať kreditný systém so všetkými jeho výhodami, najprv musíte mať vyplnenú adresu vášho salóna. Prejdite do nastavení Detailu salóna.'
						)}
						message={''}
						actionLabel={t('loc:Nastaviť adresu')}
						icon={<SettingIcon />}
						onActionItemClick={() => navigate(parentPath as string)}
					/>
				) : (
					<>
						<Alert
							className='mb-6'
							title={t('loc:Nastavte si SMS notifikácie')}
							subTitle={t('loc:Prejdite do nastavení rezervačného systému a nastavte si SMS notifikácie podľa vašich preferencií')}
							actionLabel={t('loc:Nastaviť SMS notifikácie')}
							icon={<SettingIcon />}
							onActionItemClick={() => navigate(`${parentPath}${t('paths:reservations-settings')}`)}
						/>

						<div className={'flex gap-4 mb-10 flex-col lg:flex-row'}>
							<RemainingSmsCredit salonID={salonID} parentPath={parentPath} walletID={walletID} />
							<SmsStats salonID={salonID} />
						</div>

						<SmsTimeStats
							onPickerChange={(date) => {
								if (date) {
									setQuery({
										...query,
										date
									})
								}
							}}
							selectedDate={query.date}
							className={'mb-6 pb-0'}
							smsTimeStats={smsTimeStats}
							loading={selectedSalon.isLoading}
						/>
						<SmsHistory smsHistory={smsHistory} query={query} setQuery={setQuery} />
					</>
				)}
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET]))(SmsCreditPage)
