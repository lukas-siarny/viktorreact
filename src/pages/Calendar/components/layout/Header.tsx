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
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_SET_NEW_DATE, CALENDAR_VIEW, STRINGS, CALENDAR_DEBOUNCE_DELAY } from '../../../../utils/enums'

// assets
import { ReactComponent as ChevronDownGrayDark } from '../../../../assets/icons/chevron-down-currentColor-12.svg'
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

const getDateFromSelectedMonth = (selectedMonth: { year: number; month: number }) => {
	return dayjs(new Date(selectedMonth?.year, selectedMonth.month, 1))
}

const formatHeaderDate = (date: string, view: CALENDAR_VIEW, selectedMonth?: { year: number; month: number }) => {
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
		case CALENDAR_VIEW.MONTH: {
			if (selectedMonth) {
				return getDateFromSelectedMonth(selectedMonth).format(CALENDAR_DATE_FORMAT.HEADER_MONTH)
			}
			return dayjs(date).startOf('month').format(CALENDAR_DATE_FORMAT.HEADER_MONTH)
		}
		case CALENDAR_VIEW.DAY:
		default:
			return dayjs(date).format(CALENDAR_DATE_FORMAT.HEADER_DAY)
	}
}

const disabledDatePickerFnc = () => true

const SwitchViewButton: FC<{ label: string; isSmallerDevice: boolean; className: string; onClick: () => void; disabled?: boolean }> = (props) => {
	const { label, isSmallerDevice, className, onClick, disabled } = props

	const trimmedLabel = isSmallerDevice ? label.slice(0, 1) : label

	const button = (
		<button type={'button'} className={className} onClick={onClick} disabled={disabled}>
			{trimmedLabel}
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
	onAddEvent: () => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	setEventsViewType: (newViewType: CALENDAR_EVENTS_VIEW_TYPE) => void
	enabledSalonReservations?: boolean
	loadingData?: boolean
	selectedMonth: { year: number; month: number }
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
		enabledSalonReservations,
		loadingData,
		selectedMonth
	} = props

	const [currentDate, setCurrentDate] = useState(selectedDate)
	const [formattedDate, setFormattedDate] = useState(formatHeaderDate(currentDate, calendarView, selectedMonth))
	const [currentSelectedMonth, setCurrentSelectedMonth] = useState(selectedMonth)

	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const calendarDropdownRef = useRef<HTMLDivElement | null>(null)
	const dateButtonRef = useRef<HTMLButtonElement | null>(null)

	useOnClickOutside([calendarDropdownRef, dateButtonRef], () => {
		setIsCalendarOpen(false)
	})

	const isSmallerDevice = useMedia(['(max-width: 1200px)'], [true], false)

	useEffect(() => {
		setCurrentDate(selectedDate)
	}, [selectedDate])

	useEffect(() => {
		setCurrentSelectedMonth(selectedMonth)
	}, [selectedMonth])

	useEffect(() => {
		setFormattedDate(formatHeaderDate(currentDate, calendarView, currentSelectedMonth))
	}, [currentDate, calendarView, currentSelectedMonth])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const setSelectedDateDebounced = useCallback(debounce(setSelectedDate, CALENDAR_DEBOUNCE_DELAY), [setSelectedDate])

	const changeSelectedDate = useCallback(
		(newDate: string | dayjs.Dayjs, type: CALENDAR_SET_NEW_DATE = CALENDAR_SET_NEW_DATE.DEFAULT, debounced = false) => {
			let newQueryDate: string | dayjs.Dayjs = newDate
			let newSelectedMonth = { year: currentSelectedMonth.year, month: currentSelectedMonth.month }

			switch (type) {
				case CALENDAR_SET_NEW_DATE.FIND_START_ADD:
				case CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT: {
					const newSelectedMonthDate = getDateFromSelectedMonth(newSelectedMonth)
					newQueryDate = dayjs(newDate).startOf(calendarView.toLowerCase() as dayjs.OpUnitType)

					if (type === CALENDAR_SET_NEW_DATE.FIND_START_ADD) {
						newQueryDate = (calendarView === CALENDAR_VIEW?.MONTH ? newSelectedMonthDate : newQueryDate).add(1, calendarView.toLowerCase() as dayjs.OpUnitType)
					} else {
						newQueryDate = (calendarView === CALENDAR_VIEW?.MONTH ? newSelectedMonthDate : newQueryDate).subtract(1, calendarView.toLowerCase() as dayjs.OpUnitType)
					}
					newSelectedMonth = {
						year: dayjs(newQueryDate).year(),
						month: dayjs(newQueryDate).month()
					}
					break
				}
				default:
					break
			}

			const newQueryDateFormatted = dayjs(newQueryDate).format(CALENDAR_DATE_FORMAT.QUERY)

			setCurrentDate(newQueryDateFormatted)
			setCurrentSelectedMonth(newSelectedMonth)

			if (debounced) {
				setSelectedDateDebounced(newQueryDateFormatted)
			} else {
				setSelectedDate(newQueryDateFormatted)
				setSelectedDateDebounced.cancel()
			}
		},
		[calendarView, setSelectedDate, setSelectedDateDebounced, currentSelectedMonth]
	)

	const datePicker = useMemo(() => {
		return (
			<div ref={calendarDropdownRef}>
				<DateField
					input={{ value: currentDate, onChange: (newSelectedDate: string) => changeSelectedDate(newSelectedDate) } as unknown as WrappedFieldInputProps}
					meta={{ error: false, touched: false } as unknown as WrappedFieldMetaProps}
					open={true}
					onSelect={() => setIsCalendarOpen(false)}
					showToday={false}
					className={'nc-header-date-picker'}
					disabledDate={loadingData ? disabledDatePickerFnc : undefined}
				/>
			</div>
		)
	}, [currentDate, loadingData, changeSelectedDate])

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
			},
			{
				key: CALENDAR_VIEW.MONTH,
				label: t('loc:Mesiac'),
				value: CALENDAR_VIEW.MONTH
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
						disabled={loadingData}
					/>
				</div>
				<div className={'nc-button-group'}>
					<SwitchViewButton
						label={t('loc:Rezervácie')}
						className={cx({ active: eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION })}
						onClick={() => setEventsViewType(CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)}
						isSmallerDevice={isSmallerDevice}
						disabled={loadingData}
					/>
					<SwitchViewButton
						label={t('loc:Shifts')}
						className={cx({ active: eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF })}
						onClick={() => setEventsViewType(CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF)}
						isSmallerDevice={isSmallerDevice}
						disabled={loadingData}
					/>
				</div>
			</div>
			<div className={'nav-middle'}>
				<button
					type={'button'}
					className={'nc-button w-8 mr-2'}
					onClick={() => changeSelectedDate(currentDate, CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT, true)}
					disabled={loadingData}
				>
					<ChevronLeft />
				</button>
				<button
					type={'button'}
					className={'nc-button w-8'}
					onClick={() => changeSelectedDate(currentDate, CALENDAR_SET_NEW_DATE.FIND_START_ADD, true)}
					disabled={loadingData}
				>
					<ChevronLeft style={{ transform: 'rotate(180deg)' }} />
				</button>
				<Dropdown
					overlay={datePicker}
					placement='bottom'
					trigger={['click']}
					getPopupContainer={() => document.querySelector('#noti-calendar-header') as HTMLElement}
					visible={isCalendarOpen}
					destroyPopupOnHide
				>
					<button type={'button'} className={'nc-button-date mx-1'} onClick={() => setIsCalendarOpen(!isCalendarOpen)} ref={dateButtonRef}>
						{formattedDate}
						<ChevronDownGrayDark color={'#808080'} />
					</button>
				</Dropdown>
				<button
					type={'button'}
					className={cx('nc-button', { active: dayjs(getSelectedDateForCalendar(calendarView, selectedDate)).isToday() })}
					onClick={() => changeSelectedDate(dayjs())}
					disabled={loadingData}
				>
					{t('loc:Dnes')}
				</button>
			</div>
			<div className={'nav-right'}>
				<Button type={'primary'} onClick={onAddEvent} icon={<CreateIcon />} disabled={!enabledSalonReservations} htmlType={'button'} className={'noti-btn'}>
					{STRINGS(t).addRecord('').trim()}
				</Button>
			</div>
		</Header>
	)
}

export default CalendarHeader
