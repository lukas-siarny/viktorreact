import React, { ReactNode, FC } from 'react'
import { Layout } from 'antd'

import { PAGE } from '../utils/enums'

type Props = {
	children: ReactNode
	page?: PAGE
}

const MainLayout: FC<Props> = (props) => {
	const { children, page } = props
	return (
		<Layout className={'tp-layout'}>
			{/* <LayoutHeader page={page} /> */}
			<Layout className={'tp-content'}>{children}</Layout>
		</Layout>
	)
}

export default MainLayout
