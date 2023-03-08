import React, { FC, useEffect, useCallback, PropsWithChildren, useState } from 'react'
import { Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

// redux
import { RootState } from '../../../reducers'
import { getServices } from '../../../reducers/services/serviceActions'
import { getEmployees } from '../../../reducers/employees/employeesActions'
import { getCustomers } from '../../../reducers/customers/customerActions'

// utils
import { PERMISSION, SALON_STATES } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// components
import Alert from '../../../components/Dashboards/Alert'
import Statistics from '../../../components/Dashboards/Statistics'
import RemainingSmsCredit from '../../../components/Dashboards/RemainingSmsCredit'
import SmsTimeStats from '../../../components/Dashboards/SmsTimeStats'

// assets
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-off-pink.svg'
import { ReactComponent as SettingIcon } from '../../../assets/icons/setting.svg'

const SalonDashboard: FC<PropsWithChildren> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { children } = props

	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)
	const { services } = useSelector((state: RootState) => state.service)
	const { employees } = useSelector((state: RootState) => state.employees)
	const { customers } = useSelector((state: RootState) => state.customers)
	const salonID = selectedSalon.data?.id
	const walletID = selectedSalon.data?.wallet?.id

	const loading = selectedSalon?.isLoading || services?.isLoading || employees?.isLoading || customers?.isLoading
	const basePath = t('paths:salons/{{salonID}}', { salonID: selectedSalon?.data?.id })

	const [smsStatsDate, setSmsStatsDate] = useState(dayjs())

	const getPath = useCallback((pathSuffix: string) => `${basePath}${pathSuffix}`, [basePath])

	useEffect(() => {
		if (selectedSalon?.data) {
			dispatch(getServices({ salonID: selectedSalon.data.id }))
			dispatch(getCustomers({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getEmployees({ salonID: selectedSalon.data.id, page: 1 }))
		}
	}, [dispatch, selectedSalon?.data])

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

					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 3xl:gap-8'>
						<Statistics
							title={t('loc:Počet zákazníkov')}
							count={customers.data?.pagination.totalCount}
							onActionItemClick={() => navigate(getPath(t('paths:customers')))}
						/>
						<Statistics
							title={t('loc:Počet aktívnych služieb')}
							count={services?.tableData?.length}
							onActionItemClick={() => navigate(getPath(t('paths:services-settings')))}
						/>
						<Statistics
							title={t('loc:Počet zamestnancov')}
							count={employees?.data?.pagination.totalCount}
							onActionItemClick={() => navigate(getPath(t('paths:employees')))}
						/>
						<Statistics title={t('loc:Vyplnenosť profilu')} count={`${selectedSalon.data.fillingProgressSalon}%`} onActionItemClick={() => navigate(basePath)} />
					</div>
					<Permissions allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET]}>
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
								<div className={'grid lg:grid-cols-2 gap-4 3xl:gap-8 mt-10 empty:mt-0'}>
									<RemainingSmsCredit salonID={salonID} parentPath={basePath} className={'!w-auto'} walletID={walletID} />
								</div>
								{/* sms monthly stats */}
								<SmsTimeStats
									onPickerChange={(date) => {
										if (date) {
											setSmsStatsDate(date)
										}
									}}
									title={<h3>{t('loc:Spotreba SMS kreditu za obdobie')}</h3>}
									salonID={salonID}
									selectedDate={smsStatsDate}
									className={'mb-6 mt-10 pb-0'}
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
