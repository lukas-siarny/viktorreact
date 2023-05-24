import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import useResizeObserver from '@react-hook/resize-observer'
import cx from 'classnames'

// full calendar
import FullCalendar, { DateSelectArg, DateSpanApi, EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW, DEFAULT_TIME_FORMAT } from '../../../../utils/enums'
import { composeWeekResources, composeWeekViewEvents, getWeekDayResourceID } from '../../calendarHelpers'
import { getDateTime } from '../../../../utils/helper'
import eventContent from '../../eventContent'

// types
import { ICalendarView, IWeekViewResourceExtenedProps } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

const getTodayLabelId = (date: string | dayjs.Dayjs) => `${dayjs(date).format(CALENDAR_DATE_FORMAT.QUERY)}-is-today`

const resourceGroupLabelContent = () => {
	return (
		<>
			<div className={'nc-resource-group-label-bg'} />
			<div className={'nc-resource-group-label-content'} />
		</>
	)
}

const resourceGroupLaneContent = () => {
	return (
		<>
			<div className={'nc-resource-group-lane-bg'} />
			<div className={'nc-resource-group-lane-content'} />
		</>
	)
}

const resourceAreaColumns = [
	{
		field: 'day',
		headerContent: <span className={'invisible'}>{'header'}</span>, // NOTE: do not delete this - calendar header won't render correctly without this
		width: 55,
		cellContent: <span /> // NOTE: do not delete this - calendar header won't render correctly without this
	},
	{
		field: 'employee',
		width: 145,
		cellContent: (args: any) => {
			const { resource } = args || {}
			const { eventBackgroundColor } = resource || {}
			const extendedProps = resource?.extendedProps as IWeekViewResourceExtenedProps
			const employee = extendedProps?.employee

			return (
				<div className={cx('nc-week-label-resource', { 'is-deleted': employee?.isDeleted })}>
					<div className={'image'} style={{ backgroundImage: `url("${employee?.image}")`, borderColor: eventBackgroundColor }} />
					<span className={'info block text-xs font-normal min-w-0 truncate max-w-full'}>{employee?.name}</span>
					{employee?.isTimeOff && (
						<div className={'absence-icon'}>
							<AbsenceIcon />
						</div>
					)}
				</div>
			)
		}
	}
]

const LabelContent = React.memo(({ labelDate }: { labelDate: string }) => <div className={'nc-week-slot-label'}>{labelDate}</div>)

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { date } = data || {}

	return <LabelContent labelDate={dayjs(date).format('HH:mm')} />
}

/**
 * keďže sa reálne jedná o denné zobrazenie, NowIndicator, ktorý ponúka FC sa zobrazí cez celú výšku kalendára
 * je preto potrebné ho osekať tak, aby sa zobrazoval len pre grupu riadkov, ktoré predstavujúcu dnešný deň (ak sa nachádza v aktuálne zvolenom rozmedzí)
 */
const NowIndicator = () => {
	const [size, setSize] = useState<number>(0)
	const [indicatorDimmensions, setIndicatorDimmensions] = useState({
		top: 0,
		height: 0
	})

	const datagridBody = document.querySelector('.fc-datagrid-body')

	useResizeObserver(datagridBody as HTMLElement | null, (entry) => setSize(entry.contentRect.height))

	useEffect(() => {
		setTimeout(() => {
			const todayLabel = document.getElementById(getTodayLabelId(dayjs()))

			if (todayLabel) {
				const top = todayLabel?.parentElement?.parentElement?.offsetTop as number
				const height = todayLabel?.clientHeight
				setIndicatorDimmensions({ top, height })
			}
		}, 0)
	}, [size])

	return <div className={'fc-week-now-indicator'} style={{ top: indicatorDimmensions.top, height: indicatorDimmensions.height }} />
}

const createDayLabelElement = (resourceElemenet: HTMLElement, employeesLength: number) => {
	const td = document.createElement('td')
	td.setAttribute('rowspan', employeesLength.toString())
	td.setAttribute('style', 'position: relative; width: 1px;')

	const div = document.createElement('div')
	div.classList.add('nc-week-label-day')

	const { resourceId } = resourceElemenet.dataset || {}
	const date = resourceId?.split('_')[0]

	if (date) {
		div.setAttribute('name', date)

		if (dayjs(date).isToday()) {
			div.classList.add('is-today')
			div.setAttribute('id', getTodayLabelId(date))
		}

		const dayNumber = document.createElement('span')
		dayNumber.innerHTML = dayjs(date).format('D')

		const dayName = document.createElement('span')
		dayName.classList.add('day-name')
		dayName.innerHTML = dayjs(date).format('ddd')

		div.appendChild(dayNumber)
		div.appendChild(dayName)
		td.appendChild(div)
	}
	return td
}

interface ICalendarWeekView extends ICalendarView {
	updateCalendarSize: () => void
	weekDays: string[]
	handleSelectAllow: (selectInfo: DateSpanApi) => boolean
}

/**
 * síce sa jedná o týždenné view, no reálne sa používa FC plugin pre denné zobraznie - https://fullcalendar.io/docs/timeline-view, ktorý je ohnutý tak, aby pôsobil ako týždenné zobrazenie
 * žiadne z týždenných zobrazení, ktoré FC ponúka, nám totiž neumožnil dosiahnúť požadovné rozloženie
 * v dennom view využívame možnosť rozdeliť ľavu resource osu na viacero stĺpcov - viď https://fullcalendar.io/docs/resourceAreaColumns-demo - prvý stĺpec u nás reprezentuje dni v týždni - 'day' column, druhý stĺpec zamestnancov - 'employee' column (viď vyššie zadefinované resourceAreaColumns)
 * prináša to zo sebou viacero komplikácii:
 *
 * 1/ vždy je nutné zo zoznamu zamesnancov vyskladať reseources. Pre dvoch zamesnancov a range 2 - 8.1.2023 by to vyzeralo nejak takto:
 * const weekDayResources = [
		{ id: 'employeeID1_2023-01-02', day: '2023-01-02', employee: employee1Data },
		{ id: 'employeeID2_2023-01-02', day: '2023-01-02', employee: employee2Data },
		{ id: 'employeeID1_2023-01-03', day: '2023-01-03', employee: employee1Data },
		{ id: 'employeeID2_2023-01-03', day: '2023-01-03', employee: employee2Data },
		...,
		...,
		{ id: 'employeeID1_2023-01-08', day: '2023-01-08', employee: employee1Data },
		{ id: 'employeeID2_2023-01-08', day: '2023-01-08', employee: employee2Data },
	]
 * každý riadok v timeline predstavuje jeden resource (čiže máme 2 zamesnacov x 7 dni = v timeline bude 14 riadkov)
 *
 * 2/ časy eventov, ktoré prídu z BE sa musia pretransformovať tak, aby odpovedali dátumu, ktorý je nastavený v FC (ako sa nastavuje čas pre FC je popísáne v komentari vo funkcii getSelectedDateForCalendar())
 * teda ak dotiahnem data z BE pre range 2 - 8.1.2023 a v FC je nastavený dátum 2.1.2023, všetky eventy je potrebné pretransformovať tak, aby odpovedali tomuto dátumu (eventy s iným dátumom by sa v kalendári logicky nezobrazili)
 * BE event data: { startTime: '8.1.2023:11:00', endTime: '8.1.2023:12:00', employeeId: 'employeeID1' } => pretransformuje na FC event data: { startTime: '2.1.2023:11:00', endTime: '2.1.2023:12:00', resourceId: 'employeeID1_2023-01-08' }) - každému eventu je priradené resourceId, na základe ktorého ho potom vieme zaradiť na správne miesto v kalendári
 *
 * po úprave eventu je potrebné kalendárove data zpätne pretransformovať na data, ktoré sa odošlú na BE (napr. posuniem event z pondelka na piatok)
 * callback, ktorý FC zavolá po zmene eventu mi vráti informácie o novom čase a novom resource - na základe týchto informácii vieme vyskladať správne data pre BE:
 * FC event data pred posunmom: { startTime: '2.1.2023:11:00', endTime: '2.1.2023:12:00', resourceId: 'employeeID1_2023-01-02' }) - na základe resourcu vieme, že pôvodny dátum bol - 2.1.2023, id zamestnacna bolo 'employeeID1', čas začiatku a konca eventu vieme vyčítať zo startTime 11:00 a endTime 12:00)
 * FC event data po posune { startTime: '2.1.2023:15:00', endTime: '2.1.2023:16:00', resourceId: 'employeeID2_2023-01-08' }) - z resroucu vyčítame, že event sa posunul na 2023-01-08 a na druhého zamesnanca
 * BE data pretransformované z FC event dát po posune: { startTime: '2023-01-08:15:00', endTime: '2023-01-08:16:00', employeeID: 'employeeID2' }
 */

const CalendarWeekView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarWeekView>((props, ref) => {
	const {
		selectedDate,
		eventsViewType,
		shiftsTimeOffs,
		reservations,
		employees,
		onEditEvent,
		onReservationClick,
		onEventChange,
		weekDays,
		updateCalendarSize,
		onAddEvent,
		virtualEvent,
		enabledSalonReservations,
		onEventChangeStart,
		onEventChangeStop,
		handleSelectAllow
	} = props

	const events = useMemo(() => {
		const data = composeWeekViewEvents(selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees)

		if (virtualEvent) {
			const { eventData, ...otherProps } = virtualEvent
			// pre WeekView sa musi resourceId upravit do tvaru Date_ResourceID, lebo skrz tieto ID su mapovane eventy do prislusnych dni
			const resourceId = getWeekDayResourceID(virtualEvent.resourceId as string, eventData.date)

			// NOTE: start a end na root urovni su vzdy rovnakeho datumu, lebo Week View je v podstate Daily View (inak vyskladane).
			// Pozor! Tieto hodnoty su iba pre ucely FullCalendar, aby vedel korektne vyrenderovat eventy. Realne datumy (zobrazene aj v SiderForme) odpovedaju hodnotam v evenData: date, startDateTime, endDateTime, start, end
			const newEvent = {
				...otherProps,
				eventData: {
					...eventData,
					resourceId
				},
				resourceId,
				start: getDateTime(selectedDate, eventData.start.time),
				end: getDateTime(selectedDate, eventData.end.time)
			}

			return [...data, newEvent]
		}

		return data
	}, [selectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees, virtualEvent])

	const handleNewEvent = (event: DateSelectArg) => {
		if (event.resource) {
			// eslint-disable-next-line no-underscore-dangle
			const { day, employee } = event.resource._resource.extendedProps

			// korektny datum, na ktory prislucha dany event sa zoberie z EventData - suvis s logikou popisanou v commente vyssie L:172
			onAddEvent({
				date: day,
				timeFrom: dayjs(event.startStr).format(DEFAULT_TIME_FORMAT),
				timeTo: dayjs(event.endStr).format(DEFAULT_TIME_FORMAT),
				employee: {
					value: employee.id,
					key: employee.id,
					label: employee.name
				}
			})
		}
	}

	const resources = useMemo(() => composeWeekResources(weekDays, shiftsTimeOffs, employees), [weekDays, shiftsTimeOffs, employees])

	useEffect(() => {
		/**
		 * resources timelina je rozdelená na dve stĺpce, 'day' a 'employees'
		 * defaultne sa to zobrazuje takto https://fullcalendar.io/docs/resourceAreaColumns-demo - každý stĺpec ma káždý riadok
		 * my však potrebujeme, aby sa prvý stĺpec zgrupoval podľa dní, to však momentálne nie je možné dosiahnúť bežnými nastaveniami FC kvoli bugu: https://github.com/fullcalendar/fullcalendar/issues/5324
		 * v tomto useEffecte sa priamo v DOMku upraví tabuľka tak, aby sme toto zobrazenie dosiahli
		 */
		if (employees.length) {
			;(() =>
				setTimeout(() => {
					const dataGridBody = document.querySelector('.fc-datagrid-body')
					const rows = dataGridBody?.querySelectorAll('tr')
					rows?.forEach((row, i) => {
						if (i % (employees.length + 1) === 1) {
							row.classList.add('is-first-row')
							const resourceElemenet = row.querySelector('[data-resource-id]')
							const alreadyExistingDayLabel = row.children[2]

							if (alreadyExistingDayLabel) {
								alreadyExistingDayLabel.setAttribute('rowspan', employees.length.toString())
							} else if (resourceElemenet && resourceElemenet instanceof HTMLElement) {
								const resourceDayLabel = createDayLabelElement(resourceElemenet, employees.length)
								row.appendChild(resourceDayLabel)
							}
						} else if (row.classList.contains('is-first-row')) {
							row.classList.remove('is-first-row')
							const alreadyExistingDayLabel = row.children[2]
							if (alreadyExistingDayLabel) {
								alreadyExistingDayLabel.remove()
							}
						}
					})
				}, 0))()
		}
	}, [employees.length, selectedDate])

	useEffect(() => {
		// NOTE: ak neni je povoleny online booking tak sa nastavi disabled state nad kalendarom
		const body = document.getElementsByClassName('fc-timeline-body')[0]
		if (!enabledSalonReservations) {
			body.classList.add('active')
		} else {
			body.classList.remove('active')
		}
	}, [enabledSalonReservations])

	return (
		<div className={'nc-calendar-wrapper'} id={'nc-calendar-week-wrapper'}>
			<FullCalendar
				ref={ref}
				// plugins
				plugins={[interactionPlugin, scrollGrid, resourceTimelinePlugin]}
				// settings
				schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
				timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
				slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
				slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
				fixedMirrorParent={CALENDAR_COMMON_SETTINGS.FIXED_MIRROR_PARENT}
				eventConstraint={CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT}
				scrollTimeReset={false}
				/**
				 * resourceGroupField={'day'}
				 * zgrupi riadky v timeline podľa dní a vytvorí medzi nimi dividere (viď. https://fullcalendar.io/docs/timeline-resourceGroupField-demo)
				 * v linku vyššie sú to tie šedé kolapsovateľné riadky, u nás sú však upravené tak, aby to vytvorilo spacing medzi jednotlivými dňami
				 * je to upravené cez cssko za pomoci injectovaného kontentu https://fullcalendar.io/docs/content-injection (resourceGroupLaneContent, resourceGroupLabelContent)
				 */
				resourceGroupField={'day'}
				height='auto'
				slotMinWidth={25} // ak sa zmeni tato hodnota, je potrebne upravit min-width v _calendar.sass => .nc-week-event
				eventMinWidth={25}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={selectedDate}
				editable={enabledSalonReservations}
				weekends
				stickyFooterScrollbar
				nowIndicator
				selectable={enabledSalonReservations}
				resourceOrder='title'
				// data sources
				eventSources={[events]}
				resources={resources}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				resourceGroupLaneContent={resourceGroupLaneContent}
				resourceGroupLabelContent={resourceGroupLabelContent}
				slotLabelContent={slotLabelContent}
				eventContent={(data: EventContentArg) => eventContent(data, CALENDAR_VIEW.WEEK, onEditEvent, onReservationClick)}
				nowIndicatorContent={() => <NowIndicator />}
				// handlers
				eventDrop={onEventChange}
				eventResize={onEventChange}
				eventDragStart={onEventChangeStart}
				eventResizeStart={onEventChangeStart}
				eventDragStop={onEventChangeStop}
				eventResizeStop={onEventChangeStop}
				select={(selectedEvent) => handleNewEvent(selectedEvent)}
				selectAllow={handleSelectAllow}
				/**
				 * po tom čo sa setnu resources a eventy je ešte potrebné updatnuť veľkost kalendára, pretože sa občas stávalo, že sa nesprávne vypočítala výška a eventy boli nastackované na sebe v jednom riadku
				 */
				resourcesSet={() => setTimeout(updateCalendarSize, 0)}
				eventsSet={() => {
					setTimeout(() => {
						updateCalendarSize()
					}, 0)
				}}
			/>
		</div>
	)
})

export default React.memo(CalendarWeekView, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
