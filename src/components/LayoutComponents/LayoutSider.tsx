import React, { useCallback, useMemo } from 'react'
import { Layout, Menu, Dropdown, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

// assets
import { ReactComponent as LogoIcon } from '../../assets/images/logo-simple.svg'
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

const { Sider } = Layout

export type LayoutSiderProps = {
	page?: PAGE
	showNavigation?: boolean
	salonID?: string
	parentPath?: string
}

const LayoutSider = (props: LayoutSiderProps) => {
	const { page, showNavigation = true, salonID, parentPath } = props

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

	const myAccontMenuItems: ItemType[] = useMemo(() => {
		return [
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
				key: 'version',
				className: 'cursor-text',
				icon: <VersionIcon />,
				disabled: true,
				label: <span className='s-medium'>v{process.env.REACT_APP_VERSION}</span>
			}
		]
	}, [t, dispatch, location.pathname])

	const MY_ACCOUNT_MENU = <Menu className='noti-sider-menu' getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement} items={myAccontMenuItems} />

	const getMenuItems = useCallback(() => {
		const getPath = (pathSuffix: string) => `${parentPath}${pathSuffix}`

		const menuItems: ItemType[] = [
			{
				key: PAGE.HOME,
				label: t('loc:Prehľad'),
				onClick: () => history.push(t('paths:index')),
				icon: <HomeIcon />
			}
		]

		if (!salonID) {
			// ADMIN VIEW
			if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.USER_BROWSING])) {
				menuItems.push({
					key: PAGE.USERS,
					label: t('loc:Používatelia'),
					onClick: () => history.push(t('paths:users')),
					icon: <UsersIcon />
				})
			}
			if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.ENUM_EDIT])) {
				menuItems.push(
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
				menuItems.push({
					key: PAGE.SALONS,
					label: t('loc:Salóny'),
					onClick: () => history.push(t('paths:salons')),
					icon: <SalonIcon />
				})
			}
		} else if (salonID) {
			// SALON VIEW
			if (hasPermissions([...ADMIN_PERMISSIONS, PERMISSION.PARTNER])) {
				menuItems.push(
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
					}
				)
			}
		}
		return menuItems
	}, [hasPermissions, parentPath, salonID, t])

	return (
		<Sider className='bg-white shadow-md' breakpoint='md' collapsedWidth='0' width={230}>
			<div className='sticky top-0 flex flex-col h-screen z-50' id={'noti-sider-wrapper'}>
				<Link className='flex justify-center pt-4 pb-6' to={`${t('paths:index')}`}>
					<LogoIcon className='h-8' />
				</Link>

				<div className='px-2 flex flex-col flex-grow overflow-y-auto'>
					{showNavigation && <Menu mode='inline' inlineIndent={8} selectedKeys={[page as string]} className='sticky top-0 noti-sider-menu' items={getMenuItems()} />}
				</div>

				<div className='p-2 pb-4'>
					<Dropdown
						overlay={MY_ACCOUNT_MENU}
						placement='topLeft'
						trigger={['click']}
						getPopupContainer={() => document.querySelector('#noti-sider-wrapper') as HTMLElement}
					>
						<div
							role='button'
							className='cursor-pointer hover:bg-notino-grayLighter py-2'
							tabIndex={-1}
							onClick={(e) => e.preventDefault()}
							onKeyPress={(e) => e.preventDefault()}
						>
							<Row className='ml-2 flex items-center' justify='space-between'>
								<Row className='noti-my-account'>
									<AvatarComponents className='mr-2-5' src={currentUser?.image?.original} text={`${currentUser?.firstName?.[0]}${currentUser?.lastName?.[0]}`} />
									<div className='truncate item-label flex items-center'>{t('loc:Moje konto')}</div>
								</Row>

								<ChevronIcon className='items-center' />
							</Row>
						</div>
					</Dropdown>
				</div>
			</div>
		</Sider>
	)
}
export default LayoutSider
