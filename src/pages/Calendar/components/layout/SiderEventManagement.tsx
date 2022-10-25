import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Sider from 'antd/lib/layout/Sider'
import { Button } from 'antd'
import i18next from 'i18next'

// enums
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW } from '../../../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

type Props = {
	view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW | true
	setCollapsed: (view: true) => void
}

const getSiderContent = (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW | true) => {
	let title = ''
	let content = ''

	switch (view) {
		case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
			title = i18next.t('loc:Nová rezervácia')
			content = 'Rezervácie formulár'
			break
		case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
			title = i18next.t('loc:Nová smena')
			content = 'Reservation content'
			break
		case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF:
			title = i18next.t('loc:Nová absencia')
			content = 'Reservation content'
			break
		case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
			title = i18next.t('loc:Nová prestávka')
			content = 'Reservation content'
			break
		default:
			break
	}

	return { title, content }
}

const SiderEventManagement: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { view, setCollapsed } = props

	const { title, content } = getSiderContent(view)

	return (
		<Sider className='nc-sider-event-management' collapsed={view === true} width={240} collapsedWidth={0} style={{ transition: 'none' }}>
			<div className={'p-4 w-full'}>
				<div className={'flex w-full justify-between items-start gap-1'}>
					<h2 className={'text-base m-0'}>{title}</h2>
					<Button className='p-0 border-none shadow-none' onClick={() => setCollapsed(true)}>
						<CloseIcon style={{ width: 16, height: 16 }} />
					</Button>
				</div>
				{content}
			</div>
		</Sider>
	)
}

export default SiderEventManagement
