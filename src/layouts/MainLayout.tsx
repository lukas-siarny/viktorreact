import React, { ReactNode, FC } from 'react'
import { Layout } from 'antd'

// components
import LayoutSider from '../components/LayoutComponents/LayoutSider'

import { PAGE } from '../utils/enums'

const { Content } = Layout

type Props = {
	children: ReactNode
	page?: PAGE
}

const MainLayout: FC<Props> = (props) => {
	const { children, page } = props
	return (
		// <Layout className={'tp-layout'}>
		// 	{/* <LayoutHeader page={page} /> */}
		// 	<Layout className={'tp-content'}>{children}</Layout>
		// </Layout>
		<Layout className='min-h-screen' hasSider>
			<LayoutSider page={page} />
			<Layout>
				<Content className='p-4'>{children}</Content>
			</Layout>
		</Layout>
	)
}

export default MainLayout
