import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'

// assets
import { ReactComponent as LogoIcon } from '../../assets/images/logo-simple.svg'
import { ReactComponent as HomeIcon } from '../../assets/icons/home-24-icon.svg'
import { ReactComponent as CategoryIcon } from '../../assets/icons/categories-24-icon.svg'
import { ReactComponent as SalonIcon } from '../../assets/icons/salon-24-icon.svg'
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'
import { ReactComponent as UsersIcon } from '../../assets/icons/users-24-icon.svg'
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone-2-icon.svg'

// utils
import { history } from '../../utils/history'
import { PAGE, PERMISSION } from '../../utils/enums'
import Permissions from '../../utils/Permissions'

// redux
import { logOutUser } from '../../reducers/users/userActions'

// components
import LanguagePicker from '../LanguagePicker'

const { Sider } = Layout

const MENU_ITEM_LEFT_PADDING = '24px'

export type LayoutSiderProps = {
	page?: PAGE
	showNavigation?: boolean
}

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true } = props
	// const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const { t } = useTranslation()
	const dispatch = useDispatch()

	return (
		<Sider className='bg-white shadow-md' breakpoint='md' collapsedWidth='0'>
			<div className='sticky top-0 flex flex-col h-screen'>
				<Link className='flex justify-center pt-4 pb-6' to={`${t('paths:index')}`}>
					<LogoIcon className='h-8' />
				</Link>

				<div className='px-2 flex flex-col flex-grow overflow-y-auto'>
					{showNavigation && (
						<Menu mode='inline' selectedKeys={[page as string]} className='sticky top-0 noti-sider-menu'>
							<Menu.Item key={PAGE.HOME} onClick={() => history.push(t('paths:index'))} icon={<HomeIcon />}>
								{t('loc:Home')}
							</Menu.Item>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_BROWSING]}>
								<Menu.Item
									key={PAGE.USERS}
									onClick={() => history.push(t('paths:users'))}
									icon={<UsersIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.USERS })}
									style={{ paddingLeft: MENU_ITEM_LEFT_PADDING }}
								>
									{t('loc:Používatelia')}
								</Menu.Item>
							</Permissions>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]}>
								<Menu.Item
									key={PAGE.CATEGORIES}
									onClick={() => history.push(t('paths:categories'))}
									icon={<CategoryIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.CATEGORIES })}
									style={{ paddingLeft: MENU_ITEM_LEFT_PADDING }}
								>
									{t('loc:Kategórie')}
								</Menu.Item>
							</Permissions>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]}>
								<Menu.Item
									key={PAGE.SALONS}
									onClick={() => history.push(t('paths:salons'))}
									icon={<SalonIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.SALONS })}
									style={{ paddingLeft: MENU_ITEM_LEFT_PADDING }}
								>
									{t('loc:Salóny')}
								</Menu.Item>
								<Menu.Item
									key={PAGE.SERVICES}
									onClick={() => history.push(t('paths:services'))}
									icon={<ServiceIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.SERVICES })}
									style={{ paddingLeft: MENU_ITEM_LEFT_PADDING }}
								>
									{t('loc:Služby')}
								</Menu.Item>
							</Permissions>

							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_BROWSING, PERMISSION.PARTNER]}>
								<Menu.Item
									key={PAGE.CUSTOMERS}
									onClick={() => history.push(t('paths:customers'))}
									icon={<PhoneIcon />} // fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.CUSTOMERS })}
									style={{ paddingLeft: MENU_ITEM_LEFT_PADDING }}
								>
									{t('loc:Zákazníci')}
								</Menu.Item>
							</Permissions>
						</Menu>
					)}
				</div>

				<div className='p-2 pb-4'>
					<LanguagePicker />
					<Link className='flex justify-start pt-2 pb-2' to={`${t('paths:my-account')}`}>
						{t('loc: Môj účet')}
					</Link>
					<p className='s-medium'>v{process.env.REACT_APP_VERSION}</p>
					<Button block onClick={() => dispatch(logOutUser())}>
						{t('loc:Odhlásiť')}
					</Button>
				</div>
			</div>
		</Sider>
	)
}
export default LayoutSider
