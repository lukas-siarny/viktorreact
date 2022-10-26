import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// types
import { ICalendarFilter } from '../../../../types/interfaces'

// components
import CalendarFilter from '../forms/CalendarFilter'

type Props = {
	collapsed: boolean
	handleSubmit: (values: ICalendarFilter) => void
}

const SiderFilter: FC<Props> = (props) => {
	const { collapsed, handleSubmit } = props

	return (
		<Sider className='nc-sider-filter' width={230} collapsedWidth={0} collapsed={collapsed} trigger={null} collapsible>
			<CalendarFilter onSubmit={handleSubmit} />
		</Sider>
	)
}

export default SiderFilter
