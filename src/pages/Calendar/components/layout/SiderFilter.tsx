import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// types
import { ICalendarFilter } from '../../../../types/interfaces'

// components
import CalendarFilter from '../forms/CalendarFilter'

type Props = {
	collapsed: boolean
	parentPath: string
	handleSubmit: (values: ICalendarFilter) => void
}

const SiderFilter: FC<Props> = (props) => {
	const { collapsed, handleSubmit, parentPath } = props

	return (
		<Sider className='nc-sider-filter' width={230} collapsedWidth={0} collapsed={collapsed} trigger={null} collapsible>
			<CalendarFilter onSubmit={handleSubmit} parentPath={parentPath} />
		</Sider>
	)
}

export default SiderFilter
