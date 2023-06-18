import React from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import i18next from 'i18next'

// assets
import { ReactComponent as CheckCircleIcon } from '../../assets/icons/check-circle.svg'

// components

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

const LoayaltyProgramPage = () => {
	const [t] = useTranslation()

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto p-6 md:px-10 md:py-16 md:px-10'>
					<div className={'flex w-full gap-6 xl:gap-8 items-center flex-col xl:flex-row'}>
						<div className={'flex-1'}>
							<span className={'text-white bg-notino-pink rounded-2xl text-sm font-semibold px-2 py-1 inline-block mb-1'}>{t('loc:Pripravujeme pre vás')}</span>
							<h2 className={'font-bold text-4xl mb-3'}>{t('loc:Vernostný program Notino')}</h2>
							<p className={'text-notino-grayDark font-bold text-base mb-6 max-w-md'}>
								{t('loc:Štedro vás odmeníme za každého vášho zákazníka, ktorý nakúpi alebo vytvorí online rezerváciu cez našu aplikáciu.')}
							</p>
							<ul className={'p-0 m-0 list-none flex flex-col gap-4'}>
								<li className={'inline-flex items-start rounded-lg gap-3 bg-notino-grayLighter p-3'}>
									<CheckCircleIcon className={'w-4 h-4 text-notino-pink flex-shrink-0'} />
									<span className={'text-notino-grayDarker text-xs'}>
										{t(
											'loc:Získate až 5 % z celkovej hodnoty objednávky zákazníka, ktorý sa rezervuje do vášho salónu v aplikácii Notino a nakúpi v nej do 24 hodín po tejto návšteve.'
										)}
									</span>
								</li>
								<li className={'inline-flex items-start rounded-lg gap-3 bg-notino-grayLighter p-3'}>
									<CheckCircleIcon className={'w-4 h-4 text-notino-pink flex-shrink-0'} />
									<span className={'text-notino-grayDarker text-xs'}>{t('loc:Získate až 5 € za prvú zákazníkovu online rezerváciu cez našu aplikáciu.')}</span>
								</li>
								<li className={'inline-flex items-start rounded-lg gap-3 bg-notino-grayLighter p-3'}>
									<CheckCircleIcon className={'w-4 h-4 text-notino-pink flex-shrink-0'} />
									<span className={'text-notino-grayDarker text-xs'}>
										{t('loc:Peniaze môžete čerpať formou poukážky na nákup v Notine, SMS kreditu a v budúcnosti aj vyplatením na bankový účet.')}
									</span>
								</li>
							</ul>
						</div>
						<img src={`/images/${i18next.language}/loaylty-program.png`} alt={''} className={'hidden md:block'} width={386} height={363} />
					</div>
				</div>
			</Col>
		</Row>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(LoayaltyProgramPage)
