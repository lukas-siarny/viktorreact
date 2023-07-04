import React, { FC, useEffect, useCallback, PropsWithChildren, useState } from 'react'
import { Button, Modal, Spin } from 'antd'
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
import { arrayBufferToBase64, handleAuthorizedDownload } from '../../../utils/helper'
import { getReq } from '../../../utils/request'

// components
import Alert from '../../../components/Dashboards/Alert'
import Statistics from '../../../components/Dashboards/Statistics'
import Wallet from '../../../components/Dashboards/RemainingSmsCredit'
import SmsTimeStats from '../../../components/Dashboards/SmsTimeStats'
import Voucher from './Voucher'

// assets
import { ReactComponent as EyeOffIcon } from '../../../assets/icons/eye-hidden-icon.svg'
import { ReactComponent as SettingIcon } from '../../../assets/icons/setting-icon.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as QrCodeIcon } from '../../../assets/icons/qr-code-icon.svg'

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
	const [visibleQrCode, setVisibleQrCode] = useState(false)

	const getPath = useCallback((pathSuffix: string) => `${basePath}${pathSuffix}`, [basePath])

	const [qrCodeImage, setQrCodeImage] = useState('')

	useEffect(() => {
		if (selectedSalon?.data?.id) {
			dispatch(getServices({ salonID: selectedSalon.data.id }, true))
			dispatch(getCustomers({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getActiveEmployees({ salonID: selectedSalon.data.id, page: 1 }))
			dispatch(getPendingReservationsCount(selectedSalon.data.id))
			;(async () => {
				try {
					const { data } = await getReq(
						'/api/b2b/admin/salons/{salonID}/qr-code',
						{ salonID: selectedSalon?.data?.id as string, type: 'banner', ext: 'png' },
						{ responseType: 'arraybuffer' }
					)

					setQrCodeImage(`data:image/png;base64,${arrayBufferToBase64(data)}`)
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e)
				}
			})()
		}
	}, [dispatch, selectedSalon?.data?.id])

	// NOTE: docasne zakomentovane mozno sa v budcnosti prida tlacidlo na zatvaranie
	// const [showQrCode, setShowQrCode] = useState(true)

	// useEffect(() => {
	// 	const localStorageValue = localStorage.getItem('showQrCode')
	// 	setShowQrCode(localStorageValue !== 'false')
	// }, [])

	// const handleDivClose = () => {
	// 	localStorage.setItem('showQrCode', 'false')
	// 	setShowQrCode(false)
	// 	setVisible(true)
	// }
	useEffect(() => {
		if (walletID && salonID && checkPermissions([...authUserPermissions, ...(salonPermission || [])], SMS_TIME_STATS_PERMISSIONS)) {
			dispatch(getSmsTimeStatsForSalon(salonID, smsStatsDate.year(), smsStatsDate.month() + 1))
		}
	}, [dispatch, salonID, walletID, smsStatsDate, authUserPermissions, salonPermission])

	return loading ? (
		<div className='w-full text-center'>
			<Spin spinning={true} />
		</div>
	) : (
		<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto'>
			<Modal
				className='rounded-fields'
				title={
					<div className={'flex items-center'}>
						<QrCodeIcon width={24} height={24} className={'text-notino-black mr-2'} />
						{t('loc:QR kód nájdete v Detaile salónu')}
					</div>
				}
				centered
				open={visibleQrCode}
				footer={
					<Button onClick={() => setVisibleQrCode(false)} className={'noti-btn w-full'} type={'primary'} htmlType={'button'} download>
						{t('loc:Rozumiem')}
					</Button>
				}
				onCancel={() => setVisibleQrCode(false)}
				closeIcon={<CloseIcon />}
			>
				<p>{t('loc:Kedykoľvek sa budete chcieť vrátiť k svojmu QR kódu, nájdete ho v sekcii Detail salónu pod fotogalériou.')}</p>
			</Modal>
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
							icon={<EyeOffIcon className={'text-danger'} />}
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

					<div className={'w-full bg-notino-white shadow-lg mb-6 p-12 relative lg:min-h-[420px] overflow-hidden'}>
						<div
							className='hidden absolute top-0 right-0 h-full lg:block w-[700px] 2xl:w-[920px] bg-contain bg-no-repeat bg-bottom'
							style={{ backgroundImage: `url(${qrCodeImage})` }}
						/>
						<div className={'w-full lg:w-1/2'}>
							<h1>{t('loc:Naskenuj a rezervuj!')}</h1>
							<h4 className={'text-notino-grayDarker mb-4'}>
								{t('loc:Stiahnite si QR kód špeciálne vytvorený pre váš salón, a zdieľajte ho na svojich sociálnych sieťach alebo webe.')}
							</h4>
							<p className={'mb-6'}>
								{t(
									'loc:Po naskenovaní QR kódu sa vaši zákazníci dostanú priamo na váš profil v zákazníckej aplikácii Notino, vďaka čomu si u vás rezervujú termín ešte rýchlejšie a pohodlnejšie.'
								)}
							</p>
							{selectedSalon.data?.qrCodes?.map((item, index) => (
								<div className={'flex mr-2 flex-wrap'} key={index}>
									<Button
										className={'noti-btn w-min mr-2 mb-2'}
										href={'#'}
										rel='noopener noreferrer'
										type={'primary'}
										htmlType={'button'}
										onClick={(e) => handleAuthorizedDownload(e, item.link, item.name)}
										title={t('loc:Stiahnuť qr kód')}
										icon={<DownloadIcon width={24} />}
										download
									>
										{t('loc:Stiahnuť QR kód na tlač')}
									</Button>
								</div>
							))}
						</div>
						{/* // NOTE: docasne zakomentovane mozno sa v budcnosti prida tlacidlo na zatvaranie */}
						{/* <Button type={'link'} htmlType={'button'} className={'absolute top-6 right-6'} onClick={handleDivClose}> */}
						{/*	<span role='img'> */}
						{/*		<CloseIcon className={'text-black'} width={24} /> */}
						{/*	</span> */}
						{/* </Button> */}
					</div>
					{/* Voucher */}
					{selectedSalon.data.b2bVoucher && (
						<div className={'mb-14'}>
							<h2>{t('loc:Notino kupón')}</h2>
							<p>{t('loc:Skopírujte kód zľavového kupónu, uplatnite si ho na svoju objednávku v Notino aplikácii a užívajte si výhodné nakupovanie!')}</p>
							<Voucher code={selectedSalon.data.b2bVoucher} />
						</div>
					)}
					{/* Statistics */}
					<h2 className='mt-10'>{t('loc:Štatistiky')}</h2>
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 3xl:gap-8'>
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
								<h2 className='mt-10'>{t('loc:SMS kredit')}</h2>
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
