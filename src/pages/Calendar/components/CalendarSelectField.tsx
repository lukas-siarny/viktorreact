import React, { FC, useState } from 'react'
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { Button } from 'antd'

// assets
import { ReactComponent as ChevronLeftIcon } from '../../../assets/icons/chevron-left-16.svg'

// enums

// types

// components

type Props = {
	labelSelect: {
		icon: any
		label: string
	}
	required?: boolean
	removable?: boolean
	input: Omit<WrappedFieldInputProps, 'value'> & {
		value?: {
			label: string
			value: string
			avatar: any
		} | null
	}
	meta: WrappedFieldMetaProps
} & FormItemProps

const CalendarSelectField: FC<Props> = (props) => {
	const { labelSelect, input } = props
	const [optionsOpened, setOptionsOpened] = useState(false)

	return (
		<>
			<div className={'nc-select'}>
				{input.value ? (
					<div className={''}>{input.value.label}</div>
				) : (
					<button type={'button'} onClick={() => setOptionsOpened(true)}>
						{labelSelect.label}
					</button>
				)}
			</div>
			{optionsOpened && (
				<div className={'nc-select-options-panel'}>
					<div className={'nc-sider-event-management-header'}>
						<Button className='button-transparent' onClick={() => setOptionsOpened(false)}>
							<ChevronLeftIcon />
						</Button>
						<h2>{labelSelect.label}</h2>
					</div>
					<div className={'nc-sider-event-management-content'}>{'Selection options'}</div>
				</div>
			)}
		</>
	)
}

export default CalendarSelectField
