import React, { ReactNode, FC } from 'react'
import { Layout, Row, Button, Dropdown, Menu } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

// components
import { Header } from 'antd/lib/layout/layout'
import LayoutSider, { LayoutSiderProps } from '../components/LayoutComponents/LayoutSider'

// redux
import { RootState } from '../reducers'

// utils
import Permissions from '../utils/Permissions'
import { PERMISSION } from '../utils/enums'
import { history } from '../utils/history'

// assets
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon.svg'
import { ReactComponent as BackIcon } from '../assets/icons/rollback.svg'
import AvatarComponents from '../components/AvatarComponents'
import { ReactComponent as ChevronIcon } from '../assets/icons/chevron-down.svg'
import { ReactComponent as AddPurple } from '../assets/icons/add-icon-purple.svg'
import SalonDefaultAvatar from '../assets/icons/salon-default-avatar.png'

// hooks
import useBackUrl from '../hooks/useBackUrl'

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
	extra?: {
		contentClassName?: string | null
	}
}

const MainLayout: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { children, extra } = props
	const { contentClassName = 'p-4 px-10 main-background' } = extra || {}
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const salonID = selectedSalon?.id
	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data) || []
	const [backUrl] = useBackUrl(t('paths:salons'))

	const getSalonMenuItems = (): ItemType[] => {
		const salonMenuItems: ItemType[] = salonOptions.map((item) => ({
			key: item.key,
			label: (
				<>
					<AvatarComponents src={item.logo || SalonDefaultAvatar} fallBackSrc={SalonDefaultAvatar} size={24} className={'mr-2-5 header-avatar'} /> {item.label}
				</>
			),
			onClick: () => history.push(t('paths:salons/{{salonID}}', { salonID: item.value })),
			className: cx({ 'ant-menu-item-selected': selectedSalon?.id === item.value }, 'py-2-5 px-2 mb-2 font-medium min-w-0')
		}))

		return [
			{
				type: 'group',
				key: 'group-salons',
				children: salonMenuItems,
				// maxHeight - 100vh - 170px - je potrebné zaistiť aby na nejakom menšom responzívnom zobrazení nešlo menu mimo obrazovku
				// čiže odratá sa vyška headera, výška buttonu "Pridať salón" + nejake marginy, paddingy
				style: { height: salonOptions?.length > 8 ? 400 : 'auto', maxHeight: 'calc(100vh - 170px)', overflowY: 'auto' }
			},
			{
				type: 'group',
				key: 'group-add-salon',
				className: '',
				children: [
					{
						type: 'divider',
						key: 'divider1',
						className: 'm-0'
					},
					{
						key: 'add-salon',
						className: 'font-medium button-add',
						icon: <AddPurple />,
						onClick: () => history.push(t('paths:salons/create')),
						label: t('loc:Pridať salón')
					}
				]
			}
		]
	}

	const SALONS_MENU = <Menu className='shadow-md max-w-xs min-w-0 mt-5 noti-dropdown-header' items={getSalonMenuItems()} />

	const getSelectedSalonLabel = (hasPermision: boolean) => {
		const content = (
			<Row className={cx('m-2 flex items-center gap-2 min-w-0')} justify='space-between' wrap={false}>
				<Row wrap={false} className={'min-w-0 flex items-center gap-2-5'}>
					<AvatarComponents
						size={24}
						src={selectedSalon?.logo?.resizedImages.thumbnail || SalonDefaultAvatar}
						fallBackSrc={SalonDefaultAvatar}
						className={'header-avatar'}
					/>
					{selectedSalon?.name && <span className='truncate leading-4 min-w-0 inline-block'>{selectedSalon.name}</span>}
				</Row>

				{hasPermision && <ChevronIcon className='items-center icon-dropdown' />}
			</Row>
		)

		const labelClassname = 'bg-notino-grayLighter rounded-lg min-w-0 header-salon-label max-w-xs'

		if (hasPermision) {
			if (salonOptions.length === 0) {
				return (
					<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
						{t('loc:Pridať salón')}
					</Button>
				)
			}

			return (
				<Dropdown
					overlay={SALONS_MENU}
					placement='bottomRight'
					trigger={['click']}
					overlayStyle={{ minWidth: 226 }}
					getPopupContainer={() => document.querySelector('#noti-header') as HTMLElement}
				>
					<div role={'button'} className={cx(labelClassname, 'cursor-pointer')} tabIndex={-1} onClick={(e) => e.preventDefault()} onKeyPress={(e) => e.preventDefault()}>
						{content}
					</div>
				</Dropdown>
			)
		}

		return (
			<>
				<span className='hidden lg:inline-block pr-4 text-xs selected-salon-text'>{t('loc:zvolený salón')}:</span>
				<div className={cx(labelClassname)}>{content}</div>
			</>
		)
	}

	return (
		<Layout className='min-h-screen noti-main-layout' hasSider>
			<LayoutSider {...props} salonID={salonID} parentPath={t('paths:salons/{{salonID}}', { salonID })} />
			<Layout>
				<Permissions
					allowed={[PERMISSION.PARTNER]}
					render={(hasPermission) =>
						(hasPermission || !!salonID) && (
							<Header className='shadow-md bg-notino-white sticky top-0 px-4 flex items-center w-full z-40' id={'noti-header'}>
								<Row className={cx({ 'justify-end': hasPermission, 'justify-between': !hasPermission }, 'min-w-0 w-full')} wrap={false}>
									{!hasPermission && (
										<Button
											onClick={() => {
												history.push(backUrl)
											}}
											icon={<BackIcon className={'filter-invert max'} />}
											className={'noti-btn h-8 text-notino-white self-center bg-notino-pink mr-2'}
											type={'default'}
											size={'small'}
										>
											{t('loc:Vrátiť sa do administrácie')}
										</Button>
									)}
									<Row className='w-1/7 items-center min-w-0' wrap={false}>
										{getSelectedSalonLabel(hasPermission)}
									</Row>
								</Row>
							</Header>
						)
					}
				/>
				<Content className={contentClassName || undefined}>{children}</Content>
			</Layout>
		</Layout>
	)
}

export default MainLayout
