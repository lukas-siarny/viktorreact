import React, { useEffect } from 'react'
import { Button, Divider, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { isNil } from 'lodash'

// assets
import { ReactComponent as MessageIcon } from '../../assets/icons/message-icon.svg'
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'

// redux
import { getWallet } from '../../reducers/wallet/walletActions'

// types
import { RootState } from '../../reducers'

// utils
import { formatPrice } from '../../utils/helper'

type Props = {
	salonID: string
	className?: string
	parentPath?: string
}

const Wallet = (props: Props) => {
	const { className = 'w-1/2', salonID, parentPath } = props
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const walletID = useSelector((state: RootState) => state.selectedSalon.selectedSalon)?.data?.wallet?.id
	const wallet = useSelector((state: RootState) => state.wallet.wallet)

	useEffect(() => {
		if (!walletID) {
			return
		}
		dispatch(getWallet(salonID, walletID))
	}, [dispatch, salonID, walletID])

	return (
		<div className={cx('p-4 pb-8 rounded shadow-lg bg-notino-white', className)}>
			<Spin spinning={wallet.isLoading}>
				<h4 className={'mb-0 flex items-center text-lg'}>
					<MessageIcon className={'text-notino-black mr-2'} />
					{t('loc:Zostatok SMS kreditu ')}
				</h4>
				<Divider className={'mb-8 mt-3'} />
				<div className={'flex justify-between items-center gap-4 flex-wrap'}>
					{!isNil(wallet.data?.wallet.availableBalance) && (
						<div>
							<span className={'block mb-2'}>{t('loc:Zostáva')}</span>
							<p className={'m-0 leading-8'}>
								<span className={'text-3xl font-bold mr-1'}>{formatPrice(wallet.data?.wallet.availableBalance as number)}</span>
								{wallet.data?.wallet.currency.symbol}
							</p>
						</div>
					)}
					<Button
						onClick={() => navigate(`${parentPath}${t('paths:sms-credit')}/${t('paths:recharge')}`)}
						type='primary'
						htmlType='button'
						className={'noti-btn'}
						icon={<CreateIcon />}
					>
						{t('loc:Dobiť kredit')}
					</Button>
				</div>
			</Spin>
		</div>
	)
}

export default Wallet
