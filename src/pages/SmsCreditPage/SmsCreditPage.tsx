import React, { useEffect, FC, useMemo } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'
import { useNavigate } from 'react-router'
import dayjs, { Dayjs } from 'dayjs'

// redux
import { RootState } from '../../reducers'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION, FORM, DEFAULT_DATE_INIT_FORMAT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import Alert from '../../components/Dashboards/Alert'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// components
import Wallet from '../../components/Dashboards/Wallet'
import SmsStats from '../../components/Dashboards/SmsStats'
import SmsHistory from './components/SmsHistory'
import SmsTimeStats from '../../components/Dashboards/SmsTimeStats'

// redux
import { getSmsHistory } from '../../reducers/sms/smsActions'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'

const getQueryParamDate = (date: Dayjs) => date.startOf('month').format('YYYY-MM')

const SmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const smsHistory = useSelector((state: RootState) => state.sms.history)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		order: StringParam('createdAt:desc'),
		limit: NumberParam(25),
		page: NumberParam(1),
		date: StringParam(getQueryParamDate(dayjs()))
	})

	const validSelectedDate = useMemo(() => (dayjs(query.date).isValid() ? dayjs(query.date) : dayjs()), [query.date])

	useEffect(() => {
		dispatch(
			getSmsHistory({
				salonID,
				page: query.page,
				limit: query.limit,
				search: query.search,
				order: query.order,
				dateFrom: validSelectedDate.startOf('month').format(DEFAULT_DATE_INIT_FORMAT),
				dateTo: validSelectedDate.endOf('month').format(DEFAULT_DATE_INIT_FORMAT)
			})
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, validSelectedDate, salonID])

	useEffect(() => {
		dispatch(initialize(FORM.SMS_HISTORY_FILTER, { search: query.search }))
	}, [query.search, dispatch])

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
				{!selectedSalon?.data?.wallet?.id ? (
					<Alert
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
						<div className={'flex gap-4 mb-10'}>
							<Wallet salonID={salonID} parentPath={parentPath} />
							<SmsStats salonID={salonID} />
						</div>
						<SmsTimeStats
							onPickerChange={(date) => {
								if (date) {
									setQuery({
										...query,
										date: getQueryParamDate(date)
									})
								}
							}}
							salonID={salonID}
							selectedDate={validSelectedDate}
							className={'mb-6 pb-0'}
						/>
						<SmsHistory smsHistory={smsHistory} query={query} setQuery={setQuery} />
					</>
				)}
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET]))(SmsCreditPage)
