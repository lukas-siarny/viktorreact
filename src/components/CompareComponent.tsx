import React from 'react'
import cx from 'classnames'
import { Typography } from 'antd'
import { ReactComponent as StepArrow } from '../assets/icons/step-arrow-icon.svg'

type Props = {
	oldValue: string | undefined | null
	newValue: string | undefined | null
	valueKey: string
	equal?: boolean
	ellipsis?: boolean
}

const CompareComponent = (props: Props) => {
	const { newValue, oldValue, valueKey, equal, ellipsis = false } = props
	const isSame = equal ?? oldValue === newValue

	return (
		<>
			{!isSame && (
				<div className={'mb-2'}>
					<div className={'font-bold'}>{valueKey}</div>
					<div className={'flex items-center'}>
						<Typography.Text ellipsis={ellipsis} className={cx('rounded bg-gray-50 p-2 w-full h-full text-gray-900')}>
							{oldValue ?? ' --- '}
						</Typography.Text>
						<StepArrow className={'text-notino-black w-24'} />
						<Typography.Text
							ellipsis={ellipsis}
							className={cx('rounded w-full', {
								'bg-yellow-100 p-2': !isSame && oldValue && newValue,
								'bg-green-100 p-2': !oldValue && newValue,
								'bg-red-100 p-2': oldValue && !newValue
							})}
						>
							{newValue ?? ' --- '}
						</Typography.Text>
					</div>
				</div>
			)}
		</>
	)
}

export default CompareComponent
