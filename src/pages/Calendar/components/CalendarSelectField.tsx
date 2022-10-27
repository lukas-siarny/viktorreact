import React, { FC, useState } from 'react'
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { Button, Form } from 'antd'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as ChevronLeftIcon } from '../../../assets/icons/chevron-left-16.svg'

// components
import InputField from '../../../atoms/InputField'
import { FIELD_MODE, STRINGS, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

type Props = {
	label: string
	entityName: string
	emptyIcon: React.ReactElement
	clearable?: boolean
	input: Omit<WrappedFieldInputProps, 'value'> & {
		value?: {
			label: string
			value: string
			avatar: React.ReactElement
		} | null
	}
	meta: WrappedFieldMetaProps
	disabled?: boolean
	readOnly: boolean
	className?: string
} & FormItemProps

const { Item } = Form

const CalendarSelectField: FC<Props> = (props) => {
	const { entityName, emptyIcon, input, label, meta, required, disabled, style, className, readOnly } = props
	const [optionsOpened, setOptionsOpened] = useState(false)
	const [zIndex, setzIndex] = useState(1)
	const [t] = useTranslation()

	const closePanel = () => {
		setOptionsOpened(false)
		setzIndex(1)
	}

	const openPanel = () => {
		setOptionsOpened(true)
		setzIndex(999)
	}

	const onSearchOptions = () => {}

	return (
		<>
			<Item
				label={label}
				required={required}
				style={style}
				className={cx(className, { 'form-item-disabled': disabled, readOnly }, 'nc-select pb-0')}
				help={meta.touched && meta.error}
				validateStatus={meta.touched && meta.error}
			>
				<>
					{input.value ? (
						<div className={''}>{input.value.label}</div>
					) : (
						<button type={'button'} className={'nc-select-button'} onClick={openPanel}>
							{emptyIcon} {STRINGS(t).select(entityName)}
						</button>
					)}
				</>
			</Item>
			{optionsOpened && (
				<div className={'nc-select-options-panel'} style={{ zIndex }}>
					<div className={'nc-sider-event-management-header'}>
						<Button className='button-transparent' onClick={closePanel}>
							<ChevronLeftIcon />
						</Button>
						<h2>{STRINGS(t).select(entityName)}</h2>
					</div>
					<div className={'nc-sider-event-management-content'}>
						<InputField
							className={'h-10 p-0 m-0'}
							input={{ value: '', onChange: onSearchOptions } as any}
							meta={{ error: false, touched: false } as any}
							size={'large'}
							placeholder={STRINGS(t).search(entityName)}
							name='search'
							fieldMode={FIELD_MODE.FILTER}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_255}
						/>

						{'Selection options'}
					</div>
				</div>
			)}
		</>
	)
}

export default CalendarSelectField
