import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Sider from 'antd/lib/layout/Sider'

type Props = {
	collapsed: boolean
}

const SiderFilter: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { collapsed } = props

	return (
		<Sider className='nc-sider-filter' width={200} collapsedWidth={0} collapsed={collapsed} trigger={null} collapsible>
			{'left sider'}
		</Sider>
	)
}

export default SiderFilter
