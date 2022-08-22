import React from 'react'
import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { t } from 'i18next'
import { Link } from 'react-router-dom'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// types
import { RootState } from '../../../reducers'

type Props = {
	onCancel: () => void
	visible: boolean
	submitButton: React.ReactNode
	parentPath?: string
}

const SalonApprovalModal = (props: Props) => {
	const { onCancel, visible, submitButton, parentPath } = props
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	return (
		<Modal centered visible={visible} onCancel={onCancel} footer={null} closable={false} className={'p-4'} forceRender width={600}>
			<div className={'noti-approval-modal-content'}>
				<header>
					<button type={'button'} onClick={onCancel}>
						<CloseIcon />
					</button>
					<h1>
						<span>{t('loc:Schválenie')}</span> {t('loc:salóna')}
					</h1>
				</header>
				<main>
					{submitButton}
					<h2 className={'mt-6'}>{t('loc:Prečo salóny schvaľujeme?')}</h2>
					<p>
						{t(
							'loc:Našim zákazníkom chceme priniesť najlepší salón lokátor na trhu. Preto pri schvaľovaní kontrolujeme kvalitu obsahu, pravdivosť a aktuálnosť informácii. Taktiež chceme chrániť vás, majiteľov salónov, pred podvodníkmi a zneužitím informácií.'
						)}
					</p>
					<h2>{t('loc:Pred schválením je potrebné')}</h2>
					<ul className={'requirements'}>
						<li>
							<Link to={parentPath + t('paths:employees')} className={'req-list-item req-list-item-link employee'}>
								{t('loc:priradiť aspoň 1 zamestnanca do salónu, ktorý má aktívny účet v Notino B2B Partner')}
								<span className='arrow-icon'>
									<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
								</span>
							</Link>
						</li>
						<li className={'req-list-item name'}>{t('loc:mať vyplnený názov salónu')}</li>
						<li className={'req-list-item phone'}>{t('loc:mať uvedené aspoň 1 telefónne číslo')}</li>
						<li className={'req-list-item address'}>{t('loc:mať vyplnenú adresu salónu')}</li>
						<li>
							<Link to={parentPath + t('paths:industries')} className={'req-list-item req-list-item-link industry'}>
								{t('loc:salón musí mať zvolené aspoň 1 odvetvie')}
								<span className='arrow-icon'>
									<ChevronDownIcon style={{ transform: 'rotate(-90deg)' }} />
								</span>
							</Link>
						</li>
						<li className={'req-list-item progress'}>
							<div className='flex-1'>
								<div className={'text'}>
									<span className={'label'}>{t('loc:vyplniť čo najviac relevantných dát o salóne')}</span>
									<span className={'percentage'}>{`${salon?.data?.fillingProgressSalon || 0} %`}</span>
								</div>
								<div className={'progress-bar'}>
									<span style={{ width: `${salon?.data?.fillingProgressSalon || 0}%` }} />
								</div>
							</div>
						</li>
					</ul>
					<h2>{t('loc:Čo sa bude diať ďalej?')}</h2>
					<ul className={'what-next mb-0'}>
						<li>
							{t('loc:Schvalovací proces')} <strong>{t('loc:môže trvať 48 hodín')}</strong>
						</li>
						<li>
							{t('loc:Počas schvaľovania')} <strong>{t('loc:nebude možné editovať profil salónu')}</strong>
						</li>
						<li>{t('loc:O výsledku vás budeme informovať emailom')}</li>
						<li>{t('loc:Schválený salón bude zverejnený zákazníkom Notino aplikácie')}</li>
					</ul>
				</main>
			</div>
		</Modal>
	)
}

export default SalonApprovalModal
