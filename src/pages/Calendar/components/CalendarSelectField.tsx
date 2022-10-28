import React, { FC, useState } from 'react'
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form'
import { FormItemProps } from 'antd/lib/form/FormItem'
import { Button, Collapse, Form } from 'antd'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as ChevronLeftIcon } from '../../../assets/icons/chevron-left-16.svg'
import { ReactComponent as ChevronDownIcon } from '../../../assets/icons/chevron-down.svg'

// components
import InputField from '../../../atoms/InputField'

// enums
import { FIELD_MODE, STRINGS, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export type CalendarSelectOption = {
	key: string
	value: any
	content?: React.ReactNode
	className?: string
}

export type CalendarSelectOptionGroup = {
	title: React.ReactNode
	className?: string
	children: CalendarSelectOption[]
}

type Props = {
	label: string
	entityName: string
	emptyIcon: React.ReactElement
	clearable?: boolean
	input: Omit<WrappedFieldInputProps, 'value'> & {
		value?: {
			label: string
			value: any
			avatar: React.ReactElement
		} | null
	}
	meta: WrappedFieldMetaProps
	disabled?: boolean
	readOnly: boolean
	className?: string
	options: CalendarSelectOptionGroup[]
	onAddNewEntity: () => void
} & FormItemProps

const { Item } = Form
const { Panel } = Collapse

const CalendarSelectField: FC<Props> = (props) => {
	const { entityName, emptyIcon, input, label, meta, required, disabled, style, className, readOnly, options } = props
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

	const getOptions = () => {
		return (
			<Collapse
				className={'nc-filter-collapse'}
				bordered={false}
				defaultActiveKey={[1, 2, 3]}
				expandIconPosition={'end'}
				expandIcon={({ isActive }) => <ChevronDownIcon className={cx({ 'is-active': isActive })} />}
			>
				{options?.map((group) => {
					return (
						<Panel key={1} header={t('loc:Typ udalosti')} className={'nc-filter-panel'}>
							{group.children.map((option) => {
								return (
									<div className={cx(option.className, 'nc-select-option')} onClick={() => input.onChange(option.value)}>
										{option.content}
									</div>
								)
							})}
						</Panel>
					)
				})}
			</Collapse>
		)
	}

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
							placeholder={STRINGS(t).search(entityName)}
							name='search'
							fieldMode={FIELD_MODE.FILTER}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_255}
						/>
						{getOptions()}
					</div>
				</div>
			)}
		</>
	)
}

export default CalendarSelectField
