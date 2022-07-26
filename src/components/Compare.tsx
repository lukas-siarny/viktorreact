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
}

const Compare = (props: Props) => {
	const { newValue, oldValue, newFormField, oldFormField, equal, ellipsis = false } = props
	const isSame = equal ?? oldValue === newValue

	return (
		<div className={'mb-2'}>
			<div className={'flex items-center'}>
				{!isSame && oldValue && (
					<Typography.Text ellipsis={ellipsis} className={cx('rounded bg-gray-50 p-2 w-full h-full text-gray-900')}>
						{oldFormField}
					</Typography.Text>
				)}
				{!isSame && oldValue && <StepArrow className={'text-notino-black w-24'} />}
				<Typography.Text ellipsis={ellipsis} className={cx('rounded w-full', { 'bg-emerald-100 p-2': !isSame && oldValue })}>
					{newFormField}
				</Typography.Text>
			</div>
		</div>
	)
}

export default Compare
