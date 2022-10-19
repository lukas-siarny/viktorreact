import React, { useMemo } from 'react'
import { Button, Modal } from 'antd'
import { t } from 'i18next'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// types
import { IPendingInvitesPayload } from '../../../reducers/users/userActions'
import SalonRolePermissions from '../../../atoms/SalonRolePermissions'

export type PendingInviteData = NonNullable<IPendingInvitesPayload['data']>['pendingEmployeeInvites'][0] | null

type Props = {
	onCancel: () => void
	visible: boolean
	data: PendingInviteData
	acceptInvite: (salonID: string, accept: boolean) => void
}

const InviteModal = (props: Props) => {
	const { onCancel, visible, data, acceptInvite } = props
	const { salon, invitor, role } = data || {}

	const invitorName = `${invitor?.lastName ? invitor.firstName || '' : ''} ${invitor?.lastName || ''}`.trim() || invitor?.email
	const permissions = useMemo(
		() =>
			role?.descriptions.map((permission) => ({
				checked: permission.activated,
				description: permission.name
			})) || [],
		[role?.descriptions]
	)

	return (
		<Modal centered visible={visible} onCancel={onCancel} footer={null} closable={false} className={'p-4'} width={450}>
			<div className={'noti-modal-content noti-invite-modal-content'} id={'noti-approval-modal-content'}>
				<header
					style={
						salon?.cover?.resizedImages?.medium
							? {
									backgroundImage: `linear-gradient(180deg, rgba(18, 18, 18, 0.1) 60.17%, rgba(18, 18, 18, 0.5) 85.49%), url("${salon.cover.resizedImages.medium}")`
							  }
							: undefined
					}
				>
					<button type={'button'} onClick={onCancel}>
						<CloseIcon />
					</button>
					{salon?.logo && (
						<div className={'salon-logo'}>
							<img src={salon?.logo?.resizedImages?.small} alt='' height={50} />
						</div>
					)}
					<h1>{salon?.name}</h1>
				</header>
				{salon && (
					<main>
						<p>
							{t('loc:Používateľ')} <strong>{invitorName}</strong> {t('loc:zo salónu')} {salon?.name}{' '}
							{t('loc:vás pozýva do salónu ako člena tímu. Súčasťou pozvánky sú nastavenia a právomoci, ktoré v salóne budete mať.')}
						</p>
						<h2>
							{t('loc:Vaše právomoci')} {role?.name ? `(${role.name})` : null}
						</h2>
						<SalonRolePermissions permissions={permissions} />
						<Button className={'noti-btn mb-2 w-full mt-4'} onClick={() => acceptInvite(salon?.id, true)} size='middle' type='primary' htmlType='button'>
							{t('loc:Prijať pozvánku')}
						</Button>
						<Button className={'noti-btn m-regular w-full'} onClick={() => acceptInvite(salon?.id, false)} size={'middle'} type={'dashed'} htmlType='button'>
							{t('loc:Odmietnuť')}
						</Button>
					</main>
				)}
			</div>
		</Modal>
	)
}

export default InviteModal
