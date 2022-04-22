import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ReactComponent as ThumbnailIcon } from '../../assets/icons/thumbail-icon.svg'
import { ReactComponent as LogoIcon } from '../../assets/images/logo-simple.svg'

// utils
import { history } from '../../utils/history'
import { PAGE, PERMISSION } from '../../utils/enums'

// redux
import { logOutUser } from '../../reducers/users/userActions'
import { checkPermissions } from '../../utils/Permissions'
import { RootState } from '../../reducers'

const { Sider } = Layout

export type LayoutSiderProps = {
	page?: PAGE
	showNavigation?: boolean
}

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true } = props
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Sider className='bg-white shadow-md' breakpoint='md' collapsedWidth='0'>
			<div className='sticky top-0 flex flex-col h-screen'>
				<Link className='flex justify-center pt-4 pb-6' to={t('paths:index')}>
					<LogoIcon className='h-8' />
				</Link>

				<div className='px-2 flex flex-col flex-grow overflow-y-auto'>
					{showNavigation && (
						<Menu mode='inline' selectedKeys={[page as string]} className='sticky top-0 noti-sider-menu'>
							<Menu.Item key={PAGE.HOME} onClick={() => history.push(t('paths:home'))} icon={<ThumbnailIcon />}>
								{t('loc:Home')}
							</Menu.Item>
							{checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_BROWSING]) ? (
								<Menu.Item key={PAGE.USERS} onClick={() => history.push(t('paths:users'))} icon={<ThumbnailIcon />}>
									{t('loc:Používatelia')}
								</Menu.Item>
							) : undefined}
							{checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]) ? (
								<Menu.Item key={PAGE.CATEGORIES} onClick={() => history.push(t('paths:categories'))} icon={<ThumbnailIcon />}>
									{t('loc:Kategórie')}
								</Menu.Item>
							) : undefined}

							{checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]) ? (
								<Menu.Item key={PAGE.SALONS} onClick={() => history.push(t('paths:salons'))} icon={<ThumbnailIcon />}>
									{t('loc:Salóny')}
								</Menu.Item>
							) : undefined}
							{checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]) ? (
								<Menu.Item key={PAGE.SERVICES} onClick={() => history.push(t('paths:services'))} icon={<ThumbnailIcon />}>
									{t('loc:Služby')}
								</Menu.Item>
							) : undefined}
							{checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_BROWSING, PERMISSION.PARTNER]) ? (
								<Menu.Item key={PAGE.CUSTOMERS} onClick={() => history.push(t('paths:customers'))} icon={<ThumbnailIcon />}>
									{t('loc:Zákazníci')}
								</Menu.Item>
							) : undefined}
						</Menu>
					)}
				</div>

				<div className='p-2 pb-4'>
					<Link className='flex justify-start pt-2 pb-2' to={t('paths:my-account')}>
						{t('loc: Môj účet')}
					</Link>
					<Button block onClick={() => dispatch(logOutUser())}>
						{t('loc:Odhlásiť')}
					</Button>
				</div>
			</div>
		</Sider>
	)
}
export default LayoutSider