import React from 'react'
import cx from 'classnames'
import { Typography } from 'antd'
import { ReactComponent as StepArrow } from '../assets/icons/step-arrow-icon.svg'

type Props = {
	oldValue: any
	newValue: any
	labelName?: string
}

const Compare = (props: Props) => {
	const { newValue, oldValue, labelName } = props
	const isSome = oldValue === newValue

	let newValueWrap: any = newValue
	if (!newValue) {
		newValueWrap = <span className={'line-through'}>{oldValue}</span>
	}
	return (
		(newValue || oldValue) && (
			<div className={'mb-2'}>
				<div className={'text-gray-900 font-semibold text-sm'}>{labelName}</div>
				<div className={'flex items-center'}>
					<Typography.Text ellipsis className={cx('rounded bg-gray-100 p-2 w-full text-gray-900')}>
						{oldValue || '<null>'}
					</Typography.Text>
					<StepArrow className={'text-notino-black w-24'} />
					<Typography.Text ellipsis className={cx('rounded bg-gray-100 p-2 w-full text-gray-900', { 'bg-emerald-100': !isSome })}>
						{newValueWrap}
					</Typography.Text>
				</div>
			</div>
		)
	)
}

export default Compare
