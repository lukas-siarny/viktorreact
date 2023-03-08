import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// redux
import { getWallet } from '../../reducers/wallet/walletActions'

// types
import { RootState } from '../../reducers'

// utils
import { formatPrice } from '../../utils/helper'

type Props = {
	salonID: string
	walletID: string
}

const AvailableBalance = (props: Props) => {
	const { salonID, walletID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const wallet = useSelector((state: RootState) => state.wallet.wallet)

	useEffect(() => {
		dispatch(getWallet(salonID, walletID))
	}, [dispatch, salonID, walletID])

	return (
		<div>
			<span className={'block mb-2'}>{t('loc:Zostáva')}</span>
			<p className={'m-0 leading-8'}>
				<span className={'text-3xl font-bold mr-1'}>{formatPrice(wallet.data?.wallet.availableBalance || 0)}</span>
				{wallet.data?.wallet.currency.symbol}
			</p>
		</div>
	)
}

export default AvailableBalance
