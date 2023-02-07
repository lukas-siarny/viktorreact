/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, useRef } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { startsWith } from 'lodash'
import { useTranslation } from 'react-i18next'

// utils
import { RESERVATION_SOURCE_TYPE, RESERVATION_STATE, CALENDAR_VIEW, RESERVATION_ASSIGNMENT_TYPE, NEW_ID_PREFIX } from '../../../utils/enums'
import { getAssignedUserLabel } from '../../../utils/helper'

// assets
import { ReactComponent as QuestionMarkIcon } from '../../../assets/icons/question-mark-10.svg'
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-10.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/service-icon-10.svg'
import { ReactComponent as AvatarIcon } from '../../../assets/icons/avatar-10.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-12.svg'
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-12.svg'

// types
import { CalendarEvent, IEventCardProps, ReservationPopoverData, ReservationPopoverPosition } from '../../../types/interfaces'

interface IReservationCardProps extends IEventCardProps {
	salonID: string
	customer?: CalendarEvent['customer']
	service?: CalendarEvent['service']
	reservationData?: CalendarEvent['reservationData']
	note?: CalendarEvent['note']
	noteFromB2CCustomer?: CalendarEvent['noteFromB2CCustomer']
	onReservationClick: (data: ReservationPopoverData, position: ReservationPopoverPosition) => void
}

const getIconState = ({
	isPast,
	isRealized,
	isApproved,
	notRealized,
	service
}: {
	isPast?: boolean
	isRealized?: boolean
	notRealized?: boolean
	isApproved?: boolean
	service?: CalendarEvent['service']
}) => {
	if (isPast && isApproved) {
		return <QuestionMarkIcon className={'icon question-mark'} />
	}

	if (isRealized) {
		return <CheckIcon className={'icon check'} />
	}

	if (notRealized) {
		return <CloseIcon className={'icon not-realized'} />
	}

	return service?.icon?.resizedImages ? (
		<img src={service.icon.resizedImages.thumbnail} alt={service?.name} width={10} height={10} className={'object-contain shrink-0'} />
	) : (
		<ServiceIcon className={'icon service'} />
	)
}

const ReservationCard: FC<IReservationCardProps> = (props) => {
	const {
		start,
		end,
		backgroundColor,
		reservationData,
		customer,
		service,
		employee,
		isMultiDayEvent,
		isLastMultiDaylEventInCurrentRange,
		isFirstMultiDayEventInCurrentRange,
		calendarView,
		timeText,
		diff,
		originalEventData,
		note,
		noteFromB2CCustomer,
		isPlaceholder,
		isEdit,
		onReservationClick,
		timeLeftClassName
	} = props

	const [t] = useTranslation()

	const isPast = dayjs(originalEventData?.endDateTime || end).isBefore(dayjs())
	const isPending = reservationData?.state === RESERVATION_STATE.PENDING
	const isApproved = reservationData?.state === RESERVATION_STATE.APPROVED
	const isRealized = reservationData?.state === RESERVATION_STATE.REALIZED
	const notRealized = reservationData?.state === RESERVATION_STATE.NOT_REALIZED
	const isOnline = reservationData?.createSourceType === RESERVATION_SOURCE_TYPE.ONLINE
	const isEmployeeAutoassigned = reservationData?.employeeAssignmentType === RESERVATION_ASSIGNMENT_TYPE.SYSTEM

	const bgColor = !isPast ? backgroundColor : undefined

	const onlineIndicatior = isOnline ? (
		<div className={'state'} style={{ color: bgColor }}>
			{t('loc:Online')}
		</div>
	) : null

	const customerName = getAssignedUserLabel({
		id: customer?.id || '-',
		firstName: customer?.firstName,
		lastName: customer?.lastName,
		email: customer?.email
	})

	const iconState = getIconState({ isPast, isApproved, isRealized, notRealized, service })
	const iconPending = isPending && <ClockIcon className={'icon clock'} style={{ color: bgColor }} />
	const iconAutoAssigned = isEmployeeAutoassigned && <AvatarIcon className={'icon employee'} />

	const cardRef = useRef<HTMLDivElement | null>(null)

	const handleReservationClick = () => {
		// NOTE: prevent proti kliknutiu na virutalny event rezervacie neotvori sa popover
		if (startsWith(originalEventData.id, NEW_ID_PREFIX)) {
			return
		}
		if (originalEventData.id && cardRef.current) {
			// NOTE: vzdy ked sa bude pridavat nejaky novy atribut do dat pre popover, je potrebne tie data pridat aj pri inicializacii formularu v SiderEventManagement.tsx
			// pretoze z formularovych dat sa potom vytvara virtualny event, ktory pri editacii nahradza realny event - a tento virtualny event musi do popovera posielat rovnake data ako realny
			const data: ReservationPopoverData = {
				start,
				end,
				originalEventData,
				customer,
				employee,
				service,
				color: backgroundColor,
				reservationData,
				note,
				noteFromB2CCustomer,
				isEdit
			}

			const clientRect = cardRef.current.getBoundingClientRect()

			const position: ReservationPopoverPosition = {
				top: clientRect.top,
				left: clientRect.left,
				width: clientRect.width,
				height: clientRect.bottom - clientRect.top
			}
			onReservationClick(data, position)
		}
	}

	return (
		<div
			ref={cardRef}
			className={cx(
				'nc-event reservation',
				{
					'nc-day-event': calendarView === CALENDAR_VIEW.DAY,
					'nc-week-event': calendarView === CALENDAR_VIEW.WEEK,
					'multiday-event': isMultiDayEvent,
					'multiday-event-first': isFirstMultiDayEventInCurrentRange,
					'multiday-event-last': isLastMultiDaylEventInCurrentRange,
					'min-15': Math.abs(diff) <= 15,
					'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
					'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
					'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45,
					'is-past': isPast,
					'is-online': isOnline,
					'state-pending': isPending,
					'state-approved': isApproved,
					'state-realized': isRealized,
					'is-autoassigned': isEmployeeAutoassigned,
					placeholder: isPlaceholder,
					edit: isEdit || isPlaceholder
				},
				timeLeftClassName
			)}
			onClick={handleReservationClick}
			style={{
				outlineColor: (isPending || isEdit) && !isPast ? backgroundColor : undefined
			}}
		>
			<div
				className={'event-accent'}
				style={{
					backgroundColor: !isPending ? bgColor : undefined,
					backgroundImage:
						isPending && !isPast
							? `linear-gradient(135deg, ${backgroundColor} 12.50%, transparent 12.50%, transparent 50%, ${backgroundColor} 62.50%, ${backgroundColor} 62.50%, transparent 60%, transparent 100%)`
							: undefined
				}}
			/>
			<div className={'event-background'} style={{ backgroundColor: bgColor }} />
			<div id={originalEventData?.id} className={'event-content'}>
				{(() => {
					switch (calendarView) {
						case CALENDAR_VIEW.WEEK: {
							return (
								<>
									<div className={'title-wrapper'}>
										<div className={'title-inner-wrapper'}>
											{iconState}
											<span className={'title'}>{customerName}</span>
											{onlineIndicatior}
										</div>
										<div className={'icons'}>
											{iconPending}
											{iconAutoAssigned}
										</div>
									</div>
									{service?.name && <span className={'desc'}>{service.name}</span>}
								</>
							)
						}
						case CALENDAR_VIEW.DAY:
						default: {
							return (
								<>
									<div className={'title-wrapper'}>
										<div className={'title-inner-wrapper'}>
											{iconState}
											<span className={'title'}>{customerName}</span>
											{onlineIndicatior}
											<span className={'time'}>{timeText}</span>
										</div>
										<div className={'icons'}>
											{iconPending}
											{iconAutoAssigned}
										</div>
									</div>
									<span className={'time'}>{timeText}</span>
									{service?.name && <span className={'desc'}>{service.name}</span>}
								</>
							)
						}
					}
				})()}
			</div>
		</div>
	)
}

export default React.memo(ReservationCard, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
