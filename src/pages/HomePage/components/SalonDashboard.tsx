import React, { FC } from 'react'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { RootState } from '../../../reducers'

// components
import Alert from '../../../components/Dashboards/Alert'
import Statistics from '../../../components/Dashboards/Statistics'

const SalonDashboard: FC = (props) => {
	const [t] = useTranslation()
	const { children } = props
	const { selectedSalon } = useSelector((state: RootState) => state.selectedSalon)

	return selectedSalon?.isLoading ? (
		<Spin spinning={true} />
	) : (
		<>
			{selectedSalon?.data ? (
				<div>
					{/* <h3 className='mt-4 text-center'>{t('loc:Prehľad pre salón - {{name}} - bude dostupný čoskoro', { name: selectedSalon.data.name })}</h3> */}
					{/* <div className={'dashboard-image'} /> */}
					<Alert
						className='mb-8'
						message={
							'Proin eget tortor risus. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Proin eget tortor risus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus. Sed porttitor lectus nibh.'
						}
						title={'Zamietnuty salon'}
						actionLabel='Upravit udaje salona'
					/>
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 3xl:gap-8'>
						<Statistics title='Počet odborov v salóne' count={155} onActionItemClick={() => null} />
						<Statistics title='Lorem ipsum dolor sit amet, consectetur adipiscing elit.' count={45} onActionItemClick={() => null} />
						<Statistics
							title='Donec rutrum congue leo eget malesuada. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Proin eget tortor risus.'
							count={19}
							onActionItemClick={() => null}
						/>
						<Statistics title='Curabitur aliquet quam id dui posuere blandit.' count={55555} onActionItemClick={() => null} />
					</div>
				</div>
			) : (
				children
			)}
		</>
	)
}

export default SalonDashboard
