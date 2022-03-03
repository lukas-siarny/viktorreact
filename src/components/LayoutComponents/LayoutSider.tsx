import React from 'react'
import { Layout, Menu, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { ReactComponent as ThumbnailIcon } from '../../assets/icons/thumbail-icon.svg'

// utils
import { history } from '../../utils/history'
import { PAGE } from '../../utils/enums'

// redux
import { logOutUser } from '../../reducers/users/userActions'

const { Sider } = Layout

type Props = {
	page?: PAGE
}

const LayoutSider = (props: Props) => {
	const { page } = props
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Sider collapsible className='bg-white shadow-md '>
			<div className='sticky top-0'>
				<Link to={t('paths:index') as string}>dddfs</Link>

				<Menu mode='vertical' selectedKeys={[page as string]} className='sticky top-0'>
					<Menu.Divider />
					<Menu.Item key={PAGE.OVERVIEW} onClick={() => history.push(t('paths:prehlad'))} icon={<ThumbnailIcon />}>
						{t('loc:Prehľad')}
					</Menu.Item>
					<Menu.Item key={PAGE.SERVICES} onClick={() => history.push(t('paths:sluzby'))} icon={<ThumbnailIcon />}>
						{t('loc:Služby')}
					</Menu.Item>
					<Menu.Item key={PAGE.SALON} onClick={() => history.push(t('paths:salon'))} icon={<ThumbnailIcon />}>
						{t('loc:Salón')}
					</Menu.Item>
				</Menu>
			</div>
		</Sider>
	)
}
export default LayoutSider
