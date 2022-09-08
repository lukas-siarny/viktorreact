import React, { FC } from 'react'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { RootState } from '../../../reducers'

const SalonDashboard: FC = (props) => {
	const [t] = useTranslation()
	const { children } = props
	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)

	return selectedSalon?.isLoading ? (
		<Spin spinning={true} />
	) : (
		<>
			{selectedSalon?.data ? (
				<>
					<h3 className='mt-4 text-center'>{t('loc:Prehľad pre salón - {{name}} - bude dostupný čoskoro', { name: selectedSalon.data.name })}</h3>
					<div className={'dashboard-image'} />
				</>
			) : (
				children
			)}
		</>
	)
}

export default SalonDashboard
