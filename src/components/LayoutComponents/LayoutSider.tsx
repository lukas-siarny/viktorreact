import React from 'react'
import { Layout, Menu, Dropdown, Row } from 'antd'
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
import { ReactComponent as CustomerIcon } from '../../assets/icons/customer-24-icon.svg'
import { ReactComponent as ProfileIcon } from '../../assets/icons/profile-icon.svg'
import { ReactComponent as LogOutIcon } from '../../assets/icons/logout-icon.svg'
import { ReactComponent as ChevronIcon } from '../../assets/icons/up-down.svg'
import { ReactComponent as VersionIcon } from '../../assets/icons/version-icon.svg'

// utils
import { history } from '../../utils/history'
import { PAGE, PERMISSION } from '../../utils/enums'
import Permissions from '../../utils/Permissions'

// redux
import { logOutUser } from '../../reducers/users/userActions'

// components
import LanguagePicker from '../LanguagePicker'

const { Sider } = Layout

export type LayoutSiderProps = {
	page?: PAGE
	showNavigation?: boolean
}

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true } = props

	const { t } = useTranslation()
	const dispatch = useDispatch()

	const MY_ACCOUNT_MENU = (
		<Menu className='noti-sider-menu'>
			<Menu.Item key='myProfile' onClick={() => history.push(t('paths:my-account'))} icon={<ProfileIcon />}>
				{t('loc:Môj profil')}
			</Menu.Item>
			<LanguagePicker asMenuItem />
			<Menu.Item key='logOut' onClick={() => dispatch(logOutUser())} icon={<LogOutIcon />}>
				{t('loc:Odhlásiť')}
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key='version' disabled icon={<VersionIcon />}>
				<span className='s-medium'>v{process.env.REACT_APP_VERSION}</span>
			</Menu.Item>
		</Menu>
	)

	return (
		<Sider className='bg-white shadow-md' breakpoint='md' collapsedWidth='0'>
			<div className='sticky top-0 flex flex-col h-screen'>
				<Link className='flex justify-center pt-4 pb-6' to={`${t('paths:index')}`}>
					<LogoIcon className='h-8' />
				</Link>

				<div className='px-2 flex flex-col flex-grow overflow-y-auto'>
					{showNavigation && (
						<Menu mode='inline' inlineIndent={8} selectedKeys={[page as string]} className='sticky top-0 noti-sider-menu'>
							<Menu.Item eventKey={PAGE.HOME} key={PAGE.HOME} onClick={() => history.push(t('paths:index'))} icon={<HomeIcon />}>
								{t('loc:Home')}
							</Menu.Item>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_BROWSING]}>
								<Menu.Item
									eventKey={PAGE.USERS}
									key={PAGE.USERS}
									onClick={() => history.push(t('paths:users'))}
									icon={<UsersIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.USERS })}
								>
									{t('loc:Používatelia')}
								</Menu.Item>
							</Permissions>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]}>
								<Menu.Item
									eventKey={PAGE.CATEGORIES}
									key={PAGE.CATEGORIES}
									onClick={() => history.push(t('paths:categories'))}
									icon={<CategoryIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.CATEGORIES })}
								>
									{t('loc:Kategórie')}
								</Menu.Item>
							</Permissions>
							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]}>
								<Menu.Item
									eventKey={PAGE.SALONS}
									key={PAGE.SALONS}
									onClick={() => history.push(t('paths:salons'))}
									icon={<SalonIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.SALONS })}
								>
									{t('loc:Salóny')}
								</Menu.Item>
								<Menu.Item
									eventKey={PAGE.SERVICES}
									key={PAGE.SERVICES}
									onClick={() => history.push(t('paths:services'))}
									icon={<ServiceIcon />}
									// fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.SERVICES })}
								>
									{t('loc:Služby')}
								</Menu.Item>
							</Permissions>

							<Permissions allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_BROWSING, PERMISSION.PARTNER]}>
								<Menu.Item
									eventKey={PAGE.CUSTOMERS}
									key={PAGE.CUSTOMERS}
									onClick={() => history.push(t('paths:customers'))}
									icon={<CustomerIcon />} // fix style issue due wrapped item into <Permission> component
									className={cx({ 'ant-menu-item-selected': page === PAGE.CUSTOMERS })}
								>
									{t('loc:Zákazníci')}
								</Menu.Item>
							</Permissions>
						</Menu>
					)}
				</div>

				<div className='p-2 pb-4'>
					<Dropdown overlay={MY_ACCOUNT_MENU} placement='topLeft' trigger={['click']}>
						<div
							role='button'
							className='cursor-pointer hover:bg-notino-grayLighter py-2'
							tabIndex={-1}
							onClick={(e) => e.preventDefault()}
							onKeyPress={(e) => e.preventDefault()}
						>
							<Row className='ml-2' justify='space-between'>
								<Row>
									<ProfileIcon className='mr-2-5' />
									{t('loc:Moje konto')}
								</Row>

								<ChevronIcon />
							</Row>
						</div>
					</Dropdown>
				</div>
			</div>
		</Sider>
	)
}
export default LayoutSider
