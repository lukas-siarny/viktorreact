import React, { FC, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Header } from 'antd/lib/layout/layout'
import { Button, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { initialize, WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'
import Tooltip from 'antd/es/tooltip'
import { useDispatch } from 'react-redux'

// enums
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT_HOURS,
	DEFAULT_TIME_FORMAT_MINUTES,
	FORM
} from '../../../../utils/enums'

// assets
import { ReactComponent as NavIcon } from '../../../../assets/icons/navicon-16.svg'
import { ReactComponent as ChevronLeft } from '../../../../assets/icons/chevron-left-16.svg'
import { ReactComponent as CreateIcon } from '../../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownGrayDark } from '../../../../assets/icons/chevron-down-grayDark-12.svg'

// components
import DateField from '../../../../atoms/DateField'

// hooks
import useOnClickOutside from '../../../../hooks/useClickOutside'
import useMedia from '../../../../hooks/useMedia'

// utils
import { getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfWeek, roundMinutes } from '../../../../utils/helper'

const formatHeaderDate = (date: string, view: CALENDAR_VIEW) => {
	switch (view) {
		case CALENDAR_VIEW.DAY:
			return dayjs(date).format(CALENDAR_DATE_FORMAT.HEADER_DAY)
		case CALENDAR_VIEW.WEEK: {
			const firstDayOfWeek = getFirstDayOfWeek(date)
			const lastDayOfWeek = getLastDayOfWeek(date)

			// turn of the month
			if (firstDayOfWeek.month() !== lastDayOfWeek.month()) {
				return `${firstDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_START_TURN_OF_THE_MONTH)} - ${lastDayOfWeek.format(
					CALENDAR_DATE_FORMAT.HEADER_WEEK_END_TURN_OF_THE_MONTH
				)}`
			}

			return `${firstDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_START)} - ${lastDayOfWeek.format(CALENDAR_DATE_FORMAT.HEADER_WEEK_END)}`
		}
		case CALENDAR_VIEW.MONTH: {
			return getFirstDayOfMonth(date).format(CALENDAR_DATE_FORMAT.HEADER_MONTH)
		}
		default:
			return ''
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
	setCalendarView: (newView: CALENDAR_VIEW) => void
	setSiderFilterCollapsed: () => void
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	setSelectedDate: (newDate: string | dayjs.Dayjs, type?: CALENDAR_SET_NEW_DATE) => void
}

const CalendarHeader: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { setSiderFilterCollapsed, calendarView, setCalendarView, selectedDate, setSelectedDate, setCollapsed } = props

	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const calendarDropdownRef = useRef<HTMLDivElement | null>(null)
	const dateButtonRef = useRef<HTMLButtonElement | null>(null)

	useOnClickOutside([calendarDropdownRef, dateButtonRef], () => {
		setIsCalendarOpen(false)
	})

	const isSmallerDevice = useMedia(['(max-width: 1200px)'], [true], false)

	const datePicker = useMemo(() => {
		return (
			<div className={''} ref={calendarDropdownRef}>
				<DateField
					input={{ value: selectedDate, onChange: (newSelectedDate: string) => setSelectedDate(newSelectedDate) } as unknown as WrappedFieldInputProps}
					meta={{ error: false, touched: false } as unknown as WrappedFieldMetaProps}
					open={true}
					onSelect={() => setIsCalendarOpen(false)}
					showToday={false}
					className={'nc-header-date-picker'}
				/>
			</div>
		)
	}, [selectedDate, setSelectedDate])

	return (
		<Header className={'nc-header'} id={'noti-calendar-header'}>
			<div className={'nav-left'}>
				<button type={'button'} className={'nc-button light'} onClick={() => setSiderFilterCollapsed()}>
					<NavIcon />
				</button>
				<div className={'nc-button-group'}>
					<SwitchViewButton
						label={t('loc:Deň')}
						className={cx({ active: calendarView === CALENDAR_VIEW.DAY })}
						onClick={() => setCalendarView(CALENDAR_VIEW.DAY)}
						isSmallerDevice={isSmallerDevice}
					/>
					<SwitchViewButton
						label={t('loc:Týždeň')}
						className={cx({ active: calendarView === CALENDAR_VIEW.WEEK })}
						onClick={() => setCalendarView(CALENDAR_VIEW.WEEK)}
						isSmallerDevice={isSmallerDevice}
					/>
					<SwitchViewButton
						label={t('loc:Mesiac')}
						className={cx({ active: calendarView === CALENDAR_VIEW.MONTH })}
						onClick={() => setCalendarView(CALENDAR_VIEW.MONTH)}
						isSmallerDevice={isSmallerDevice}
					/>
				</div>
			</div>
			<div className={'nav-middle'}>
				<button type={'button'} className={'nc-button bordered w-8 mr-2'} onClick={() => setSelectedDate(selectedDate, CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT)}>
					<ChevronLeft />
				</button>
				<button type={'button'} className={'nc-button bordered w-8'} onClick={() => setSelectedDate(selectedDate, CALENDAR_SET_NEW_DATE.FIND_START_ADD)}>
					<ChevronLeft style={{ transform: 'rotate(180deg)' }} />
				</button>
				<Dropdown
					overlay={datePicker}
					placement='bottom'
					trigger={['click']}
					getPopupContainer={() => document.querySelector('#noti-calendar-header') as HTMLElement}
					visible={isCalendarOpen}
				>
					<button type={'button'} className={'nc-button-date mx-1'} onClick={() => setIsCalendarOpen(!isCalendarOpen)} ref={dateButtonRef}>
						{formatHeaderDate(selectedDate, calendarView)}
						<ChevronDownGrayDark />
					</button>
				</Dropdown>
				<button type={'button'} className={'nc-button light'} onClick={() => setSelectedDate(dayjs(), CALENDAR_SET_NEW_DATE.FIND_START)}>
					{t('loc:Dnes')}
				</button>
			</div>
			<div className={'nav-right'}>
				<Button
					type={'primary'}
					onClick={() => {
						// Kliknutie na pridat nastavi rezervaciu ako default
						const initData = {
							date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
							timeFrom: roundMinutes(Number(dayjs().format(DEFAULT_TIME_FORMAT_MINUTES)), Number(dayjs().format(DEFAULT_TIME_FORMAT_HOURS))),
							eventType: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION
						}
						dispatch(initialize(FORM.CALENDAR_RESERVATION_FORM, initData))
						setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION)
					}}
					icon={<CreateIcon />}
					htmlType={'button'}
					className={'noti-btn'}
				>
					{t('loc:Pridať novú')}
				</Button>
			</div>
		</Header>
	)
}

export default CalendarHeader
