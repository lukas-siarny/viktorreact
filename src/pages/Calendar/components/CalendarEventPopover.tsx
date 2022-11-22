/* eslint-disable import/no-cycle */
import React, { FC, useEffect, useCallback } from 'react'
import { Button, Col, Divider, Dropdown, Menu, Popconfirm, Popover, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import colors from 'tailwindcss/colors'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon-16.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-16.svg'
import { ReactComponent as DotsIcon } from '../../../assets/icons/dots-icon-16.svg'
import { ReactComponent as MessageIcon } from '../../../assets/icons/message-icon-16-thin.svg'
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg'
import { ReactComponent as NoteIcon } from '../../../assets/icons/note-icon.svg'
import { ReactComponent as CheckSuccessIcon } from '../../../assets/icons/check-icon-success-16.svg'
import { ReactComponent as CreditCardIcon } from '../../../assets/icons/credit-card.svg'
import { ReactComponent as WalletIcon } from '../../../assets/icons/wallet.svg'
import { ReactComponent as DollarIcon } from '../../../assets/icons/dollar.svg'
import { ReactComponent as AlertIcon } from '../../../assets/icons/alert-circle.svg'
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock.svg'

// components
import UserAvatar from '../../../components/AvatarComponents'
import Ellipsis from '../../../atoms/Ellipsis'

// types
import { CalendarEvent } from '../../../reducers/calendar/calendarActions'

/// utils
import { CALENDAR_EVENT_TYPE, ENUMERATIONS_KEYS, RESERVATION_STATE } from '../../../utils/enums'
import { getAssignedUserLabel, getCountryPrefix } from '../../../utils/helper'
import { getHoursMinutesFromMinutes, getTimeText } from '../calendarHelpers'

// redux
import { RootState } from '../../../reducers'

type Props = {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	start: Date | null
	end: Date | null
	event: CalendarEvent
	handleUpdateReservationState: (calendarEventID: string, state: RESERVATION_STATE, reason?: string) => void
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
	color?: string
}

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
		<div className='nc-event-popover-content text-notino-black w-80'>
			<header className={'flex items-center justify-between px-4 h-13'}>
				<Row className={'state-wrapper gap-2'}>
					{headerIcon}
					<span className={'text-sm leading-4'}>{headerState}</span>
				</Row>
				<Row className={'buttons gap-4'}>
					<button className={'nc-event-popover-header-button'} type={'button'} onClick={onEdit}>
						<EditIcon />
					</button>
					{(moreMenuItems || []).length > 0 && (
						<Dropdown
							overlay={<Menu className={'shadow-md max-w-xs min-w-48 w-48 mt-1 p-2 flex flex-col gap-2'} style={{ width: 200 }} items={moreMenuItems} />}
							placement='bottomRight'
							trigger={['click']}
						>
							<button className={'nc-event-popover-header-button'} type={'button'} onClick={(e) => e.preventDefault()}>
								<DotsIcon />
							</button>
						</Dropdown>
					)}
					<button className={'nc-event-popover-header-button'} type={'button'} onClick={onClose}>
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
								{/* TODO: BE musi posielat image */}
								<UserAvatar size={24} className={'shrink-0'} src={customer.profileImage.resizedImages.thumbnail} />
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
								<span className={'text-notino-grayDark text-xxs leading-3'}>{`${getTimeText(start, end)} (${getHoursMinutesFromMinutes(
									dayjs(end).diff(start, 'minutes')
								)})`}</span>
								{service?.name && <span className={'block text-sm text-notino-black leading-4 break-all'}>{service.name}</span>}
							</div>
							<UserAvatar
								size={24}
								className={'shrink-0 mt-1'}
								src={employee?.image.resizedImages.thumbnail}
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
								<div className={'note flex break-all text-sm leading-4 break-all'}>
									<Col flex={'32px'} className={'flex justify-center'}>
										<NoteIcon className={'shrink-0 text-notino-grayDark'} />
									</Col>
									<Col flex={'auto'}>
										<Row className={'gap-1'} align={'top'}>
											<Ellipsis text={note.text} className={'m-0 p-0 whitespace-pre-wrap flex-1'} />
											{note.internal && <Tag className={'nc-event-popover-tag'}>{t('loc:Interna')}</Tag>}
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

const CalendarEventPopover: FC<Props> = (props) => {
	const { isOpen, setIsOpen, children, event, start, end, color, handleUpdateReservationState, onEditEvent } = props
	const { id, reservationData, service, customer, employee, note, noteFromB2CCustomer } = event || {}

	const [t] = useTranslation()

	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	console.log(selectedSalon)

	const overlayClassName = `nc-event-popover-overlay_${id || ''}`
	const itemClassName = 'p-2 font-medium min-w-0'

	useEffect(() => {
		const listener = (e: Event) => {
			const overlayElement = document.querySelector(`.${overlayClassName}`)

			if (overlayElement && (e?.target as HTMLElement)?.classList?.contains(overlayClassName)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', listener)
			document.addEventListener('touchstart', listener)
		}

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [isOpen, overlayClassName, setIsOpen])

	const handleUpdateState = useCallback(
		(state: RESERVATION_STATE, closeAfterUpdate = true) => {
			handleUpdateReservationState(id, state)
			if (closeAfterUpdate) {
				setIsOpen(false)
			}
		},
		[id, handleUpdateReservationState, setIsOpen]
	)

	const getFooterCheckoutButton = () => {
		// TODO: zatial hardcoded kym to BE neupravi
		/*
		const items = []

		if (selectedSalon?.data?.payByCard) {
			items.push({
				key: 'realized-card',
				label: t('loc:Kartou'),
				icon: <CreditCardIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			})
		}

		if (selectedSalon?.data?.payByCash) {
			items.push({
				key: 'realized-cash',
				label: t('loc:Hotovosťou'),
				icon: <WalletIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			})
		}

		if (selectedSalon?.data?.otherPaymentMethods) {
			items.push({
				key: 'realized-cash',
				label: selectedSalon?.data?.otherPaymentMethods,
				icon: <WalletIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			})
		} */

		const items = [
			{
				key: 'realized-card',
				label: t('loc:Kartou'),
				icon: <CreditCardIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			},
			{
				key: 'realized-cash',
				label: t('loc:Hotovosťou'),
				icon: <WalletIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			},
			{
				key: 'realized-other',
				label: t('loc:Iným spôsobom'),
				icon: <DollarIcon />,
				className: itemClassName,
				onClick: () => handleUpdateState(RESERVATION_STATE.REALIZED)
			}
		]

		return (
			<Dropdown
				key={'footer-checkout-dropdown'}
				overlay={<Menu className={'shadow-md max-w-xs min-w-48 w-48 mt-1 p-2 flex flex-col gap-2'} style={{ width: 200 }} items={items} />}
				placement='bottomRight'
				trigger={['click']}
			>
				<Button
					type={'primary'}
					icon={<ChevronDown className={'filter-invert max'} />}
					size={'middle'}
					className={'noti-btn w-1/2'}
					htmlType={'button'}
					onClick={(e) => e.preventDefault()}
				>
					{t('loc:Zaplatená')}
				</Button>
			</Dropdown>
		)
	}

	const getFooterCancelButton = (label: string, state: RESERVATION_STATE, popconfirmText?: string) => {
		const button = (
			<Button
				key={'cancel-button'}
				type={'dashed'}
				size={'middle'}
				className={'noti-btn w-1/2'}
				htmlType={'button'}
				onClick={!popconfirmText ? () => handleUpdateState(state) : undefined}
			>
				{label}
			</Button>
		)

		return popconfirmText ? (
			<Popconfirm
				placement={'bottom'}
				title={popconfirmText}
				okButtonProps={{
					type: 'default',
					className: 'noti-btn'
				}}
				cancelButtonProps={{
					type: 'primary',
					className: 'noti-btn'
				}}
				okText={t('loc:Zmazať')}
				onConfirm={() => handleUpdateState(state)}
				cancelText={t('loc:Zrušiť')}
			>
				<Button key={'cancel-button'} type={'dashed'} size={'middle'} className={'noti-btn w-1/2'} htmlType={'button'}>
					{label}
				</Button>
			</Popconfirm>
		) : (
			button
		)
	}

	const headerMoreItems = {
		cancel_by_salon: {
			key: 'cancel-by-salon',
			label: t('loc:Zrušiť rezerváciu'),
			icon: <AlertIcon />,
			className: itemClassName,
			onClick: () => handleUpdateState(RESERVATION_STATE.CANCEL_BY_SALON)
		}
	}

	const getPopoverContentSpecificProps = () => {
		switch (reservationData?.state) {
			case RESERVATION_STATE.APPROVED: {
				return {
					headerIcon: <CheckSuccessIcon />,
					headerState: t('loc:Potvrdená'),
					moreMenuItems: [headerMoreItems.cancel_by_salon],
					footerButtons: [getFooterCancelButton(t('loc:Nezrealizovaná'), RESERVATION_STATE.NOT_REALIZED), getFooterCheckoutButton()]
				}
			}
			case RESERVATION_STATE.PENDING:
				return {
					headerIcon: <ClockIcon color={'#FF9500'} />,
					headerState: t('loc:Čakajúca'),
					moreMenuItems: [headerMoreItems.cancel_by_salon],
					footerButtons: [
						getFooterCancelButton(t('loc:Zamietnuť'), RESERVATION_STATE.DECLINED, t('loc: Naozaj chcete zrušiť zamietnuť? Klient dostane notifikáciu.')),
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
			case RESERVATION_STATE.REALIZED:
				return {
					headerIcon: <CreditCardIcon className={'text-notino-success'} />,
					headerState: t('loc:Zaplatená')
				}
			case RESERVATION_STATE.NOT_REALIZED:
			default:
				return {
					headerIcon: <AlertIcon />,
					headerState: t('loc:Nezrealizovaná')
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
			destroyTooltipOnHide={{ keepParent: false }}
			trigger={'click'}
			placement={'left'}
			overlayClassName={`${overlayClassName} nc-event-popover-overlay`}
			content={
				<PopoverContent
					start={start}
					end={end}
					service={service}
					color={color}
					customer={customer}
					employee={employee}
					onEdit={() => {
						onEditEvent(id, event.eventType as CALENDAR_EVENT_TYPE)
						setIsOpen(false)
					}}
					onClose={() => setIsOpen(false)}
					notes={getNotes()}
					{...getPopoverContentSpecificProps()}
				/>
			}
		>
			{children}
		</Popover>
	)
}

export default CalendarEventPopover
