import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// types
import { ICalendarFilter } from '../../../../types/interfaces'

// components
import CalendarFilter from '../forms/CalendarFilter'

// enums
import { CALENDAR_EVENT_TYPE_FILTER } from '../../../../utils/enums'

type Props = {
	collapsed: boolean
	parentPath: string
	handleSubmit: (values: ICalendarFilter) => void
	eventType: CALENDAR_EVENT_TYPE_FILTER
}

const SiderFilter: FC<Props> = (props) => {
	const { collapsed, handleSubmit, parentPath, eventType } = props

	return (
		<Sider className='nc-sider-filter' width={230} collapsedWidth={0} collapsed={collapsed} trigger={null} collapsible>
			<CalendarFilter onSubmit={handleSubmit} parentPath={parentPath} eventType={eventType} />
		</Sider>
	)
}

export default SiderFilter
