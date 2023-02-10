import React, { FC } from 'react'
import { Tabs, TabsProps } from 'antd'

type Props = TabsProps

const TabsComponent: FC<Props> = (props) => {
	const { className, ...restProps } = props

	return <Tabs {...restProps} className={`noti-tabs ${className ?? ''}`} />
}

export default TabsComponent
