import React, { FC, ReactNode } from 'react'
import { Tabs, TabsProps, TabPaneProps } from 'antd'

const { TabPane } = Tabs

type TabPaneCustomProps = TabPaneProps & {
	tabPaneContent: ReactNode
}
type Props = TabsProps & {
	tabsContent: TabPaneCustomProps[]
}

const TabsComponent: FC<Props> = (props) => {
	const { tabsContent, className, animated = false, ...restProps } = props

	return (
		<Tabs {...restProps} className={`noti-tabs ${className ?? ''}`} animated={animated}>
			{tabsContent?.map((tabPane) => (
				<TabPane closeIcon={tabPane.closeIcon} forceRender={tabPane.forceRender} disabled={tabPane.disabled} tab={tabPane.tab} key={tabPane.tabKey}>
					{tabPane.tabPaneContent}
				</TabPane>
			))}
		</Tabs>
	)
}

export default TabsComponent
