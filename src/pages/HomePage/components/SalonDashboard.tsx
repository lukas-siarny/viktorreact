import React, { FC, useEffect, useCallback, PropsWithChildren, useState } from 'react'
import { Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

// redux
import { RootState } from '../../../reducers'
import { getServices } from '../../../reducers/services/serviceActions'
import { getActiveEmployees } from '../../../reducers/employees/employeesActions'
import { getCustomers } from '../../../reducers/customers/customerActions'
import { getSmsTimeStatsForSalon } from '../../../reducers/sms/smsActions'
import { getPendingReservationsCount } from '../../../reducers/calendar/calendarActions'

// utils
import { PERMISSION, RESERVATION_STATE, RESERVATIONS_STATE, SALON_STATES } from '../../../utils/enums'
import Permissions, { checkPermissions } from '../../../utils/Permissions'

// components
import Alert from '../../../components/Dashboards/Alert'
import Statistics from '../../../components/Dashboards/Statistics'
import Wallet from '../../../components/Dashboards/RemainingSmsCredit'
import SmsTimeStats from '../../../components/Dashboards/SmsTimeStats'
import Voucher from './Voucher'

// assets
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-off-pink.svg'
import { ReactComponent as SettingIcon } from '../../../assets/icons/setting.svg'

// schema
import { ISalonReservationsPageURLQueryParams } from '../../../schemas/queryParams'

// hooks
import { formatObjToQuery } from '../../../hooks/useQueryParamsZod'

const SMS_TIME_STATS_PERMISSIONS = [PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET]

const pendingReservationsQueryString = formatObjToQuery<ISalonReservationsPageURLQueryParams>({
	state: RESERVATIONS_STATE.PENDING,
	reservationStates: [RESERVATION_STATE.PENDING]
})

const SalonDashboard: FC<PropsWithChildren> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { children } = props

	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)
	const { services } = useSelector((state: RootState) => state.service)
	const { activeEmployees } = useSelector((state: RootState) => state.employees)
	const { customers } = useSelector((state: RootState) => state.customers)
	const pendingReservationsCount = useSelector((state: RootState) => state.calendar.pendingReservationsCount)
	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const salonPermission = selectedSalon?.data?.uniqPermissions
	const salonID = selectedSalon.data?.id
	const walletID = selectedSalon.data?.wallet?.id

	const loading = selectedSalon?.isLoading || services?.isLoading || activeEmployees?.isLoading || customers?.isLoading || pendingReservationsCount.isLoading
	const basePath = t('paths:salons/{{salonID}}', { salonID: selectedSalon?.data?.id })

	const [smsStatsDate, setSmsStatsDate] = useState(dayjs())

	const getPath = useCallback((pathSuffix: string) => `${basePath}${pathSuffix}`, [basePath])

	useEffect(() => {
		if (selectedSalon?.data?.id) {
			dispatch(getServices({ salonID: selectedSalon.data.id }, true))
			dispatch(getCustomers({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getActiveEmployees({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getPendingReservationsCount(selectedSalon.data.id))
		}
	}, [dispatch, selectedSalon?.data?.id])

	useEffect(() => {
		if (salonID && checkPermissions([...authUserPermissions, ...(salonPermission || [])], SMS_TIME_STATS_PERMISSIONS)) {
			dispatch(getSmsTimeStatsForSalon(salonID, smsStatsDate.year(), smsStatsDate.month() + 1))
		}
	}, [dispatch, salonID, smsStatsDate, authUserPermissions, salonPermission])

	return loading ? (
		<div className='w-full text-center'>
			<Spin spinning={true} />
		</div>
	) : (
		<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto'>
			{selectedSalon?.data && salonID ? (
				<div>
					{/* hidden salon */}
					{selectedSalon.data?.state === SALON_STATES.NOT_PUBLISHED && selectedSalon.data?.publicationDeclineReason && (
						<Alert
							className='mb-8'
							title={t('loc:Skrytý salón')}
							subTitle={`${t('loc:Salón bol skrytý z dôvodu')}:`}
							message={selectedSalon.data?.publicationDeclineReason}
							actionLabel={t('loc:Upraviť údaje salónu')}
							icon={<EyeOffIcon />}
							onActionItemClick={() => navigate(basePath)}
						/>
					)}
					{/* declined salon */}
					{(selectedSalon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || selectedSalon.data?.state === SALON_STATES.PUBLISHED_DECLINED) && (
						<Alert
							className='mb-8'
							title={t('loc:Zamietnutý salón')}
							subTitle={`${t('loc:Salón bol zamietnutý z dôvodu')}:`}
							message={selectedSalon.data?.publicationDeclineReason ?? t('loc:Bez udania dôvodu.')}
							actionLabel={t('loc:Upraviť údaje salónu')}
							onActionItemClick={() => navigate(basePath)}
						/>
					)}
					{/* Voucher */}
					<div className={'mb-14'}>
						<h2>{t('loc:Notino kupón')}</h2>
						<p>{t('loc:Skopírujte kód zľavového kupónu, uplatnite si ho na svoju objednávku v Notino aplikácii a užívajte si výhodné nakupovanie!')}</p>
						<Voucher code={selectedSalon.data.b2bVoucher} />
					</div>
					{/* Statisctics */}
					<h2>{t('loc:Štatistiky')}</h2>
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 3xl:grid-cols-6 mb-14'>
						<Statistics
							title={t('loc:Rezervácie čakajúce na schválenie')}
							count={pendingReservationsCount.count}
							onActionItemClick={() => navigate(getPath(`${t('paths:salon-reservations')}${pendingReservationsQueryString}`))}
						/>
						<Statistics
							title={t('loc:Služby (všetky)')}
							count={services?.listData?.industries.servicesCount}
							onActionItemClick={() => navigate(getPath(t('paths:services-settings')))}
						/>
						<Statistics
							title={t('loc:Služby dostupné pre online rezervácie')}
							count={services?.listData?.industries.servicesAvailableForOnlineReservationsCount}
							onActionItemClick={() => navigate(getPath(t('paths:services-settings')))}
						/>
						<Statistics
							title={t('loc:Počet zákazníkov')}
							count={customers.data?.pagination.totalCount}
							onActionItemClick={() => navigate(getPath(t('paths:customers')))}
						/>
						<Statistics
							title={t('loc:Počet zamestnancov')}
							count={activeEmployees?.data?.pagination.totalCount ?? 0}
							onActionItemClick={() => navigate(getPath(t('paths:employees')))}
						/>
						<Statistics title={t('loc:Vyplnenosť profilu')} count={`${selectedSalon.data.fillingProgressSalon}%`} onActionItemClick={() => navigate(basePath)} />
					</div>
					<Permissions allowed={SMS_TIME_STATS_PERMISSIONS}>
						{!walletID ? (
							<Alert
								className='mt-6'
								title={t('loc:Nastavte si adresu salóna')}
								subTitle={t(
									'loc:Aby ste mohli používať kreditný systém so všetkými jeho výhodami, najprv musíte mať vyplnenú adresu vášho salóna. Prejdite do nastavení Detailu salóna.'
								)}
								message={''}
								actionLabel={t('loc:Nastaviť adresu')}
								icon={<SettingIcon />}
								onActionItemClick={() => navigate(basePath)}
							/>
						) : (
							<>
								{/* wallet */}
								<h2>{t('loc:SMS kredit')}</h2>
								<div className={'grid lg:grid-cols-2 gap-4 3xl:gap-8 empty:mt-0'}>
									<Wallet salonID={salonID} parentPath={basePath} className={'!w-auto'} walletID={walletID} />
								</div>
								{/* sms monthly stats */}
								<SmsTimeStats
									onPickerChange={(date) => {
										if (date) {
											setSmsStatsDate(date)
										}
									}}
									title={<h2 className={'mb-0'}>{t('loc:Spotreba SMS kreditu za obdobie')}</h2>}
									selectedDate={smsStatsDate}
									className={'mb-6 mt-10 pb-0'}
									smsTimeStats={smsTimeStats}
								/>
							</>
						)}
					</Permissions>
				</div>
			) : (
				children
			)}
		</div>
	)
}

export default SalonDashboard
