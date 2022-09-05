import React, { FC, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'

// types
import { isEmpty, isNil } from 'lodash'
import { RootState } from '../reducers'
import { history } from './history'

import { ReactComponent as TrashIcon } from '../assets/icons/deleted.svg'

type Props = {}

const PreventShowDeletedSalon: FC<Props> = (props) => {
	const { children } = props
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const [t] = useTranslation()

	if (isEmpty(selectedSalon?.data)) {
		return null
	}

	if (isNil(selectedSalon?.data?.deletedAt)) {
		return children as ReactElement
	}

	return (
		<Result
			status='error'
			title={t('loc:Salón bol vymazaný')}
			icon={<TrashIcon style={{ width: 56, height: 56 }} />}
			extra={
				<Button type={'primary'} size={'middle'} className={'noti-btn m-regular'} onClick={() => history.push(`${t('paths:salons')}/${selectedSalon.data?.id}`)}>
					{t('loc:Detail salónu')}
				</Button>
			}
		/>
	)
}

export default React.memo<FC<Props>>(PreventShowDeletedSalon)
