/* eslint-disable import/no-cycle */
import React, { FC, useEffect, useCallback, useRef } from 'react'
import { Button, Col, Divider, Dropdown, Menu, Popover, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import colors from 'tailwindcss/colors'
import { ButtonProps } from 'antd/es/button'
import i18next from 'i18next'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon-16.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-16.svg'
import { ReactComponent as DotsIcon } from '../../../assets/icons/more-info-horizontal-icon.svg'
import { ReactComponent as MessageIcon } from '../../../assets/icons/message-icon-16-thin.svg'
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg'
import { ReactComponent as NoteIcon } from '../../../assets/icons/note-icon.svg'
import { ReactComponent as DollarIcon } from '../../../assets/icons/dollar.svg'
import { ReactComponent as CrossedIcon } from '../../../assets/icons/crossed-red-16.svg'

// components
import UserAvatar from '../../../components/AvatarComponents'
import Ellipsis from '../../../atoms/Ellipsis'

// types
import { RootState } from '../../../reducers'
import { CalendarEvent, ICalendarReservationPopover } from '../../../types/interfaces'

/// utils
import { CALENDAR_EVENTS_KEYS, CALENDAR_EVENT_TYPE, ENUMERATIONS_KEYS, RESERVATION_PAYMENT_METHOD, RESERVATION_STATE, STRINGS } from '../../../utils/enums'
import { getAssignedUserLabel, getCountryPrefix, translateReservationPaymentMethod, translateReservationState } from '../../../utils/helper'
import { parseTimeFromMinutes, getTimeText } from '../calendarHelpers'

// hooks
import useKeyUp from '../../../hooks/useKeyUp'

type PopoverNote = {
	key: string
	text: string
	internal?: boolean
}

type ContentProps = {
	headerIcon: React.ReactNode
	headerState: string
	start: Date | null
	end: Date | null
	onClose: () => void
	onEdit: () => void
	moreMenuItems?: ItemType[]
	footerButtons?: React.ReactNode[]
	service?: CalendarEvent['service']
	customer?: CalendarEvent['customer']
	employee?: CalendarEvent['employee']
	color?: string
	notes?: PopoverNote[]
}

const PopoverContent: FC<ContentProps> = (props) => {
	const [t] = useTranslation()
	const { headerIcon, headerState, moreMenuItems, footerButtons, start, end, service, customer, employee, notes, color, onEdit, onClose } = props

	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const prefix = getCountryPrefix(countriesData.data, customer?.phonePrefixCountryCode)

	const dayName = dayjs(start).format('ddd')
	const dayNumber = dayjs(start).format('D')
	const isToday = dayjs(start).isToday()

	const hasFooter = !!footerButtons?.length

	return (
		<div className='nc-popover-content text-notino-black w-80'>
			<header className={'flex items-center justify-between px-4 h-13'}>
				<Row className={'state-wrapper gap-2'}>
					{headerIcon}
					<span className={'text-sm leading-4'}>{headerState}</span>
				</Row>
				<Row className={'buttons gap-4'}>
					<button className={'nc-popover-header-button'} type={'button'} onClick={onEdit}>
						<EditIcon />
					</button>
					{(moreMenuItems || []).length > 0 && (
						<Dropdown
							overlay={<Menu className={'shadow-md max-w-xs min-w-48 w-48 mt-1 p-2 flex flex-col gap-2'} items={moreMenuItems} />}
							placement='bottomRight'
							trigger={['click']}
						>
							<button className={'nc-popover-header-button'} type={'button'} onClick={(e) => e.preventDefault()}>
								<DotsIcon style={{ transform: 'rotate(90deg)' }} />
							</button>
						</Dropdown>
					)}
					<button className={'nc-popover-header-button'} type={'button'} onClick={onClose}>
						<CloseIcon />
					</button>
				</Row>
			</header>
			<Divider className={'m-0'} />
			{/* footerHeight = 72px, headerHeight = 52px. dividerHeight = 1px (header and footer dividers), padding top and bottom = 2*16px */}
			<main className={'px-4 overflow-y-auto'} style={{ maxHeight: `calc(100vh - 32px - ${hasFooter ? `${134}px` : `${53}px`})` }}>
				{customer && (
					<>
						<section className={'flex py-4'}>
							<Col flex={'32px'}>
								<UserAvatar size={24} className={'shrink-0'} src={customer?.profileImage?.resizedImages?.thumbnail} />
							</Col>
							<Col flex={'auto'} className={'flex flex-col gap-2'}>
								<Row align={'top'} justify={'space-between'} wrap={false} className={'gap-2'}>
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
									<Row align={'middle'} className={'gap-2 h-8'} wrap={false}>
										{/* <Tag className={'nc-event-popover-tag tag-new'}>{t('loc:Nový klient')}</Tag> */}
										{customer.email && (
											<a href={`mailto:${customer.email}`} className={'leading-3'}>
												<MessageIcon />
											</a>
										)}
									</Row>
								</Row>
								{customer.note && (
									<Ellipsis text={customer.note} className={'p-3 m-0 bg-notino-grayLighter text-xs leading-4 rounded-md rounded-t-none whitespace-pre-wrap'} />
								)}
							</Col>
						</section>
						<Divider className={'m-0'} />
					</>
				)}
				<section className={'py-4 flex'}>
					<Col flex={'32px'}>
						<div className={`text-center flex flex-col ${isToday ? 'text-notino-pink' : ''}`}>
							<span className={'block text-sm leading-4'}>{dayNumber}</span>
							<span className={'text-xxs leading-3'}>{dayName}</span>
						</div>
					</Col>
					<Col flex={'auto'}>
						<Row className={'gap-2'} justify={'space-between'} align={'top'} wrap={false}>
							<div className={'flex flex-col pl-3 gap-1'} style={{ borderLeft: `2px solid ${color || '#000000'}` }}>
								<span className={'text-notino-grayDark text-xxs leading-3'}>{`${getTimeText(start, end)} (${parseTimeFromMinutes(
									dayjs(end).diff(start, 'minutes')
								)})`}</span>
								{service?.name && <span className={'block text-sm text-notino-black leading-4 break-all'}>{service.name}</span>}
							</div>
							<UserAvatar
								size={24}
								className={'shrink-0 mt-1'}
								src={employee?.image?.resizedImages?.thumbnail}
								style={{ border: `2px solid ${color || colors.neutral[200]}` }}
							/>
						</Row>
					</Col>
				</section>
				{notes?.map((note) => {
					return (
						<React.Fragment key={note.key}>
							<Divider className={'m-0'} />
							<section className={'py-4'}>
								<div className={'note flex break-all text-sm leading-4'}>
									<Col flex={'32px'} className={'flex justify-center'}>
										<NoteIcon className={'shrink-0 text-notino-grayDark'} />
									</Col>
									<Col flex={'auto'}>
										<Row className={'gap-1'} align={'top'}>
											<Ellipsis text={note.text} className={'m-0 p-0 whitespace-pre-wrap flex-1'} />
											{note.internal && <Tag className={'nc-event-popover-tag'}>{t('loc:Interná')}</Tag>}
										</Row>
									</Col>
								</div>
							</section>
						</React.Fragment>
					)
				})}
			</main>
			{hasFooter && (
				<>
					<Divider className={'m-0'} />
					<footer className={'flex gap-4 p-4'}>{footerButtons}</footer>
				</>
			)}
		</div>
	)
}

const CalendarReservationPopover: FC<ICalendarReservationPopover> = (props) => {
	const { data, position, setIsOpen, handleUpdateReservationState, onEditEvent, placement, isOpen } = props

	const { start, end, color, reservationData, service, customer, employee, note, noteFromB2CCustomer, originalEventData } = data || {}

	const { id } = originalEventData || {}

	const [t] = useTranslation()

	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const overlayClassName = `nc-popover-overlay_${id || ''}`
	const itemClassName = 'p-2 font-medium min-w-0 h-9 w-full relative'

	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS]).data
	const prevReservations = useRef(reservations)

	const handleClosePopover = useCallback(() => setIsOpen(false), [setIsOpen])

	useEffect(() => {
		// TODO: toto by este potom chcelo trochu prerobit, teraz to je cez dva overlay spravene
		// jeden zaistuje ze sa po kliku na neho zavrie popoover (cez &::before na popover elemente)
		// druhy je pomocny kvoli tomu, ze kvoli uvodnej animacii chvilku trva, kym prvy overlay nabehne a vtedy sa da scrollovat, aj ked by sa nemalo
		const contentOverlay = document.querySelector('#nc-content-overlay') as HTMLElement

		const listener = (e: Event) => {
			const overlayElement = document.querySelector(`.${overlayClassName}`)
			if (overlayElement && (e?.target as HTMLElement)?.classList?.contains(overlayClassName)) {
				handleClosePopover()
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
	}, [isOpen, overlayClassName, handleClosePopover])

	useEffect(() => {
		if (isOpen) {
			const prevEventData = prevReservations?.current?.find((prevEvent) => prevEvent.originalEvent?.id || prevEvent.id === originalEventData?.id)
			const currentEventData = reservations?.find((currentEvent) => currentEvent.originalEvent?.id || currentEvent.id === originalEventData?.id)
			if (JSON.stringify(prevEventData) !== JSON.stringify(currentEventData)) {
				handleClosePopover()
			}
		}
		prevReservations.current = reservations
	}, [reservations, isOpen, originalEventData?.id, handleClosePopover])

	useKeyUp('Escape', isOpen ? handleClosePopover : undefined)

	const handleUpdateState = useCallback(
		(state: RESERVATION_STATE, paymentMethod?: RESERVATION_PAYMENT_METHOD) => {
			if (id && handleUpdateReservationState) {
				handleUpdateReservationState(id, state, undefined, paymentMethod)
			}
		},
		[id, handleUpdateReservationState]
	)

	const getFooterCheckoutButton = () => {
		const items = []

		if (selectedSalon?.data?.payByCard) {
			const { icon } = translateReservationPaymentMethod(RESERVATION_PAYMENT_METHOD.CARD)
			items.push({
				key: 'realized-card',
				label: t('loc:Kartou'),
				icon,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED, RESERVATION_PAYMENT_METHOD.CARD)
			})
		}

		if (selectedSalon?.data?.payByCash) {
			const { icon } = translateReservationPaymentMethod(RESERVATION_PAYMENT_METHOD.CASH)
			items.push({
				key: 'realized-cash',
				label: t('loc:Hotovosťou'),
				icon,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED, RESERVATION_PAYMENT_METHOD.CASH)
			})
		}

		if (selectedSalon?.data?.otherPaymentMethods) {
			const { icon } = translateReservationPaymentMethod(RESERVATION_PAYMENT_METHOD.OTHER)
			items.push({
				key: 'realized-other',
				label: t('loc:Iným spôsobom'),
				icon,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED, RESERVATION_PAYMENT_METHOD.OTHER)
			})
		}

		const button = (buttonBrops?: ButtonProps & { key: string }) => (
			<Button type={'primary'} size={'middle'} className={'noti-btn w-1/2'} htmlType={'button'} onClick={(e) => e.preventDefault()} {...buttonBrops}>
				{t('loc:Zaplatená')}
			</Button>
		)

		return items?.length ? (
			<Dropdown
				key={'footer-checkout-dropdown'}
				overlay={<Menu className={'shadow-md max-w-xs min-w-48 w-48 mt-1 p-2 flex flex-col gap-2'} items={items} />}
				placement='bottomRight'
				trigger={['click']}
			>
				{button({ key: 'checkout-button-dropdown', icon: <ChevronDown className={'filter-invert max'} /> })}
			</Dropdown>
		) : (
			button({ key: 'checkout-button-realized', onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED) })
		)
	}

	const getFooterCancelButton = (key: string, label: string, state: RESERVATION_STATE) => (
		<Button key={key} type={'dashed'} size={'middle'} className={'noti-btn w-1/2'} htmlType={'button'} onClick={() => handleUpdateState(state)}>
			{label}
		</Button>
	)

	const headerMoreItems = {
		cancel_by_salon: {
			key: 'cancel-by-salon',
			label: <span className={'text-notino-red'}>{STRINGS(t).cancel(t('loc:rezerváciu'))}</span>,
			icon: <CrossedIcon />,
			className: itemClassName,
			onClick: () => handleUpdateState(RESERVATION_STATE.CANCEL_BY_SALON)
		}
	}

	const getPopoverContentSpecificProps = () => {
		switch (reservationData?.state) {
			case RESERVATION_STATE.APPROVED: {
				const { icon: headerIcon, text: headerState } = translateReservationState(RESERVATION_STATE.APPROVED)
				return {
					headerIcon,
					headerState,
					moreMenuItems: [headerMoreItems.cancel_by_salon],
					footerButtons: [getFooterCancelButton('cancel-button-not-realized', t('loc:Nezrealizovaná'), RESERVATION_STATE.NOT_REALIZED), getFooterCheckoutButton()]
				}
			}
			case RESERVATION_STATE.PENDING: {
				const { icon: headerIcon, text: headerState } = translateReservationState(RESERVATION_STATE.PENDING)
				return {
					headerIcon,
					headerState,
					moreMenuItems: [headerMoreItems.cancel_by_salon],
					footerButtons: [
						getFooterCancelButton('cancel-button-declined', t('loc:Zamietnuť'), RESERVATION_STATE.DECLINED),
						<Button
							key={'confirm-button'}
							type={'dashed'}
							size={'middle'}
							className={'noti-btn w-1/2'}
							htmlType={'button'}
							onClick={() => handleUpdateState(RESERVATION_STATE.APPROVED)}
						>
							{t('loc:Potvrdiť')}
						</Button>
					]
				}
			}
			case RESERVATION_STATE.REALIZED: {
				if (!reservationData?.paymentMethod) {
					return {
						headerIcon: <DollarIcon className={'text-notino-success'} />,
						headerState: i18next.t('loc:Zaplatená')
					}
				}
				const { icon: headerIcon, text: headerState } = translateReservationPaymentMethod(
					reservationData?.paymentMethod as RESERVATION_PAYMENT_METHOD,
					'text-notino-success'
				)
				return { headerIcon, headerState }
			}
			case RESERVATION_STATE.NOT_REALIZED:
			default: {
				const { icon: headerIcon, text: headerState } = translateReservationState(RESERVATION_STATE.NOT_REALIZED)
				return {
					headerIcon,
					headerState
				}
			}
		}
	}

	const getNotes = () => {
		const notes = []
		if (noteFromB2CCustomer) {
			notes.push({ key: 'customer-note', text: noteFromB2CCustomer, internal: false })
		}
		if (note) {
			notes.push({
				key: 'internal-note',
				text: note,
				internal: true
			})
		}
		return notes
	}

	return (
		<Popover
			visible={isOpen}
			destroyTooltipOnHide={{ keepParent: true }}
			trigger={'click'}
			placement={placement}
			overlayClassName={`${overlayClassName} nc-popover-overlay nc-popover-overlay-fixed`}
			content={
				<PopoverContent
					start={start || null}
					end={end || null}
					service={service}
					color={color}
					customer={customer}
					employee={employee}
					onEdit={() => {
						if (id) {
							onEditEvent(CALENDAR_EVENT_TYPE.RESERVATION, id)
						}
						handleClosePopover()
					}}
					onClose={handleClosePopover}
					notes={getNotes()}
					{...getPopoverContentSpecificProps()}
				/>
			}
		>
			<div style={{ top: position?.top, left: position?.left, width: position?.width, height: position?.height, position: 'fixed' }} />
		</Popover>
	)
}

export default CalendarReservationPopover
