import React, { FC } from 'react'
import { Button } from 'antd'
import i18next from 'i18next'
import calendarEmpty from '../../../assets/images/calendar-empty-min.png'

type Props = {
	title?: string
	image?: string
	buttonLabel?: string
	onButtonClick?: () => void
}

const CalendarEmptyState: FC<Props> = (props) => {
	const { title = i18next.t('loc:Nie je vybratý žiaden zamestnanec'), image = calendarEmpty, buttonLabel = i18next.t('loc:Vybrať všetkých'), onButtonClick } = props

	return (
		<div className={'noti-fc-empty w-full h-full flex flex-col items-center min-w-80 gap-10 p-4 pt-10 overflow-auto'}>
			<h2 className={'m-0 text-2xl text-center max-w-md'}>{title}</h2>
			<div className={'image-wrapper'}>
				<div className={'image-wrapper-inner'}>
					<img src={image} alt={''} />
				</div>
			</div>
			{onButtonClick && (
				<Button type={'primary'} htmlType={'button'} className={'noti-btn shrink-0'} onClick={onButtonClick}>
					{buttonLabel}
				</Button>
			)}
		</div>
	)
}

export default CalendarEmptyState
