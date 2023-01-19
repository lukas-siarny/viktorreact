import React, { FC, useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Button, Dropdown } from 'antd'
import Tooltip from 'antd/es/tooltip'
import { Header } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'

// enums
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	STRINGS,
	CALENDAR_DEBOUNCE_DELAY,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT
} from '../../../../utils/enums'

// assets
import { ReactComponent as ChevronDownGrayDark } from '../../../../assets/icons/chevron-down-grayDark-12.svg'
import { ReactComponent as ChevronLeft } from '../../../../assets/icons/chevron-left-16.svg'
import { ReactComponent as NavIcon } from '../../../../assets/icons/navicon-16.svg'
import { ReactComponent as CreateIcon } from '../../../../assets/icons/plus-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import SelectField from '../../../../atoms/SelectField'

// hooks
import useOnClickOutside from '../../../../hooks/useClickOutside'
import useMedia from '../../../../hooks/useMedia'

// utils
import { getSelectedDateForCalendar } from '../../calendarHelpers'
import { INewCalendarEvent } from '../../../../types/interfaces'

const formatHeaderDate = (date: string, view: CALENDAR_VIEW) => {
	switch (view) {
		case CALENDAR_VIEW.WEEK: {
			const firstDayOfWeek = dayjs(date).startOf('week')
			const lastDayOfWeek = dayjs(date).endOf('week')

			// turn of the month
			if (firstDayOfWeek.month() !== lastDayOfWeek.month()) {
				return `${firstDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_START_TURN_OF_THE_MONTH)} - ${lastDayOfWeek.format(
					CALENDAR_DATE_FORMAT.HEADER_WEEK_END_TURN_OF_THE_MONTH
				)}`
			}

			return `${firstDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_START)} - ${lastDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_END)}`
		}
		/* case CALENDAR_VIEW.MONTH: {
			return dayjs(date).startOf('month').format(CALENDAR_DATE_FORMAT.HEADER_MONTH)
		} */
		case CALENDAR_VIEW.DAY:
		default:
			return dayjs(date).format(CALENDAR_DATE_FORMAT.HEADER_DAY)
	}
}

const SwitchViewButton: FC<{ label: string; isSmallerDevice: boolean; className: string; onClick: () => void }> = (props) => {
	const { label, isSmallerDevice, className, onClick } = props

	const timmedLabel = isSmallerDevice ? label.slice(0, 1) : label

	const button = (
		<button type={'button'} className={className} onClick={onClick}>
			{timmedLabel}
		</button>
	)

	return isSmallerDevice ? (
		<Tooltip title={label} placement={'bottom'}>
			{button}
		</Tooltip>
	) : (
		button
	)
}

type Props = {
	selectedDate: string
	calendarView: CALENDAR_VIEW
	siderFilterCollapsed: boolean
	setCalendarView: (newView: CALENDAR_VIEW) => void
	setSiderFilterCollapsed: () => void
	setSelectedDate: (newDate: string) => void
	onAddEvent: (initialData?: INewCalendarEvent, fromAddButton?: boolean) => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	setEventsViewType: (newViewType: CALENDAR_EVENTS_VIEW_TYPE) => void
	enabledSalonReservations?: boolean
}

const CalendarHeader: FC<Props> = (props) => {
	const [t] = useTranslation()

	const {
		setSiderFilterCollapsed,
		calendarView,
		setCalendarView,
		selectedDate,
		setSelectedDate,
		siderFilterCollapsed,
		eventsViewType,
		setEventsViewType,
		onAddEvent,
		enabledSalonReservations
	} = props

	const [currentDate, setCurrentDate] = useState(selectedDate)

	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const calendarDropdownRef = useRef<HTMLDivElement | null>(null)
	const dateButtonRef = useRef<HTMLButtonElement | null>(null)

	useOnClickOutside([calendarDropdownRef, dateButtonRef], () => {
		setIsCalendarOpen(false)
	})

	const isSmallerDevice = useMedia(['(max-width: 1200px)'], [true], false)

	useEffect(() => setCurrentDate(selectedDate), [selectedDate])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const setSelectedDateDebounced = useCallback(debounce(setSelectedDate, CALENDAR_DEBOUNCE_DELAY), [setSelectedDate])

	const changeSelectedDate = (newDate: string | dayjs.Dayjs, type: CALENDAR_SET_NEW_DATE = CALENDAR_SET_NEW_DATE.DEFAULT, debounced = false) => {
		let newQueryDate: string | dayjs.Dayjs = newDate

		switch (type) {
			case CALENDAR_SET_NEW_DATE.FIND_START_ADD:
				newQueryDate = dayjs(newDate)
					.startOf(calendarView.toLowerCase() as dayjs.OpUnitType)
					.add(1, calendarView.toLowerCase() as dayjs.OpUnitType)
				break
			case CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT:
				newQueryDate = dayjs(newDate)
					.startOf(calendarView.toLowerCase() as dayjs.OpUnitType)
					.subtract(1, calendarView.toLowerCase() as dayjs.OpUnitType)
				break
			default:
				break
		}

		const newQueryDateFormatted = dayjs(newQueryDate).format(CALENDAR_DATE_FORMAT.QUERY)
		setCurrentDate(newQueryDateFormatted)

		if (debounced) {
			setSelectedDateDebounced(newQueryDateFormatted)
		} else {
			setSelectedDate(newQueryDateFormatted)
			setSelectedDateDebounced.cancel()
		}
	}

	const datePicker = () => {
		return (
			<div ref={calendarDropdownRef}>
				<DateField
					input={{ value: currentDate, onChange: (newSelectedDate: string) => changeSelectedDate(newSelectedDate) } as unknown as WrappedFieldInputProps}
					meta={{ error: false, touched: false } as unknown as WrappedFieldMetaProps}
					open={true}
					onSelect={() => setIsCalendarOpen(false)}
					showToday={false}
					className={'nc-header-date-picker'}
				/>
			</div>
		)
	}

	const calendarViewOptions = useMemo(
		() => [
			{
				key: CALENDAR_VIEW.DAY,
				label: t('loc:Deň'),
				value: CALENDAR_VIEW.DAY
			},
			{
				key: CALENDAR_VIEW.WEEK,
				label: t('loc:Týždeň'),
				value: CALENDAR_VIEW.WEEK
			}
		],
		[t]
	)

	return (
		<Header className={'nc-header'} id={'noti-calendar-header'}>
			<div className={'nav-left'}>
				<button type={'button'} className={cx('nc-button', { active: !siderFilterCollapsed })} onClick={() => setSiderFilterCollapsed()}>
					<NavIcon style={{ transform: siderFilterCollapsed ? 'rotate(180deg)' : undefined }} />
				</button>
				<div>
					<SelectField
						input={
							{
								value: calendarView,
								onChange: (value: CALENDAR_VIEW) => setCalendarView(value)
							} as any
						}
						meta={{} as any}
						onChange={(value) => setCalendarView(value)}
						className={'p-0'}
						options={calendarViewOptions}
						dropdownMatchSelectWidth={false}
					/>
				</div>
				<div className={'nc-button-group'}>
					<SwitchViewButton
						label={t('loc:Rezervácie')}
						className={cx({ active: eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION })}
						onClick={() => setEventsViewType(CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)}
						isSmallerDevice={isSmallerDevice}
					/>
					<SwitchViewButton
						label={t('loc:Shifts')}
						className={cx({ active: eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF })}
						onClick={() => setEventsViewType(CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF)}
						isSmallerDevice={isSmallerDevice}
					/>
				</div>
			</div>
			<div className={'nav-middle'}>
				<button type={'button'} className={'nc-button w-8 mr-2'} onClick={() => changeSelectedDate(currentDate, CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT, true)}>
					<ChevronLeft />
				</button>
				<button type={'button'} className={'nc-button w-8'} onClick={() => changeSelectedDate(currentDate, CALENDAR_SET_NEW_DATE.FIND_START_ADD, true)}>
					<ChevronLeft style={{ transform: 'rotate(180deg)' }} />
				</button>
				<Dropdown
					overlay={datePicker}
					placement='bottom'
					trigger={['click']}
					getPopupContainer={() => document.querySelector('#noti-calendar-header') as HTMLElement}
					open={isCalendarOpen}
					destroyPopupOnHide
				>
					<button type={'button'} className={'nc-button-date mx-1'} onClick={() => setIsCalendarOpen(!isCalendarOpen)} ref={dateButtonRef}>
						{formatHeaderDate(currentDate, calendarView)}
						<ChevronDownGrayDark />
					</button>
				</Dropdown>
				<button
					type={'button'}
					className={cx('nc-button', { active: dayjs(getSelectedDateForCalendar(calendarView, selectedDate)).isToday() })}
					onClick={() => changeSelectedDate(dayjs())}
				>
					{t('loc:Dnes')}
				</button>
			</div>
			<div className={'nav-right'}>
				<Button
					type={'primary'}
					onClick={() =>
						onAddEvent({
							// NOTE: ak klikne pouzivatel na tlacidlo pridat tak sa initnu len date a timeFrom kedze nie je vybraty kolega
							date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
							timeFrom: dayjs().format(DEFAULT_TIME_FORMAT)
						} as INewCalendarEvent)
					}
					icon={<CreateIcon />}
					disabled={!enabledSalonReservations}
					htmlType={'button'}
					className={'noti-btn'}
				>
					{STRINGS(t).addRecord('')}
				</Button>
			</div>
		</Header>
	)
}

export default CalendarHeader
