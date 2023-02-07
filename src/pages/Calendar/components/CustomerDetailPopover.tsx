/* eslint-disable import/no-cycle */
import React, { FC, useEffect, useRef, useState } from 'react'
import { Col, Divider, Popover, Row } from 'antd'
import { getFormValues } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-16.svg'
import { ReactComponent as MessageIcon } from '../../../assets/icons/message-icon-16-thin.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as LoadingIcon } from '../../../assets/icons/loading-icon.svg'
import { ReactComponent as CustomerIcon } from '../../../assets/icons/customer-24-icon.svg'

// components
import UserAvatar from '../../../components/AvatarComponents'
import Ellipsis from '../../../atoms/Ellipsis'

// types
import { RootState } from '../../../reducers'
import { ICalendarReservationForm } from '../../../types/interfaces'

/// utils
import { ENUMERATIONS_KEYS, FORM } from '../../../utils/enums'
import { getAssignedUserLabel, getCountryPrefix } from '../../../utils/helper'
import { getCustomer, ICustomerPayload } from '../../../reducers/customers/customerActions'
import useOnClickOutside from '../../../hooks/useClickOutside'

type ContentProps = {
	onClose: () => void
	customer?: NonNullable<ICustomerPayload['data']>['customer']
}

const PopoverContent: FC<ContentProps> = (props) => {
	const [t] = useTranslation()
	const { customer, onClose } = props

	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const prefix = getCountryPrefix(countriesData.data, customer?.phonePrefixCountryCode)

	return (
		<div className='nc-popover-content text-notino-black w-80'>
			<main className={'px-4 overflow-y-auto'} style={{ maxHeight: 'calc(100vh - 100px)' }}>
				{customer && (
					<>
						<button className={'nc-popover-header-button absolute right-4 top-4 z-50'} type={'button'} onClick={onClose}>
							<CloseIcon />
						</button>
						<section className={'flex py-4'}>
							<Col flex={'32px'}>
								<UserAvatar size={24} className={'shrink-0'} src={customer?.profileImage?.resizedImages?.thumbnail} />
							</Col>
							<Col flex={'auto'} className={'flex flex-col gap-2'}>
								<Row align={'top'} justify={'space-between'} wrap={false} className={'gap-2 pr-6'}>
									<Row className={'flex-col gap-1'}>
										<span className={'text-sm leading-4 break-all'}>
											{getAssignedUserLabel({
												firstName: customer.firstName,
												lastName: customer.lastName,
												email: customer.email,
												id: customer.id
											})}
										</span>
										{prefix && customer.phone && <span className={'text-xxs text-notino-grayDark leading-3'}>{`${prefix} ${customer.phone}`}</span>}
									</Row>
									{customer.email && (
										<a href={`mailto:${customer.email}`} className={'leading-3'}>
											<MessageIcon />
										</a>
									)}
								</Row>
								{customer.note && (
									<Ellipsis text={customer.note} className={'p-3 m-0 bg-notino-grayLighter text-xs leading-4 rounded-md rounded-t-none whitespace-pre-wrap'} />
								)}
							</Col>
						</section>
						<Divider className={'m-0'} />
					</>
				)}
			</main>
		</div>
	)
}

type ICalendarReservationPopoverProps = {
	isSearchingCustomers?: boolean
}

const CalendarDetailPopover: FC<ICalendarReservationPopoverProps> = (props) => {
	const [isOpen, setIsOpen] = useState(false)
	const dispatch = useDispatch()

	const customer = useSelector((state: RootState) => state.customers.customer)
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))
	// const popoverRef = useRef<HTMLElement | null>(null)
	// const triggerRef = useRef<HTMLButtonElement | null>(null)

	const overlayClassName = 'nc-customer-detail-popover'

	const openPopover = async () => {
		if (reservationFormValues?.customer?.value && reservationFormValues.customer.value !== customer?.data?.customer.id) {
			await dispatch(getCustomer(reservationFormValues.customer.value as string))
			setIsOpen(true)
			return
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
	}, [isOpen, overlayClassName])

	/* useEffect(() => {
		if (isOpen) {
			const popoverNode = document.querySelector('.nc-customer-detail-popover')
			if (popoverNode) {
				popoverRef.current = popoverNode as HTMLElement
			}
		}
	}, [isOpen])

	useOnClickOutside([popoverRef, triggerRef], () => {
		setIsOpen(false)
	}) */

	if (!reservationFormValues?.customer?.value) {
		return null
	}

	return (
		<Popover
			visible={isOpen}
			destroyTooltipOnHide={{ keepParent: true }}
			placement={'leftTop'}
			overlayClassName={`${overlayClassName} nc-popover-overlay nc-popover-overlay-fixed`}
			content={<PopoverContent customer={customer.data?.customer} onClose={() => setIsOpen(false)} />}
			align={{ offset: [-160, -25] }}
		>
			<div className={'absolute right-7 z-50 w-6 h-6 bg-notino-white flex items-center justify-center'} style={{ top: 30 }}>
				{customer?.isLoading ? (
					<LoadingIcon className={'animate-spin w-4 h-4 text-notino-grayDark'} />
				) : (
					<button
						// ref={triggerRef}
						onClick={openPopover}
						type={'button'}
						className={'text-notino-pink w-4 h-4 p-0 m-0 bg-transparent outline-none border-0 cursor-pointer z-50'}
					>
						<InfoIcon className='w-4 h-4' />
					</button>
				)}
			</div>
		</Popover>
	)
}

export default CalendarDetailPopover
