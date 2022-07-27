import React from 'react'
import cx from 'classnames'
import { Typography } from 'antd'
import { ReactComponent as StepArrow } from '../assets/icons/step-arrow-icon.svg'

type Props = {
	oldValue?: any
	newValue?: any
	newFormField?: any
	oldFormField?: any
	equal?: boolean
	ellipsis?: boolean
	disableComparsion?: boolean
}

const Compare = (props: Props) => {
	const { newValue, oldValue, newFormField, oldFormField, equal, ellipsis = false, disableComparsion = false } = props
	const isSame = equal ?? oldValue === newValue

	return disableComparsion ? (
		newFormField
	) : (
		<div className={'mb-2'}>
			<div className={'flex items-center'}>
				{!isSame && (
					<Typography.Text ellipsis={ellipsis} className={cx('rounded bg-gray-50 p-2 w-full h-full text-gray-900')}>
						{oldFormField}
					</Typography.Text>
				)}
				{!isSame && <StepArrow className={'text-notino-black w-24'} />}
				<Typography.Text ellipsis={ellipsis} className={cx('rounded w-full', { 'bg-emerald-100 p-2': !isSame })}>
					{newFormField}
				</Typography.Text>
			</div>
		</div>
	)
}

export default Compare
