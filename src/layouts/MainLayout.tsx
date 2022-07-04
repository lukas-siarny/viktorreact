import React, { ReactNode, FC } from 'react'
import { Layout, Row, Button, Dropdown, Menu } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// components
import { Header } from 'antd/lib/layout/layout'
import LayoutSider, { LayoutSiderProps } from '../components/LayoutComponents/LayoutSider'

// redux
import { RootState } from '../reducers'
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

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

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
}

const MainLayout: FC<Props> = (props) => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { children } = props
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const { salonID } = useParams() as any
	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data) || []

	const SALONS_MENU = (
		<Menu className='p-2 shadow-md max-w-xs min-w-0 mt-5 noti-dropdown-header'>
			{salonOptions.map((item) => (
				<Menu.Item
					key={item.key}
					className={cx({ 'ant-menu-item-selected': selectedSalon?.id === item.value }, 'py-2-5 px-2 mb-2 font-medium min-w-0')}
					onClick={() => dispatch(selectSalon(item.value as number))}
				>
					<AvatarComponents src={item.logo} size={24} className={'mr-2-5'} />
					{item.label}
				</Menu.Item>
			))}
			<Menu.Divider className={'m-0'} />
			<Menu.Item key='add-salon' className={'mt-2 p-2 font-medium button-add'} icon={<AddPurple />} onClick={() => history.push(t('paths:salons/create'))}>
				{t('loc:Pridať salón')}
			</Menu.Item>
		</Menu>
	)

	const getSelectedSalonLabel = (hasPermision = true) => {
		const content = (
			<Row className='m-2 flex items-center gap-2 min-w-0 ' justify='space-between' wrap={false}>
				<Row wrap={false} className={'min-w-0 flex items-center gap-2-5'}>
					<AvatarComponents size={24} src={selectedSalon?.logo?.resizedImages.thumbnail} />
					{selectedSalon?.name && <span className='truncate leading-4 text-sm min-w-0 inline-block'>{selectedSalon.name}</span>}
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
				<Dropdown overlay={SALONS_MENU} placement='bottomRight' trigger={['click']} overlayStyle={{ minWidth: 226 }}>
					<div role={'button'} className={cx(labelClassname, 'cursor-pointer')} tabIndex={-1} onClick={(e) => e.preventDefault()} onKeyPress={(e) => e.preventDefault()}>
						{content}
					</div>
				</Dropdown>
			)
		}

		return (
			<>
				<span className='pr-4 text-xs selected-salon-text'>{t('loc:zvolený salón')}:</span>
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
							<Header className='shadow-md bg-notino-white sticky top-0 z-10 px-4 flex items-center w-full'>
								<Row className={`${hasPermission ? 'justify-end' : 'justify-between'} min-w-0 w-full`} wrap={false}>
									{!hasPermission && (
										<Button
											onClick={() => history.push(t('paths:index'))}
											icon={<BackIcon className={'text-notino-black'} />}
											className={'noti-btn h-8 text-notino-black self-center'}
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
				<Content className='p-4 px-10'>{children}</Content>
			</Layout>
		</Layout>
	)
}

export default MainLayout
