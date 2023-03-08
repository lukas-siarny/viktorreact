import React, { useEffect } from 'react'
import { Button, Divider, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { Link } from 'react-router-dom'
import { ReactComponent as MessageIcon } from '../../assets/icons/message-icon.svg'
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-pink.svg'

// redux
import { getWallet } from '../../reducers/wallet/walletActions'

// types
import { RootState } from '../../reducers'

// utils
import { formatPrice } from '../../utils/helper'
import { PERMISSION } from '../../utils/enums'
import Permissions, { checkPermissions } from '../../utils/Permissions'

type Props = {
	salonID: string
	className?: string
	parentPath?: string
	link?: boolean
}

const Wallet = (props: Props) => {
	const { className, salonID, parentPath, link } = props
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const walletID = useSelector((state: RootState) => state.selectedSalon.selectedSalon)?.data?.wallet?.id
	const wallet = useSelector((state: RootState) => state.wallet.wallet)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const salonPermissions = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.uniqPermissions ?? [])
	const hasPermissionToSeeWallet = checkPermissions([...(authUser?.data?.uniqPermissions || []), ...salonPermissions], [PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET])

	useEffect(() => {
		if (!walletID || !hasPermissionToSeeWallet) {
			return
		}
		dispatch(getWallet(salonID, walletID))
	}, [dispatch, salonID, walletID, hasPermissionToSeeWallet])

	return walletID ? (
		<div className={cx('p-4 pb-8 rounded shadow-lg bg-notino-white w-full lg:w-1/2', className)}>
			<Spin spinning={wallet.isLoading || authUser.isLoading}>
				<h4 className={'mb-0 flex items-center text-lg'}>
					<MessageIcon className={'text-notino-black mr-2'} />
					{t('loc:Zostatok SMS kreditu ')}
				</h4>
				<Divider className={'mb-8 mt-3'} />
				<div className={'flex justify-between items-center gap-4 flex-wrap'}>
					{hasPermissionToSeeWallet && (
						<div>
							<span className={'block mb-2'}>{t('loc:Zostáva')}</span>
							<p className={'m-0 leading-8'}>
								<span className={'text-3xl font-bold mr-1'}>{formatPrice(wallet.data?.wallet.availableBalance || 0)}</span>
								{wallet.data?.wallet.currency.symbol}
							</p>
						</div>
					)}
					{link ? (
						<Link
							to={`${parentPath}${t('paths:sms-credit')}`}
							className={'self-end m-semibold text-notino-pink hover:text-notino-pink focus:text-notino-pink inline-flex items-center gap-1'}
						>
							{t('loc:Zobraziť viac')} <ChevronRightIcon />
						</Link>
					) : (
						<Permissions allowed={[PERMISSION.NOTINO]}>
							<Button
								onClick={() => navigate(`${parentPath}${t('paths:sms-credit')}/${t('paths:recharge')}`)}
								type='primary'
								htmlType='button'
								className={'noti-btn'}
								icon={<CreateIcon />}
							>
								{t('loc:Dobiť kredit')}
							</Button>
						</Permissions>
					)}
				</div>
			</Spin>
		</div>
	) : null
}

export default Wallet
