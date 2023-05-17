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

// utils
import { PERMISSION } from '../../utils/enums'
import Permissions from '../../utils/Permissions'
import { formatPrice, formFieldID } from '../../utils/helper'

// redux
import { RootState } from '../../reducers'
import { getWallet } from '../../reducers/wallet/walletActions'

type Props = {
	salonID: string
	className?: string
	parentPath?: string
	link?: boolean
	walletID: string
}

const RemainingSmsCredit = (props: Props) => {
	const { className, parentPath, link, walletID, salonID } = props
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const wallet = useSelector((state: RootState) => state.wallet.wallet)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	useEffect(() => {
		if (selectedSalon.data?.id === salonID) {
			dispatch(getWallet(salonID, walletID))
		}
	}, [dispatch, salonID, walletID, selectedSalon.data?.id])

	return (
		<div className={cx('p-4 pb-8 rounded shadow-lg bg-notino-white w-full lg:w-1/2', className)}>
			<Spin spinning={wallet.isLoading || selectedSalon.isLoading}>
				<h4 className={'mb-0 flex items-center text-lg'}>
					<MessageIcon className={'text-notino-black mr-2'} />
					{t('loc:Zostatok SMS kreditu')}
				</h4>
				<Divider className={'mb-8 mt-3'} />
				<div className={'flex justify-between items-center gap-4 flex-wrap'}>
					<div>
						<span className={'block mb-2'}>{t('loc:Zostáva')}</span>
						<p className={'m-0 leading-8'}>
							<span className={'text-3xl font-bold mr-1'}>{formatPrice(wallet.data?.wallet.availableBalance || 0)}</span>
							{wallet.data?.wallet.currency.symbol}
						</p>
					</div>

					{link ? (
						<Link
							to={`${parentPath}${t('paths:sms-credit')}`}
							className={'self-end m-semibold text-notino-pink hover:text-notino-pink focus:text-notino-pink inline-flex items-center gap-1'}
						>
							{t('loc:Zobraziť viac')} <ChevronRightIcon />
						</Link>
					) : (
						<Permissions>
							<Button
								onClick={() => navigate(`${parentPath}${t('paths:sms-credit')}/${t('paths:recharge')}`)}
								type='primary'
								htmlType='button'
								className={'noti-btn'}
								icon={<CreateIcon />}
								id={formFieldID('wallet_btn', walletID)}
							>
								{t('loc:Dobiť kredit')}
							</Button>
						</Permissions>
					)}
				</div>
			</Spin>
		</div>
	)
}

export default RemainingSmsCredit
