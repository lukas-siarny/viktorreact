import React, { FC, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Header } from 'antd/lib/layout/layout'
import { Button, Dropdown, Menu } from 'antd'
import dayjs from 'dayjs'

// enums
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, CALENDAR_SET_NEW_DATE, CALENDAR_VIEW } from '../../../utils/enums'

// assets
import { ReactComponent as NavIcon } from '../../../assets/icons/navicon-16.svg'
import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left-16.svg'
import { ReactComponent as ServicesIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as AbsenceIcon } from '../../../assets/icons/absence-icon.svg'
import { ReactComponent as ShiftIcon } from '../../../assets/icons/shift-icon.svg'
import { ReactComponent as BreakIcon } from '../../../assets/icons/break-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronDownGrayDark } from '../../../assets/icons/chevron-down-grayDark-12.svg'

// components
import DateField from '../../../atoms/DateField'

// hooks
import useOnClickOutside from '../../../hooks/useClickOutside'

type Props = {
	selectedDate: string
	calendarView: CALENDAR_VIEW
	setCalendarView: (newView: CALENDAR_VIEW) => void
	setSiderFilterCollapsed: () => void
	setSiderEventManagementCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	setSelectedDate: (newDate: string | dayjs.Dayjs, type?: CALENDAR_SET_NEW_DATE) => void
}

const CalendarLayoutHeader: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { setSiderFilterCollapsed, calendarView, setCalendarView, setSiderEventManagementCollapsed, selectedDate, setSelectedDate } = props

	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const calendarDropdownRef = useRef<HTMLDivElement | null>(null)
	const dateButtonRef = useRef<HTMLButtonElement | null>(null)

	useOnClickOutside(
		calendarDropdownRef,
		() => {
			setIsCalendarOpen(false)
		},
		[dateButtonRef]
	)

	const addMenu = useMemo(() => {
		const itemClassName = 'p-2 font-medium min-w-0'
		return (
			<Menu
				getPopupContainer={() => document.querySelector('#noti-calendar-header') as HTMLElement}
				className={'shadow-md max-w-xs min-w-48 w-48 mt-1 p-2 flex flex-col gap-2'}
				style={{ width: 200 }}
				items={[
					{
						key: 'reservation',
						label: t('loc:Rezerváciu'),
						icon: <ServicesIcon />,
						className: itemClassName,
						onClick: () => setSiderEventManagementCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION)
					},
					{
						key: 'shift',
						label: t('loc:Smenu'),
						icon: <ShiftIcon />,
						className: itemClassName,
						onClick: () => setSiderEventManagementCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT)
					},
					{
						key: 'absence',
						label: t('loc:Absenciu'),
						icon: <AbsenceIcon />,
						className: itemClassName,
						onClick: () => setSiderEventManagementCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF)
					},
					{
						key: 'break',
						label: t('loc:Prestávku'),
						icon: <BreakIcon />,
						className: itemClassName,
						onClick: () => setSiderEventManagementCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK)
					}
				]}
			/>
		)
	}, [t, setSiderEventManagementCollapsed])

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
					<button type={'button'} className={cx({ active: calendarView === CALENDAR_VIEW.DAY })} onClick={() => setCalendarView(CALENDAR_VIEW.DAY)}>
						{t('loc:Deň')}
					</button>
					<button type={'button'} className={cx({ active: calendarView === CALENDAR_VIEW.WEEK })} onClick={() => setCalendarView(CALENDAR_VIEW.WEEK)}>
						{t('loc:Týždeň')}
					</button>
					<button type={'button'} className={cx({ active: calendarView === CALENDAR_VIEW.MONTH })} onClick={() => setCalendarView(CALENDAR_VIEW.MONTH)}>
						{t('loc:Mesiac')}
					</button>
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
						{dayjs(selectedDate).format('ddd, D MMM YYYY')}
						<ChevronDownGrayDark />
					</button>
				</Dropdown>
				<button type={'button'} className={'nc-button light'} onClick={() => setSelectedDate(dayjs(), CALENDAR_SET_NEW_DATE.FIND_START)}>
					{t('loc:Dnes')}
				</button>
			</div>
			<div className={'nav-right'}>
				<Dropdown overlay={addMenu} placement='bottomRight' trigger={['click']} getPopupContainer={() => document.querySelector('#noti-calendar-header') as HTMLElement}>
					<Button
						type={'primary'}
						onClick={(e) => e.preventDefault()}
						onKeyPress={(e) => e.preventDefault()}
						icon={<CreateIcon />}
						htmlType={'button'}
						className={'noti-btn'}
					>
						{t('loc:Pridať novú')}
					</Button>
				</Dropdown>
			</div>
		</Header>
	)
}

export default CalendarLayoutHeader
