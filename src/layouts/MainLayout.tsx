import React, { ReactNode, FC } from 'react'
import { Layout } from 'antd'

// components
import LayoutSider, { LayoutSiderProps } from '../components/LayoutComponents/LayoutSider'

const { Content } = Layout

type Props = LayoutSiderProps & {
	children: ReactNode
}

const MainLayout: FC<Props> = (props) => {
	const { children } = props

	return (
		<Layout className='min-h-screen noti-main-layout' hasSider>
			<LayoutSider {...props} />
			<Layout>
				<Content className='p-4 pl-10'>{children}</Content>
			</Layout>
		</Layout>
	)
}

export default MainLayout
