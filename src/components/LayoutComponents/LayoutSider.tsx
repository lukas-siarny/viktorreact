import React, { useCallback, useRef, useEffect, useState } from 'react'
import { Layout, Menu, Dropdown, Row, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { sortBy } from 'lodash'

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
import { ReactComponent as ReservationsIcon } from '../../assets/icons/reservations.svg'
import { ReactComponent as ReviewsIcon } from '../../assets/icons/reviews-icon.svg'
import { ReactComponent as SmsUnitPricesIcon } from '../../assets/icons/sms-unit-prices.svg'

// utils
import { CYPRESS_CLASS_NAMES, PAGE, PERMISSION } from '../../utils/enums'
import { checkPermissions } from '../../utils/Permissions'

// redux
import { logOutUser } from '../../reducers/users/userActions'
import { RootState } from '../../reducers'
import { getSupportContact } from '../../reducers/supportContacts/supportContactsActions'

// components
import { getLanguagePickerAsSubmenuItem } from '../LanguagePicker'
import AvatarComponents from '../AvatarComponents'

// types
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

const MENU_ITEMS_ORDER = [
	PAGE.HOME, // first item for Notino and Salon view
	'divider-1',
	// Notino view
	PAGE.USERS,
	PAGE.CATEGORIES,
	PAGE.CATEGORY_PARAMETERS,
	PAGE.COSMETICS,
	PAGE.LANGUAGES,
	PAGE.SUPPORT_CONTACTS,
	PAGE.SPECIALIST_CONTACTS,
	PAGE.REVIEWS,
	PAGE.SMS_CREDITS,
	PAGE.NOTINO_RESERVATIONS,
	PAGE.SALONS, // last item for Notino view and second item for Salon view (after homepage)
	// Salon view
	PAGE.BILLING_INFO,
	PAGE.INDUSTRIES_AND_SERVICES,
	PAGE.SERVICES_SETTINGS,
	PAGE.EMPLOYEES,
	PAGE.SALON_SETTINGS,
	PAGE.SMS_CREDIT,
	'divider-2',
	PAGE.CUSTOMERS,
	PAGE.RESERVATIONS,
	PAGE.CALENDAR
]

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true, salonID, parentPath } = props
	const collapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const currentUser = useSelector((state: RootState) => state.user.authUser.data)
	const authUserPermissions = currentUser?.uniqPermissions
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const pendingReservationsCount = useSelector((state: RootState) => state.calendar.pendingReservationsCount.count)
	const count = pendingReservationsCount > 0 ? `(${pendingReservationsCount})` : ''

	const { t } = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const hasPermissions = useCallback(
		(allowed: PERMISSION[] = [], except: PERMISSION[] = []) => {
			const rolePermissions = authUserPermissions || []
			const salonPermission = selectedSalon?.uniqPermissions || []
			return checkPermissions([...rolePermissions, ...salonPermission], allowed, except)
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
				onClick: () => navigate(t('paths:index')),
				icon: <HomeIcon />,
				id: PAGE.HOME
			})

			if (!salonID) {
				// ADMIN VIEW
				if (hasPermissions([PERMISSION.USER_BROWSING])) {
					mainGroupItems.push({
						key: PAGE.USERS,
						label: t('loc:Používatelia'),
						onClick: () => navigate(t('paths:users')),
						icon: <UsersIcon />,
						id: PAGE.USERS
					})
				}
				if (hasPermissions([PERMISSION.ENUM_EDIT])) {
					mainGroupItems.push(
						{
							key: PAGE.CATEGORIES,
							label: t('loc:Kategórie'),
							onClick: () => navigate(t('paths:categories')),
							icon: <CategoryIcon />,
							id: PAGE.CATEGORIES
						},
						{
							key: PAGE.CATEGORY_PARAMETERS,
							label: t('loc:Parametre'),
							onClick: () => navigate(t('paths:category-parameters')),
							icon: <ParametersIcon />,
							id: PAGE.CATEGORY_PARAMETERS
						},
						{
							key: PAGE.COSMETICS,
							label: t('loc:Kozmetika'),
							onClick: () => navigate(t('paths:cosmetics')),
							icon: <CosmeticIcon />,
							id: PAGE.COSMETICS
						},
						{
							key: PAGE.LANGUAGES,
							label: t('loc:Jazyky'),
							onClick: () => navigate(t('paths:languages-in-salons')),
							icon: <LanguagesIcon />,
							id: PAGE.LANGUAGES
						},
						{
							key: PAGE.SUPPORT_CONTACTS,
							label: t('loc:Podpora'),
							onClick: () => navigate(t('paths:support-contacts')),
							icon: <HelpIcon />,
							id: PAGE.SUPPORT_CONTACTS
						},
						{
							key: PAGE.SPECIALIST_CONTACTS,
							label: t('loc:Špecialisti'),
							onClick: () => navigate(t('paths:specialist-contacts')),
							icon: <SpecialistIcon />,
							id: PAGE.SPECIALIST_CONTACTS
						},
						{
							key: PAGE.REVIEWS,
							label: t('loc:Recenzie'),
							onClick: () => navigate(t('paths:reviews')),
							icon: <ReviewsIcon />,
							id: PAGE.REVIEWS
						}
					)
				}
				if (hasPermissions([PERMISSION.SMS_UNIT_PRICE_EDIT, PERMISSION.NOTINO])) {
					mainGroupItems.push({
						key: PAGE.SMS_CREDITS,
						label: t('loc:SMS kredity'),
						onClick: () => navigate(t('paths:sms-credits')),
						icon: <SmsUnitPricesIcon />,
						id: PAGE.SMS_CREDITS
					})
				}

				if (hasPermissions([PERMISSION.NOTINO])) {
					mainGroupItems.push(
						{
							key: PAGE.NOTINO_RESERVATIONS,
							label: t('loc:Prehľad rezervacií'),
							onClick: () => navigate(t('paths:reservations')),
							icon: <ReservationsIcon />,
							id: PAGE.NOTINO_RESERVATIONS
						},
						{
							key: PAGE.SALONS,
							label: t('loc:Salóny'),
							onClick: () => navigate(t('paths:salons')),
							icon: <SalonIcon />,
							id: PAGE.SALONS
						}
					)
				}
			}

			if (salonID) {
				// SALON VIEW
				if (hasPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER])) {
					mainGroupItems.push(
						{
							key: PAGE.SALONS,
							label: t('loc:Detail salónu'),
							onClick: () => navigate(parentPath as string),
							icon: <SalonIcon />,
							id: PAGE.SALONS
						},
						{
							type: 'divider',
							key: 'divider-1',
							className: 'my-1 border-gray-200'
						},
						{
							key: PAGE.BILLING_INFO,
							label: t('loc:Fakturačné údaje'),
							onClick: () => navigate(getPath(t('paths:billing-info'))),
							icon: <InvoiceIcon />,
							id: PAGE.BILLING_INFO
						},
						{
							key: PAGE.SERVICES_SETTINGS,
							label: t('loc:Nastavenie služieb'),
							onClick: () => navigate(getPath(t('paths:services-settings'))),
							icon: <ServiceIcon className={'text-black'} />,
							id: PAGE.SERVICES_SETTINGS
						},
						{
							key: PAGE.EMPLOYEES,
							label: t('loc:Zamestnanci'),
							onClick: () => navigate(getPath(t('paths:employees'))),
							icon: <EmployeesIcon />,
							id: PAGE.EMPLOYEES
						},
						{
							key: PAGE.SALON_SETTINGS,
							label: t('loc:Nastavenia rezervácií'),
							onClick: () => navigate(getPath(t('paths:reservations-settings'))),
							icon: <SettingIcon />,
							id: PAGE.SALON_SETTINGS
						},
						{
							key: PAGE.INDUSTRIES_AND_SERVICES,
							label: t('loc:Odvetvia a služby'),
							onClick: () => navigate(getPath(t('paths:industries-and-services'))),
							icon: <IndustiresIcon />,
							id: PAGE.INDUSTRIES_AND_SERVICES
						},
						{
							type: 'divider',
							key: 'divider-2',
							className: 'my-1 border-gray-200'
						},
						{
							key: PAGE.CUSTOMERS,
							label: t('loc:Zákazníci'),
							onClick: () => navigate(getPath(t('paths:customers'))),
							icon: <CustomerIcon className={'text-black'} />,
							id: PAGE.CUSTOMERS
						},
						{
							key: PAGE.RESERVATIONS,
							label: t('loc:Prehľad rezervácií {{ reservationsCount }}', { reservationsCount: count }),
							onClick: () => navigate(getPath(t('paths:salon-reservations'))),
							icon: <ReservationsIcon />,
							id: PAGE.RESERVATIONS
						},
						{
							key: PAGE.CALENDAR,
							label: t('loc:Plánovací kalendár'),
							onClick: () => navigate(getPath(t('paths:calendar'))),
							icon: <CalendarIcon />,
							id: PAGE.CALENDAR
						}
					)
				}

				if (hasPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET])) {
					mainGroupItems.push({
						key: PAGE.SMS_CREDIT,
						label: t('loc:SMS kredit'),
						onClick: () => navigate(getPath(t('paths:sms-credit'))),
						icon: <SmsUnitPricesIcon />,
						id: PAGE.SMS_CREDIT
					})
				}
			}
		}

		// account menu items
		const myAccontMenuItems: MenuProps['items'] = [
			{
				key: 'myProfile',
				className: CYPRESS_CLASS_NAMES.MY_ACCOUNT_BUTTON,
				label: t('loc:Môj profil'),
				onClick: () => navigate(t('paths:my-account')),
				icon: <ProfileIcon />
			},
			{
				key: 'support',
				label: t('loc:Potrebujete pomôcť?'),
				onClick: () => {
					// reset support contact data to empty in case there are some stored in redux
					// otherwise language detection would not work correctly in t('paths:contact') page
					dispatch(getSupportContact())
					navigate(t('paths:contact'), { state: { from: location.pathname } })
				},
				icon: <HelpIcon />
			},
			getLanguagePickerAsSubmenuItem(dispatch),
			{
				key: 'logOut',
				className: CYPRESS_CLASS_NAMES.LOGOUT_BUTTON,
				label: t('loc:Odhlásiť'),
				onClick: () => dispatch(logOutUser()),
				icon: <LogOutIcon />
			},
			{
				type: 'divider',
				key: 'divider1',
				className: 'my-1 border-gray-200'
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
						children: sortBy(mainGroupItems, (item) => MENU_ITEMS_ORDER.indexOf(item.key))
					},
					{
						key: 'user-account',
						className: 'noti-account-menu-item',
						label: (
							<Dropdown
								menu={{
									className: 'noti-sider-menu',
									getPopupContainer: () => document.querySelector('#noti-sider-wrapper') as HTMLElement,
									items: myAccontMenuItems
								}}
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
								onOpenChange={setIsDropdownOpen}
							>
								<div role='button' className='cursor-pointer' tabIndex={-1} onClick={(e) => e.preventDefault()} onKeyPress={(e) => e.preventDefault()}>
									<Row className='flex items-center' justify='space-between'>
										<Row className={CYPRESS_CLASS_NAMES.MY_ACCOUNT}>
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
			trigger={<ChevronRightIcon style={{ transform: !collapsed ? 'rotate(180deg)' : undefined, width: 12, height: 12, color: '#000' }} />}
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
				{collapsed ? (
					<Link className='flex justify-center pt-4 pb-6' to={`${t('paths:index')}`} style={{ height: LOGO_HEIGHT }}>
						<LogoCollapsedIcon className='h-8' />
					</Link>
				) : (
					<Link className='flex justify-center items-center' to={`${t('paths:index')}`} style={{ height: LOGO_HEIGHT }}>
						<LogoIcon style={{ padding: 10 }} />
					</Link>
				)}
				<Menu
					mode='inline'
					className='px-2 flex flex-col flex-grow noti-sider-menu'
					style={{ height: `calc(100% - ${LOGO_HEIGHT}px` }}
					inlineIndent={8}
					items={getMenuItems()}
					selectedKeys={[page as string]}
					getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement}
				/>
			</div>
		</Sider>
	)
}
export default LayoutSider
