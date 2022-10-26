import React, { FC } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'

// enums
import { CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
import CalendarMonthView from '../views/CalendarMonthView'

type Props = {
	view: CALENDAR_VIEW
	selectedDate: string
	loading: boolean
}

const CalendarContent: FC<Props> = (props) => {
	const { view, selectedDate, loading } = props

	const getView = () => {
		if (view === CALENDAR_VIEW.MONTH) {
			return <CalendarMonthView selectedDate={selectedDate} />
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return <CalendarWeekView selectedDate={selectedDate} />
		}

		return <CalendarDayView selectedDate={selectedDate} />
	}

	return (
		<Content className={'nc-content'}>
			{/* NOTE: este sa stym treba vyhrat, pripadne uplne odstranit */}
			<div className={'nc-content-animate'} key={`${selectedDate} ${view}`}>
				<Spin spinning={loading}>{getView()}</Spin>
			</div>
		</Content>
	)
}

export default CalendarContent
