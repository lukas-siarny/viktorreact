import React, { FC } from 'react'
import { Divider } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

// assets
import { ReactComponent as InfoNotinoIcon } from '../../../../assets/icons/info-notino-icon.svg'

type Props = {
	allServicesCount: number
	servicesAvailableForOnlineReservationsCount: number
	servicesVisibleInPricelistCount: number
}

const ServiceStats: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { allServicesCount, servicesAvailableForOnlineReservationsCount, servicesVisibleInPricelistCount } = props

	return (
		<div className={'flex gap-4 mb-12'}>
			{/* all services card */}
			<div className={'p-6 rounded shadow-lg bg-notino-white w-1/3'}>
				<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>{allServicesCount}</h3>
				<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-64'}>{t('loc:služieb')}</div>
				<Divider className={'my-4'} />
				<div className={'flex gap-2'}>
					<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
					<p className={'m-0 text-sm text-normal text-notino-grayDarker'}>{t('loc:Celkový počet služieb, ktoré ponúkate')}</p>
				</div>
			</div>

			{/* services visible in price list card */}
			<div className={'p-6 rounded shadow-lg w-1/3'} style={{ background: 'linear-gradient(0deg, rgba(220, 0, 105, 0.03), rgba(220, 0, 105, 0.03)), #FFFFFF' }}>
				<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>
					{servicesVisibleInPricelistCount}
					<span className={'text-notino-grayMedium'}>/{allServicesCount}</span>
				</h3>
				<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-64'}>{t('loc:služieb viditeľných v cenníku')}</div>
				<Divider className={'my-4'} />
				<div className={'flex gap-2'}>
					<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
					<div className={'flex-1'}>
						<p className={'mb-2 text-sm text-normal text-notino-grayDarker'}>{t('loc:Pre pridanie služby do cenníka')}:</p>
						<ul className={'pl-4 text-notino-pink mb-0'}>
							<li className={'mb-2'}>
								<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
									<Trans defaults={t('loc:<strong>Vyplňte</strong> dĺžku trvania')} components={{ strong: <strong /> }} />
								</span>
							</li>
							<li>
								<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
									<Trans defaults={t('loc:<strong>Vyplňte</strong> cenu služby')} components={{ strong: <strong /> }} />
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* services available for online reservations card */}
			<div className={'p-6 rounded shadow-lg w-1/3'} style={{ background: 'linear-gradient(0deg, rgba(220, 0, 105, 0.08), rgba(220, 0, 105, 0.08)), #FFFFFF' }}>
				<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>
					{servicesAvailableForOnlineReservationsCount}
					<span className={'text-notino-grayMedium'}>/{allServicesCount}</span>
				</h3>
				<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-64'}>{t('loc:služieb dostupných na online rezervácie')}</div>
				<Divider className={'my-4'} />
				<div className={'flex gap-2'}>
					<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
					<div className={'flex-1'}>
						<p className={'mb-2 text-sm text-normal text-notino-grayDarker'}>{t('loc:Pre rezerváciu online')}:</p>
						<ul className={'pl-4 text-notino-pink mb-0'}>
							<li className={'mb-2'}>
								<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
									<Trans defaults={t('loc:<strong>Priraďte</strong> službe aspoň <strong>1 kolegu</strong>')} components={{ strong: <strong /> }} />
								</span>
							</li>
							<li>
								<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
									<Trans defaults={t('loc:<strong>Zapnite si</strong> online rezerváciu')} components={{ strong: <strong /> }} />
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default React.memo(ServiceStats)
