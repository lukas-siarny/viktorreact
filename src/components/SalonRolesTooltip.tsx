import React, { FC } from 'react'
import { Modal, Collapse, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// uenums
import { SALON_ROLES, SALON_ROLES_PERMISSIONS, SALON_ROLES_KEYS, SALON_ROLES_TRANSLATIONS } from '../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon.svg'
import { ReactComponent as CheckIcon } from '../assets/icons/check-icon-success-16.svg'
import { ReactComponent as CrossedIcon } from '../assets/icons/crossed-red-16.svg'
import { ReactComponent as InfoIcon24 } from '../assets/icons/info-icon.svg'

const { Panel } = Collapse

type Props = {
	visible: boolean
	onCancel?: () => void
}

const SalonRolesTooltip: FC<Props> = (props) => {
	const { visible, onCancel } = props
	const [t] = useTranslation()

	return (
		<Modal
			className={'noti-roles-tooltip-modal rounded-fields md:p-4'}
			title={
				<Row align={'middle'} className={'gap-1'}>
					<InfoIcon24 />
					{t('loc:Výber role')}
				</Row>
			}
			visible={visible}
			centered
			footer={null}
			onCancel={onCancel}
			closeIcon={<CloseIcon />}
		>
			<>
				<p className={'text-notino-grayDark max-w-md'}>
					{t('loc:Spravovanie znamená tvorbu, upravovanie a mazanie vybraných údajov a informácii (ak nie je v zátvorke definované inak).')}
				</p>
				<Collapse className={'noti-collapse m-0'} bordered={false} defaultActiveKey={SALON_ROLES_KEYS} ghost expandIconPosition={'right'}>
					{SALON_ROLES_KEYS.map((salonRole) => {
						return (
							<Panel key={salonRole} header={<h4 className={'text-base my-2'}>{SALON_ROLES_TRANSLATIONS()[salonRole as SALON_ROLES]}</h4>}>
								<ul className={'list-none pl-0'}>
									{SALON_ROLES_PERMISSIONS().map((authorization, index) => {
										const isAllowed = authorization.allowed.includes(salonRole as SALON_ROLES)
										const extra = (authorization.extra as any)[salonRole]
										const icon = isAllowed ? <CheckIcon /> : <CrossedIcon />
										return (
											<li key={index} className={'flex items-start gap-2'}>
												<span className={'pt-1'}>{icon}</span>
												<span>
													{authorization.name} {extra && <i>{`(${extra})`}</i>}
												</span>
											</li>
										)
									})}
								</ul>
							</Panel>
						)
					})}
				</Collapse>
			</>
		</Modal>
	)
}

export default SalonRolesTooltip
