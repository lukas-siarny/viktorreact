import React, { useCallback, useRef, useEffect, useState } from 'react'
import { Layout, Menu, Dropdown, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import cx from 'classnames'

// assets
import { ReactComponent as LogoIcon } from '../../assets/images/logo-simple.svg'
import { ReactComponent as LogoCollapsedIcon } from '../../assets/icons/logoCollapsed.svg'
import { ReactComponent as HomeIcon } from '../../assets/icons/home-24-icon.svg'
import { ReactComponent as CategoryIcon } from '../../assets/icons/categories-24-icon.svg'
import { ReactComponent as SalonIcon } from '../../assets/icons/salon-24-icon.svg'
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'
import { ReactComponent as UsersIcon } from '../../assets/icons/users-24-icon.svg'
import { ReactComponent as CustomerIcon } from '../../assets/icons/customer-24-icon.svg'
import { ReactComponent as SpecialistIcon } from '../../assets/icons/specialist-24-icon.svg'
import { ReactComponent as ProfileIcon } from '../../assets/icons/profile-icon.svg'
import { ReactComponent as LogOutIcon } from '../../assets/icons/logout-icon.svg'
import { ReactComponent as ChevronIcon } from '../../assets/icons/up-down.svg'
import { ReactComponent as VersionIcon } from '../../assets/icons/version-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../assets/icons/employees.svg'
import { ReactComponent as HelpIcon } from '../../assets/icons/help-icon.svg'
import { ReactComponent as CosmeticIcon } from '../../assets/icons/cosmetic-icon-24.svg'
import { ReactComponent as LanguagesIcon } from '../../assets/icons/languages-24.svg'
import { ReactComponent as ParametersIcon } from '../../assets/icons/parameters-24-icon.svg'
import { ReactComponent as IndustiresIcon } from '../../assets/icons/industries.svg'
import { ReactComponent as InvoiceIcon } from '../../assets/icons/invoice-24.svg'
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-right.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar-24.svg'
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'

// utils
import { history } from '../../utils/history'
import { PAGE, PERMISSION, ADMIN_PERMISSIONS } from '../../utils/enums'
import { permitted } from '../../utils/Permissions'

// redux
import { logOutUser } from '../../reducers/users/userActions'
import { RootState } from '../../reducers'
import { getSupportContact } from '../../reducers/supportContacts/supportContactsActions'

// components
import { getLanguagePickerAsSubmenuItem } from '../LanguagePicker'
import AvatarComponents from '../AvatarComponents'

// types
import { _Permissions } from '../../types/interfaces'
import { setIsSiderCollapsed } from '../../reducers/helperSettings/helperSettingsActions'

const { Sider } = Layout

export type LayoutSiderProps = {
	page?: PAGE
	showNavigation?: boolean
	salonID?: string
	parentPath?: string
}

const SIDER_TRIGGER_HEIGHT = 48
const LOGO_HEIGHT = 72

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true, salonID, parentPath } = props

	const collapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const currentUser = useSelector((state: RootState) => state.user.authUser.data)
	const authUserPermissions = currentUser?.uniqPermissions
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

	const { t } = useTranslation()
	const dispatch = useDispatch()
	const location = useLocation()

	const hasPermissions = useCallback(
		(allowed: _Permissions = [], except: _Permissions = []) => {
			return permitted(authUserPermissions || [], selectedSalon?.uniqPermissions, allowed, except)
		},
		[authUserPermissions, selectedSalon?.uniqPermissions]
	)

	const getPath = useCallback((pathSuffix: string) => `${parentPath}${pathSuffix}`, [parentPath])

	const getMenuItems = () => {
		// main group menu items
		const mainGroupItems: any[] = []

		if (showNavigation) {
			// ADMIN & SALON VIEW
			mainGroupItems.push({
				key: PAGE.HOME,
				label: t('loc:Prehľad'),
				onClick: () => history.push(t('paths:index')),
				icon: <HomeIcon />
			})

			if (!salonID) {
				// ADMIN VIEW
				if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.USER_BROWSING])) {
					mainGroupItems.push({
						key: PAGE.USERS,
						label: t('loc:Používatelia'),
						onClick: () => history.push(t('paths:users')),
						icon: <UsersIcon />
					})
				}
				if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.ENUM_EDIT])) {
					mainGroupItems.push(
						{
							key: PAGE.CATEGORIES,
							label: t('loc:Kategórie'),
							onClick: () => history.push(t('paths:categories')),
							icon: <CategoryIcon />
						},
						{
							key: PAGE.CATEGORY_PARAMETERS,
							label: t('loc:Parametre'),
							onClick: () => history.push(t('paths:category-parameters')),
							icon: <ParametersIcon />
						},
						{
							key: PAGE.COSMETICS,
							label: t('loc:Kozmetika'),
							onClick: () => history.push(t('paths:cosmetics')),
							icon: <CosmeticIcon />
						},
						{
							key: PAGE.LANGUAGES,
							label: t('loc:Jazyky'),
							onClick: () => history.push(t('paths:languages-in-salons')),
							icon: <LanguagesIcon />
						},
						{
							key: PAGE.SUPPORT_CONTACTS,
							label: t('loc:Podpora'),
							onClick: () => history.push(t('paths:support-contacts')),
							icon: <HelpIcon />
						},
						{
							key: PAGE.SPECIALIST_CONTACTS,
							label: t('loc:Špecialisti'),
							onClick: () => history.push(t('paths:specialist-contacts')),
							icon: <SpecialistIcon />
						}
					)
				}
				if (hasPermissions([...ADMIN_PERMISSIONS])) {
					mainGroupItems.push({
						key: PAGE.SALONS,
						label: t('loc:Salóny'),
						onClick: () => history.push(t('paths:salons')),
						icon: <SalonIcon />
					})
				}
			}

			if (salonID) {
				// SALON VIEW
				if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.PARTNER])) {
					mainGroupItems.push(
						{
							key: PAGE.SALONS,
							label: t('loc:Detail salónu'),
							onClick: () => history.push(parentPath),
							icon: <SalonIcon />
						},
						{
							key: PAGE.BILLING_INFO,
							label: t('loc:Fakturačné údaje'),
							onClick: () => history.push(getPath(t('paths:billing-info'))),
							icon: <InvoiceIcon />
						},
						{
							key: PAGE.INDUSTRIES_AND_SERVICES,
							label: t('loc:Odvetvia a služby'),
							onClick: () => history.push(getPath(t('paths:industries-and-services'))),
							icon: <IndustiresIcon />
						},
						{
							key: PAGE.SERVICES_SETTINGS,
							label: t('loc:Nastavenie služieb'),
							onClick: () => history.push(getPath(t('paths:services-settings'))),
							icon: <ServiceIcon />
						},
						{
							key: PAGE.CUSTOMERS,
							label: t('loc:Zákazníci'),
							onClick: () => history.push(getPath(t('paths:customers'))),
							icon: <CustomerIcon />
						},
						{
							key: PAGE.EMPLOYEES,
							label: t('loc:Zamestnanci'),
							onClick: () => history.push(getPath(t('paths:employees'))),
							icon: <EmployeesIcon />
						},
						{
							key: PAGE.CALENDAR,
							label: t('loc:Kalendár'),
							onClick: () => history.push(getPath(t('paths:calendar'))),
							icon: <CalendarIcon />
						},
						{
							key: PAGE.SALON_SETTINGS,
							label: t('loc:Nastavenia salónu'),
							onClick: () => history.push(getPath(t('paths:salon-settings'))),
							icon: <SettingIcon />
						}
					)
				}
			}
		}

		// account menu items
		const myAccontMenuItems = [
			{
				key: 'myProfile',
				label: t('loc:Môj profil'),
				onClick: () => history.push(t('paths:my-account')),
				icon: <ProfileIcon />
			},
			{
				key: 'support',
				label: t('loc:Potrebujete pomôcť?'),
				onClick: () => {
					// reset support contact data to empty in case there are some stored in redux
					// otherwise language detection would not work correctly in t('paths:contact') page
					dispatch(getSupportContact())
					history.push({ pathname: t('paths:contact'), state: { from: location.pathname } })
				},
				icon: <HelpIcon />
			},
			getLanguagePickerAsSubmenuItem(dispatch),
			{
				key: 'logOut',
				id: 'logOut',
				label: t('loc:Odhlásiť'),
				onClick: () => dispatch(logOutUser()),
				icon: <LogOutIcon />
			},
			{
				type: 'divider',
				key: 'divider1',
				className: 'my-1'
			},
			{
				key: 'version',
				className: 'cursor-text',
				icon: <VersionIcon />,
				disabled: true,
				label: <span className='s-medium'>v{process.env.REACT_APP_VERSION}</span>
			}
		]

		const menuItems: any[] = [
			{
				key: 'main-group',
				type: 'group',
				className: 'noti-sider-main-group h-full flex flex-col justify-between',
				children: [
					{
						key: 'group-menu-items',
						type: 'group',
						className: 'overflow-y-auto',
						style: { height: `calc(100% - ${SIDER_TRIGGER_HEIGHT}px` },
						children: mainGroupItems
					},
					{
						key: 'user-account',
						className: 'noti-account-menu-item',
						label: (
							<Dropdown
								overlay={
									<Menu
										className='noti-sider-menu'
										getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement}
										items={myAccontMenuItems}
									/>
								}
								placement='topLeft'
								trigger={['click']}
								overlayStyle={{ minWidth: 214 }}
								align={
									collapsed
										? {
												offset: [54, 40]
										  }
										: undefined
								}
								getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement}
								onVisibleChange={setIsDropdownOpen}
							>
								<div role='button' className='cursor-pointer' tabIndex={-1} onClick={(e) => e.preventDefault()} onKeyPress={(e) => e.preventDefault()}>
									<Row className='flex items-center' justify='space-between'>
										<Row className='noti-my-account'>
											<div className='truncate item-label flex items-center'>{t('loc:Moje konto')}</div>
										</Row>

										<ChevronIcon className='items-center' />
									</Row>
								</div>
							</Dropdown>
						),
						icon: (
							<AvatarComponents
								src={currentUser?.image?.original}
								text={`${currentUser?.firstName?.[0]}${currentUser?.lastName?.[0]}`}
								className={'shrink-0 grow-0'}
							/>
						)
					}
				]
			}
		]

		return menuItems
	}

	const wasSiderRendered = useRef(false)

	useEffect(() => {
		wasSiderRendered.current = true
	}, [])

	return (
		<Sider
			className={cx('bg-white shadow-md z-50 main-layout-sider', { 'account-dropdown-opened': isDropdownOpen })}
			breakpoint='md'
			collapsedWidth={56}
			width={230}
			trigger={<ChevronRightIcon style={{ transform: !collapsed ? 'rotate(180deg)' : undefined, width: 12, height: 12 }} />}
			collapsible
			collapsed={collapsed}
			onCollapse={(isCollapsed, type) => {
				if (type === 'clickTrigger') {
					dispatch(setIsSiderCollapsed(isCollapsed))
				} else if (type === 'responsive' && wasSiderRendered.current) {
					dispatch(setIsSiderCollapsed(isCollapsed))
				}
			}}
		>
			<div id={'noti-sider-wrapper'} className='flex flex-col h-full'>
				<Link className='flex justify-center pt-4 pb-6' to={`${t('paths:index')}`} style={{ height: LOGO_HEIGHT }}>
					{collapsed ? <LogoCollapsedIcon className='h-8' /> : <LogoIcon className='h-8' />}
				</Link>
				<Menu
					mode='inline'
					className='px-2 flex flex-col flex-grow noti-sider-menu'
					style={{ height: `calc(100% - ${LOGO_HEIGHT}px` }}
					inlineIndent={8}
					selectedKeys={[page as string]}
					items={getMenuItems()}
					getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement}
				/>
			</div>
		</Sider>
	)
}
export default LayoutSider
