import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// types
import { ICalendarFilter } from '../../../../types/interfaces'
import { ICalendarEmployeesPayload } from '../../../../reducers/calendarEmployees/calendarEmployeesActions'

// components
import CalendarFilter from '../forms/CalendarFilter'

// enums
import { CALENDAR_EVENTS_VIEW_TYPE } from '../../../../utils/enums'

type Props = {
	collapsed: boolean
	parentPath: string
	handleSubmit: (values: ICalendarFilter) => void
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	loadingData?: boolean
	employeesOptions: ICalendarEmployeesPayload['options']
	employeesLoading?: boolean
}

const SiderFilter: FC<Props> = (props) => {
	const { collapsed, handleSubmit, parentPath, eventsViewType, loadingData, employeesOptions, employeesLoading } = props

	return (
		<Sider className='nc-sider-filter' width={230} collapsedWidth={0} collapsed={collapsed} trigger={null} collapsible>
			<CalendarFilter
				onSubmit={handleSubmit}
				parentPath={parentPath}
				eventsViewType={eventsViewType}
				loadingData={loadingData}
				employeesOptions={employeesOptions}
				employeesLoading={employeesLoading}
			/>
		</Sider>
	)
}

export default React.memo(SiderFilter)
