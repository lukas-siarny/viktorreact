import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Header } from 'antd/lib/layout/layout'
import { Button } from 'antd'

// assets
import { ReactComponent as NavIcon } from '../../../assets/icons/navicon-16.svg'
import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left-16.svg'

type Props = {
	setSiderFilterCollapsed: () => void
}

const CalendarLayoutHeader: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { setSiderFilterCollapsed } = props

	return (
		<Header className={'nc-header'}>
			<div className={'nav-left'}>
				<button type={'button'} className={'nc-button light'} onClick={() => setSiderFilterCollapsed()}>
					<NavIcon />
				</button>
				<div className={'nc-button-group'}>
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
				<button type={'button'} className={'nc-button bordered w-8 mr-2'}>
					<ChevronLeft />
				</button>
				<button type={'button'} className={'nc-button bordered w-8'}>
					<ChevronLeft style={{ transform: 'rotate(180deg)' }} />
				</button>
				<button type={'button'} className={'mx-1'}>
					Date
				</button>
				<button type={'button'} className={'nc-button light'}>
					{t('loc:Dnes')}
				</button>
			</div>
			<div className={'nav-right'}>
				<Button type={'primary'} size={'large'}>
					{t('loc:Pridať novú')}
				</Button>
			</div>
		</Header>
	)
}

export default CalendarLayoutHeader
