import React, { ReactNode, FC } from 'react'
import { Layout, Row, Select, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'

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
import { ReactComponent as BackIcon } from '../assets/icons/back-icon.svg'

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
}

const MainLayout: FC<Props> = (props) => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { children } = props
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const salonID = selectedSalon?.id
	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data) || []

	return (
		<Layout className='min-h-screen noti-main-layout' hasSider>
			<LayoutSider {...props} salonID={salonID} parentPath={t('paths:salons/{{salonID}}', { salonID })} />
			<Layout>
				<Permissions
					allowed={[PERMISSION.PARTNER]}
					render={(hasPermission) =>
						(hasPermission || !!salonID) && (
							<Header className='shadow-md bg-notino-white sticky top-0 z-10'>
								<Row className={'justify-between'}>
									<Row className='w-1/2 items-baseline'>
										<strong className='pr-4'>{t('loc:Zvolený salón')}:</strong>
										{hasPermission ? (
											<div className={'ant-form-item w-1/2'}>
												<Select
													value={salonID}
													defaultValue={salonID}
													onChange={(id) => dispatch(selectSalon(id))}
													options={salonOptions}
													className={'noti-select-input'}
													dropdownClassName={'noti-select-dropdown'}
												/>
											</div>
										) : (
											<strong>{get(selectedSalon, 'name') || salonID}</strong>
										)}
									</Row>
									<Row className='w-1/7 items-center'>
										{hasPermission ? (
											<Button
												onClick={() => history.push(t('paths:salons/create'))}
												type='primary'
												htmlType='button'
												className={'noti-btn'}
												icon={<PlusIcon />}
											>
												{t('loc:Pridať salón')}
											</Button>
										) : (
											<Button onClick={() => history.push(t('paths:salons'))} type='primary' htmlType='button' className={'noti-btn'} icon={<BackIcon />}>
												{t('loc:Späť na zoznam salónov')}
											</Button>
										)}
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
