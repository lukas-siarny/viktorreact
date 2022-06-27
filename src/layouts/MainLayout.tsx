import React, { ReactNode, FC } from 'react'
import { Layout, Row, Select, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

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

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
}

const MainLayout: FC<Props> = (props) => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { children } = props
	const salonID = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.id)
	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data) || []

	return (
		<Layout className='min-h-screen noti-main-layout' hasSider>
			<LayoutSider {...props} salonID={salonID} parentPath={t('paths:salons/{{salonID}}', { salonID })} />
			<Layout>
				<Permissions
					allowed={[PERMISSION.PARTNER]}
					render={(hasPermission) =>
						(hasPermission || !!salonID) && (
							<Header className='shadow-md bg-notino-white'>
								<Row className={'justify-between'}>
									<Row className='w-1/3 items-baseline'>
										<strong className='pr-4'>{t('loc:Zvolený salón')}:</strong>
										{hasPermission ? (
											<div className={'ant-form-item w-2/3'}>
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
											// TODO: Display salon name
											<strong>{salonID}</strong>
										)}
									</Row>
									<Row className='w-1/7 items-center'>
										<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
											{t('loc:Pridať salón')}
										</Button>
									</Row>
								</Row>
								{/* <span>
						Current salon: <strong>{salonID}</strong>
					</span> */}
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
