import React from 'react'
import { Button, Divider, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

// assets
import { Link } from 'react-router-dom'
import { ReactComponent as MessageIcon } from '../../assets/icons/message-icon.svg'
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-pink.svg'

// utils
import { PERMISSION } from '../../utils/enums'
import Permissions from '../../utils/Permissions'
import AvailableBalance from './AvailableBalance'

// types
import { RootState } from '../../reducers'

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
	const wallet = useSelector((state: RootState) => state.wallet.wallet)

	return (
		<div className={cx('p-4 pb-8 rounded shadow-lg bg-notino-white w-full lg:w-1/2', className)}>
			<Spin spinning={wallet.isLoading}>
				<h4 className={'mb-0 flex items-center text-lg'}>
					<MessageIcon className={'text-notino-black mr-2'} />
					{t('loc:Zostatok SMS kreditu ')}
				</h4>
				<Divider className={'mb-8 mt-3'} />
				<div className={'flex justify-between items-center gap-4 flex-wrap'}>
					<Permissions allowed={[PERMISSION.READ_WALLET, PERMISSION.PARTNER_ADMIN]}>
						<AvailableBalance salonID={salonID} walletID={walletID} />
					</Permissions>
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
	)
}

export default RemainingSmsCredit
