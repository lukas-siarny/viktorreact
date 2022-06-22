import React, { ReactNode, FC } from 'react'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// components
import { Header } from 'antd/lib/layout/layout'
import LayoutSider, { LayoutSiderProps } from '../components/LayoutComponents/LayoutSider'

// redux
import { RootState } from '../reducers'

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
}

const MainLayout: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { children } = props
	const salonID = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.id)
	console.log('🚀 ~ file: MainLayout.tsx ~ line 23 ~ salonID', salonID)

	return (
		<Layout className='min-h-screen noti-main-layout' hasSider>
			<LayoutSider {...props} salonID={salonID} parentPath={t('paths:salons/{{salonID}}', { salonID })} />
			<Layout>
				<Header>
					Current salon: <strong>{salonID}</strong>
				</Header>
				<Content className='p-4 px-10'>{children}</Content>
			</Layout>
		</Layout>
	)
}

export default MainLayout
