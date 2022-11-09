import React, { FC } from 'react'
import { Button } from 'antd'
import i18next from 'i18next'

type Props = {
	title?: string
	image?: string
	buttonLabel?: string
	onButtonClick?: () => void
}

const CalendarEmptyState: FC<Props> = (props) => {
	const { title = i18next.t('loc:Nie je vybratý žiaden zamestnanec'), image, buttonLabel = i18next.t('loc:Vybrať všetkých'), onButtonClick } = props

	return (
		<div className={'noti-calendar-empty'}>
			<h2>{title}</h2>
			<div className={'image'}>
				<img src={image} alt={''} />
			</div>
			{onButtonClick && (
				<Button type={'primary'} htmlType={'button'} onClick={onButtonClick}>
					{buttonLabel}
				</Button>
			)}
		</div>
	)
}

export default CalendarEmptyState
