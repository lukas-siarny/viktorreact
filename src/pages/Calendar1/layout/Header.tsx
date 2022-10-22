import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Header } from 'antd/lib/layout/layout'
import { Button } from 'antd'

type Props = {
	setSiderFilterCollapsed: () => void
}

const CalendarLayoutHeader: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { setSiderFilterCollapsed } = props

	return (
		<Header className={'nc-header'}>
			<div className={'nav-left'}>
				<button type={'button'} onClick={() => setSiderFilterCollapsed()}>
					x
				</button>
				<div className={'button-group'}>
					<button type={'button'} className={cx({ active: true })}>
						{t('loc:Deň')}
					</button>
					<button type={'button'} className={cx({ active: false })}>
						{t('loc:Týždeň')}
					</button>
					<button type={'button'} className={cx({ active: false })}>
						{t('loc:Mesiac')}
					</button>
				</div>
			</div>
			<div className={'nav-middle'}>
				<button type={'button'}>-</button>
				<button type={'button'}>+</button>
				<button type={'button'}>Date</button>
				<button type={'button'}>{t('loc:Dnes')}</button>
			</div>
			<Button type={'primary'}>{t('loc:Pridať novú')}</Button>
		</Header>
	)
}

export default CalendarLayoutHeader
