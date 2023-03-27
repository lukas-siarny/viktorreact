import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import decode from 'jwt-decode'
import qs from 'qs'
import { get } from 'lodash'
import { Alert, Button, Divider, Result, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router-dom'

// interfaces
import { Paths } from '../../types/api'
import { RootState } from '../../reducers'

// utils
import { getReq, patchReq } from '../../utils/request'
import { D_M_YEAR_FORMAT, ENUMERATIONS_KEYS, RESERVATION_STATE } from '../../utils/enums'
import { decodePrice, getAssignedUserLabel, getCountryPrefix, getServiceRange } from '../../utils/helper'

// assets
import { ReactComponent as ReservationsIcon } from '../../assets/icons/reservations.svg'
import { ReactComponent as DollarIcon } from '../../assets/icons/dollar.svg'
import { ReactComponent as EmployeeIcon } from '../../assets/icons/employees-16-current-color.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil-icon-16.svg'

// componenets
import ConfirmModal from '../../atoms/ConfirmModal'

type ReservationData = Paths.GetApiB2CV1CalendarEventsReservationsCalendarEventId.Responses.$200['reservation']

const CancelReservationPage = () => {
	const { t: token } = qs.parse(document.location.search, { ignoreQueryPrefix: true })

	const payload = decode(token as string)
	const calendarEventID = get(payload, 'calendarEventID')

	const [t] = useTranslation()
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState(false)
	const [view, setView] = useState<'default' | 'error'>()
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
	const [calendarReservationData, setCalendarReservationData] = useState<ReservationData | null>(null)

	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const REQUESTS_CONFIG = useMemo(
		() => ({
			headers: {
				Authorization: `Bearer ${token}`
			}
		}),
		[token]
	)

	useEffect(() => {
		;(async () => {
			setIsLoading(true)
			try {
				const { data } = await getReq('/api/b2c/web/calendar-events/reservations/{calendarEventID}', { calendarEventID }, REQUESTS_CONFIG)
				setCalendarReservationData(data.reservation)
				setView('default')
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				setView('error')
			} finally {
				setIsLoading(false)
			}
		})()
	}, [calendarEventID, REQUESTS_CONFIG])

	const handleCancelReservation = async () => {
		if (!calendarReservationData) {
			return
		}
		setIsConfirmModalOpen(false)
		setIsLoading(true)
		try {
			await patchReq('/api/b2c/web/calendar-events/reservations/{calendarEventID}/cancel', { calendarEventID }, {}, REQUESTS_CONFIG)
			navigate(t('paths:index'))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	const renderContent = () => {
		if (view === 'default') {
			let salonPhoneNumber = ''

			if (calendarReservationData?.salon?.phones?.length) {
				const phoneNumber = calendarReservationData.salon.phones[0]
				const prefix = getCountryPrefix(countriesData.data, phoneNumber.phonePrefixCountryCode)
				salonPhoneNumber = `${prefix} ${phoneNumber.phone}`
			}

			let eventDate = ''
			let eventTime = ''

			if (calendarReservationData) {
				eventDate = dayjs(calendarReservationData.start.date).format(D_M_YEAR_FORMAT)
				eventTime = `${calendarReservationData.start.time} - ${calendarReservationData.end.time}`
			}

			const employeeName = getAssignedUserLabel({ firstName: calendarReservationData?.employee.firstName, lastName: calendarReservationData?.employee.lastName, id: '' })

			const getFooter = () => {
				/* Only Pending or approved reservation can be cancelled */
				if (
					calendarReservationData?.reservationData?.state === RESERVATION_STATE.PENDING ||
					calendarReservationData?.reservationData?.state === RESERVATION_STATE.APPROVED
				) {
					return (
						<>
							<Button type={'primary'} size={'large'} className={'noti-btn w-full'} onClick={() => setIsConfirmModalOpen(true)}>
								{t('loc:Zrušiť rezerváciu')}
							</Button>
							<ConfirmModal
								loading={isLoading}
								disabled={isLoading}
								closeIcon={<CloseIcon />}
								destroyOnClose
								open={isConfirmModalOpen}
								onOk={handleCancelReservation}
								onCancel={() => setIsConfirmModalOpen(false)}
								title={t('loc:Zrušenie rezervácie')}
								okText={t('loc:Áno')}
								cancelText={t('loc:Nie')}
							>
								{`${t('loc:Naozaj si prajete zrušiť rezerváciu služby {{ serviceName }} v salóne {{ salonName }} naplánovanú na {{ date }} {{ time }}?', {
									salonName: calendarReservationData?.salon.name || '',
									serviceName: calendarReservationData?.service?.name,
									date: eventDate,
									time: eventTime
								})}`}
							</ConfirmModal>
						</>
					)
				}
				return <Alert message={t('loc:Rezervácia už bola zrušená alebo ju už nie je možné zrušiť')} showIcon type={'warning'} className={'noti-alert'} />
			}

			return (
				<>
					<section className={'w-full p-4 bg-notino-white rounded'}>
						<h4 className={'flex items-center text-base truncate inline-block'}>
							<span className='mr-2'>{eventDate}</span> {eventTime}
						</h4>
						<Divider className={'mt-1 mb-4'} />
						<div className={'flex flex-col gap-2 mt-2'}>
							{calendarReservationData?.service?.name && (
								<div className={'flex items-start gap-2'}>
									{<img src={calendarReservationData?.service?.icon?.resizedImages.thumbnail} alt={''} width={16} height={16} className={'object-contain'} /> || (
										<ReservationsIcon width={16} height={16} />
									)}
									{calendarReservationData?.service.name}
								</div>
							)}
							<div className={'flex items-start gap-2'}>
								<DollarIcon width={16} height={16} />
								{getServiceRange(
									decodePrice(calendarReservationData?.reservationData?.priceFrom),
									decodePrice(calendarReservationData?.reservationData?.priceTo),
									calendarReservationData?.reservationData?.priceFrom?.currencySymbol
								) || '-'}
							</div>
							{employeeName && (
								<div className={'flex items-start gap-2'}>
									<EmployeeIcon width={16} height={16} />
									{t('loc:Obslúži vás {{ employeeName }}', { employeeName })}
								</div>
							)}
							{calendarReservationData?.createdAt && (
								<div className={'flex items-start gap-2'}>
									<PencilIcon width={16} height={16} />
									<span className={'inline-flex gap-2 flex-wrap'}>
										{`${t('loc:Vytvorená')} ${dayjs(calendarReservationData.createdAt).format(`${D_M_YEAR_FORMAT} HH:mm`)}`}
									</span>
								</div>
							)}
						</div>
					</section>

					<section>
						<h4 className={'flex items-center text-base truncate inline-block gap-2'}>
							{calendarReservationData?.salon?.name || t('loc:Kontaktné informácie salónu')}
						</h4>
						<Divider className={'mt-1 mb-2'} />
						<div className={'flex items-start gap-2'}>
							<div className={'flex-1'}>
								<ul className={'noti-contact-list mb-0'}>
									{salonPhoneNumber && (
										<li className={'phone-list-item'}>
											<a href={`tel:${salonPhoneNumber}`}>{salonPhoneNumber}</a>
										</li>
									)}
									<li className={'address-list-item'}>
										<div className={'flex flex-col'}>
											{calendarReservationData?.salon?.address?.street && (
												<div>
													<span className={'break-all mr-1'}>{calendarReservationData.salon.address.street.trim()}</span>
													{calendarReservationData?.salon?.address?.streetNumber?.trim()}
												</div>
											)}
											<div>
												{calendarReservationData?.salon?.address?.zipCode && (
													<span className={'mr-1'}>{calendarReservationData.salon.address.zipCode.trim()}</span>
												)}
												<span className={'break-all'}>{calendarReservationData?.salon?.address?.city?.trim()}</span>
											</div>
											{calendarReservationData?.salon?.address?.countryCode}
										</div>
									</li>
								</ul>
							</div>
							{calendarReservationData?.salon.logo?.resizedImages.small && (
								<img
									src={calendarReservationData?.salon.logo?.resizedImages.small}
									alt={''}
									width={80}
									height={80}
									className={'object-contain shrink-0 rounded-lg border border-solid border-notino-grayLight'}
								/>
							)}
						</div>
					</section>

					{getFooter()}
				</>
			)
		}

		if (view === 'error') {
			return (
				<Result
					status='500'
					className='py-0'
					subTitle={
						<>
							<span className={'text-gray-600 text-base'}>{t('loc:Nepodarilo sa zobraziť rezerváciu')}</span>{' '}
							<Link to={`${t('paths:contact')}`} className='inline-block'>
								<Button className='p-0 font-medium' type={'link'} htmlType={'button'}>
									{t('loc:Potrebujete pomôcť?')}
								</Button>
							</Link>
						</>
					}
				/>
			)
		}

		return null
	}

	return (
		<>
			<div className={'w-full noti-cancel-reservation-wrapper'}>
				<Spin spinning={isLoading}>
					<div className={'grid gap-8'}>
						<h3 className={'text-center'}>{t('loc:Zrušenie rezervácie')}</h3>
						{renderContent()}
					</div>
				</Spin>
			</div>
		</>
	)
}

export default CancelReservationPage
