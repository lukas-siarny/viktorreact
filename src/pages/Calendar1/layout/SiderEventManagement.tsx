import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Sider from 'antd/lib/layout/Sider'

const SiderEventManagement = () => {
	const [t] = useTranslation()

	return <Sider className='nc-sider-event-management'>{'right sider'}</Sider>
}

export default SiderEventManagement
