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
// import { logOutUser } from '../../reducers/users/userActions'

const { Sider } = Layout

type Props = {
	page?: PAGE
}

const LayoutSider = (props: Props) => {
	const { page } = props
	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Sider className='bg-white shadow-md '>
			<div className='sticky top-0 flex flex-col h-screen'>
				<Link to={t('paths:index') as string}>logo</Link>
				<div className='px-2 flex flex-col flex-grow overflow-y-auto'>
					<Menu mode='inline' selectedKeys={[page as string]} className='sticky top-0 noti-sider-menu'>
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
				<div className='p-2'>user</div>
			</div>
		</Sider>
	)
}
export default LayoutSider
