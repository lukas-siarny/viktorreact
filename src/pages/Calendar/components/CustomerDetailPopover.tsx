/* eslint-disable import/no-cycle */
import React, { FC, useEffect, useState } from 'react'
import { Divider, Popover, Row } from 'antd'
import { getFormValues } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-16.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as LoadingIcon } from '../../../assets/icons/loading-icon.svg'

// components
import UserAvatar from '../../../components/AvatarComponents'
import Ellipsis from '../../../atoms/Ellipsis'

// types
import { RootState } from '../../../reducers'
import { ICalendarReservationForm } from '../../../types/interfaces'

/// utils
import { ENUMERATIONS_KEYS, FORM } from '../../../utils/enums'
import { getAssignedUserLabel, getCountryPrefix } from '../../../utils/helper'

// reducers
import { getCustomer, ICustomerPayload } from '../../../reducers/customers/customerActions'

type ContentProps = {
	onClose: () => void
	customer: NonNullable<ICustomerPayload['data']>['customer']
}

const PopoverContent: FC<ContentProps> = (props) => {
	const { customer, onClose } = props

	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const prefix = getCountryPrefix(countriesData.data, customer.phonePrefixCountryCode)

	const hasAddress = customer.address?.street || customer.address?.city || customer.address?.countryCode

	return (
		<div className='nc-popover-content text-notino-black w-80'>
			<header className={'flex items-center justify-between px-4 h-13'}>
				<Row className={'state-wrapper gap-2 items-center'}>
					<UserAvatar size={24} className={'shrink-0'} src={customer.profileImage?.resizedImages?.thumbnail} />
					<span className={'text-sm leading-4 break-all'}>
						{getAssignedUserLabel({
							firstName: customer.firstName,
							lastName: customer.lastName,
							email: customer.email,
							id: customer.id
						})}
					</span>
				</Row>

				<button className={'nc-popover-header-button'} type={'button'} onClick={onClose}>
					<CloseIcon />
				</button>
			</header>
			<Divider className={'m-0'} />
			{/* 100vh - 100px - aby bol zabezpecny nejaky spacing od vrchu a spodku obrazovky */}
			<main className={'px-4 overflow-y-auto'} style={{ maxHeight: 'calc(100vh - 100px)' }}>
				{customer && (
					<>
						<section className={'flex py-4'}>
							<ul className={'noti-contact-list text-xs leading-4 flex flex-col gap-1 mb-0'}>
								{customer.phone && (
									<li className={'phone-list-item'}>
										<a href={`tel:${prefix}${customer.phone}`}>{`${prefix} ${customer.phone}`}</a>
									</li>
								)}
								{customer.email && (
									<li className={'email-list-item break-all'}>
										<a href={`mailto:${customer.email}`}>{customer.email}</a>
									</li>
								)}
								{hasAddress && (
									<li className={'address-list-item leading-4'}>
										<div className={'flex flex-col'}>
											{customer.address?.street && (
												<div>
													<span className={'break-all mr-1'}>{customer.address.street.trim()}</span>
													{customer.address?.streetNumber?.trim()}
												</div>
											)}
											<div>
												{customer.address?.zipCode && <span className={'mr-1'}>{customer.address?.zipCode?.trim()}</span>}
												<span className={'break-all'}>{customer.address?.city?.trim()}</span>
											</div>
											{customer.address?.countryCode}
										</div>
									</li>
								)}
								{customer.note && (
									<li className={'note-list-item'}>
										<Ellipsis
											text={customer.note}
											className={'p-3 m-0 bg-notino-grayLighter text-xs leading-4 rounded-md rounded-t-none whitespace-pre-wrap'}
										/>
									</li>
								)}
							</ul>
						</section>
					</>
				)}
			</main>
		</div>
	)
}

type ICustomerDetailPopoverProps = {}

const overlayClassName = 'nc-customer-detail-popover'

const CalendarDetailPopover: FC<ICustomerDetailPopoverProps> = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dispatch = useDispatch()

	const customer = useSelector((state: RootState) => state.customers.customer)
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))

	const openPopover = async () => {
		if (reservationFormValues?.customer?.value && reservationFormValues.customer.value !== customer?.data?.customer.id) {
			await dispatch(getCustomer(reservationFormValues.customer.value as string))
		}
		setIsOpen(true)
	}

	useEffect(() => {
		const contentOverlay = document.querySelector('#nc-content-overlay') as HTMLElement

		const listener = (e: Event) => {
			const overlayElement = document.querySelector(`.${overlayClassName}`)
			if (overlayElement && (e?.target as HTMLElement)?.classList?.contains(overlayClassName)) {
				setIsOpen(false)
			}
		}

		if (contentOverlay) {
			if (isOpen) {
				document.addEventListener('mousedown', listener)
				document.addEventListener('touchstart', listener)
				contentOverlay.style.display = 'block'
			} else {
				contentOverlay.style.display = 'none'
			}
		}

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [isOpen])

	if (!reservationFormValues?.customer?.value) {
		return null
	}

	return (
		<Popover
			open={isOpen}
			destroyTooltipOnHide={{ keepParent: true }}
			placement={'leftTop'}
			overlayClassName={`${overlayClassName} nc-popover-overlay nc-popover-overlay-fixed`}
			content={customer.data && <PopoverContent customer={customer.data.customer} onClose={() => setIsOpen(false)} />}
			align={{ offset: [-175, -18] }} // offset popoveru od "InfoIcon" trigger buttonu
		>
			<div className={'absolute right-7 z-50 w-6 h-6 bg-notino-white flex items-center justify-center'} style={{ top: 30 }}>
				{customer?.isLoading ? (
					<LoadingIcon className={'animate-spin w-4 h-4 text-notino-grayDark'} />
				) : (
					<button onClick={openPopover} type={'button'} className={'text-notino-pink w-4 h-4 p-0 m-0 bg-transparent outline-none border-0 cursor-pointer z-50'}>
						<InfoIcon className='w-4 h-4' />
					</button>
				)}
			</div>
		</Popover>
	)
}

export default CalendarDetailPopover
