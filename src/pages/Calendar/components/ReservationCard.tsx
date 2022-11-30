/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, FC, useCallback, useEffect } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { StringParam, useQueryParams } from 'use-query-params'

// utils
import { RESERVATION_SOURCE_TYPE, RESERVATION_STATE, CALENDAR_VIEW, RESERVATION_ASSIGNMENT_TYPE, NOTIFICATION_TYPE, RESERVATION_PAYMENT_METHOD } from '../../../utils/enums'
import { getAssignedUserLabel } from '../../../utils/helper'

// assets
import { ReactComponent as QuestionMarkIcon } from '../../../assets/icons/question-mark-10.svg'
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-10.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/service-icon-10.svg'
import { ReactComponent as AvatarIcon } from '../../../assets/icons/avatar-10.svg'

// components
import CalendarReservationPopover from './CalendarReservationPopover'

// types
import { CalendarEvent, IEventCardProps } from '../../../types/interfaces'
import { patchReq } from '../../../utils/request'

interface IReservationCardProps extends IEventCardProps {
	salonID: string
	customer?: CalendarEvent['customer']
	service?: CalendarEvent['service']
	reservationData?: CalendarEvent['reservationData']
	note?: CalendarEvent['note']
	noteFromB2CCustomer?: CalendarEvent['noteFromB2CCustomer']
	refetchData: () => void
}

const getIcon = ({ isPast, isRealized, isApproved, service }: { isPast?: boolean; isRealized?: boolean; isApproved?: boolean; service?: CalendarEvent['service'] }) => {
	if (isPast) {
		if (isRealized) {
			return <CheckIcon className={'icon check'} />
		}

		if (isApproved) {
			return <QuestionMarkIcon className={'icon question-mark'} />
		}
	}

	if (isRealized) {
		return <CheckIcon className={'icon check'} />
	}

	return service?.icon?.resizedImages ? (
		<img src={service.icon.resizedImages.thumbnail} alt={service?.name} width={10} height={10} className={'object-contain'} />
	) : (
		<ServiceIcon />
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
		salonID,
		diff,
		onEditEvent,
		originalEventData,
		note,
		noteFromB2CCustomer,
		refetchData,
		isPlaceholder,
		isEdit
	} = props

	const [isCardPopoverOpen, setIsCardPopoverOpen] = useState(false)

	const isPast = dayjs(originalEventData?.endDateTime || end).isBefore(dayjs())
	const isPending = reservationData?.state === RESERVATION_STATE.PENDING
	const isApproved = reservationData?.state === RESERVATION_STATE.APPROVED
	const isRealized = reservationData?.state === RESERVATION_STATE.REALIZED || reservationData?.state === RESERVATION_STATE.NOT_REALIZED
	const isOnline = reservationData?.createSourceType !== RESERVATION_SOURCE_TYPE.ONLINE
	const isEmployeeAutoassigned = reservationData?.employeeAssignmentType === RESERVATION_ASSIGNMENT_TYPE.SYSTEM

	const bgColor = !isPast ? backgroundColor : undefined

	const onlineIndicatior = reservationData?.createSourceType === RESERVATION_SOURCE_TYPE.ONLINE ? <div className={'state'} style={{ backgroundColor: bgColor }} /> : null

	const customerName = getAssignedUserLabel({
		id: customer?.id || '-',
		firstName: customer?.firstName,
		lastName: customer?.lastName,
		email: customer?.email
	})

	const icon = getIcon({ isPast, isApproved, isRealized, service })

	const handleUpdateReservationState = useCallback(
		async (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => {
			try {
				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
					{ calendarEventID, salonID },
					{ state, reason, paymentMethod },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				refetchData()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[salonID]
	)

	return (
		<CalendarReservationPopover
			start={start}
			end={end}
			service={service}
			employee={employee}
			customer={customer}
			reservationData={reservationData}
			note={note}
			noteFromB2CCustomer={noteFromB2CCustomer}
			originalEventData={originalEventData}
			isOpen={isCardPopoverOpen}
			color={backgroundColor}
			setIsOpen={setIsCardPopoverOpen}
			handleUpdateReservationState={handleUpdateReservationState}
			onEditEvent={onEditEvent}
			salonID={salonID}
			placement={calendarView === CALENDAR_VIEW.WEEK ? 'bottom' : 'left'}
		>
			<div
				className={cx('nc-event reservation', {
					'nc-day-event': calendarView === CALENDAR_VIEW.DAY,
					'nc-week-event': calendarView === CALENDAR_VIEW.WEEK,
					'multiday-event': isMultiDayEvent,
					'multiday-event-first': isFirstMultiDayEventInCurrentRange,
					'multiday-event-last': isLastMultiDaylEventInCurrentRange,
					'min-15': Math.abs(diff) <= 15,
					'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
					'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
					'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45,
					focused: isCardPopoverOpen,
					'is-past': isPast,
					'is-online': isOnline,
					'state-pending': isPending,
					'state-approved': isApproved,
					'state-realized': isRealized,
					'is-autoassigned': isEmployeeAutoassigned,
					placeholder: isPlaceholder,
					edit: isEdit || isPlaceholder
				})}
				onClick={() => setIsCardPopoverOpen(true)}
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
											<span className={'title'}>{customerName}</span>
											{onlineIndicatior}
										</div>
										{service?.name && <span className={'desc'}>{service.name}</span>}
										<div className={'icons'}>
											<AvatarIcon className={'icon employee'} />
											{icon}
											{onlineIndicatior}
										</div>
									</>
								)
							}
							case CALENDAR_VIEW.DAY:
							default: {
								return (
									<>
										<div className={'event-info'}>
											<div className={'title-wrapper'}>
												<span className={'title'}>{customerName}</span>
												{onlineIndicatior}
											</div>
											<span className={'time'}>{timeText}</span>
											{service?.name && <span className={'desc'}>{service.name}</span>}
										</div>
										<div className={'icons'}>
											<AvatarIcon className={'icon employee'} />
											{icon}
										</div>
									</>
								)
							}
						}
					})()}
				</div>
			</div>
		</CalendarReservationPopover>
	)
}

export default React.memo(ReservationCard, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
