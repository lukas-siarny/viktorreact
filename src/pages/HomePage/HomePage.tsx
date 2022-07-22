import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

// redux
import { RootState } from '../../reducers'

// utils
import Permissions from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

const HomePage = () => {
	const [t] = useTranslation()
	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data)

	return (
		<Permissions
			allowed={[PERMISSION.PARTNER]}
			render={(hasPermission) =>
				hasPermission && isEmpty(salonOptions) ? (
					<div className='flex h-full justify-center items-center'>
						<div className='m-auto text-center'>
							<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
							<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
								{t('loc:Pridať salón')}
							</Button>
						</div>
					</div>
				) : (
					<div className={'homepage-wrapper'} />
				)
			}
		/>
	)
}

export default HomePage
