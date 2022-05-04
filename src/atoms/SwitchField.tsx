import React, { useCallback } from 'react'
import { WrappedFieldProps } from 'redux-form'
import cx from 'classnames'

// ant
import { Form, Switch, Tooltip, Typography } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { SwitchProps } from 'antd/lib/switch'
import { ReactComponent as InfoIcon } from '../assets/icons/info-icon-16.svg'
import { formFieldID } from '../utils/helper'
import { KEYBOARD_KEY } from '../utils/enums'

const { Item } = Form

type Props = WrappedFieldProps &
	SwitchProps &
	FormItemLabelProps & {
		suffixIcon?: JSX.Element
		offsetLabel?: boolean
		extraText?: any
		description?: string // text ktory sa zobrazi v tooltipe pri prilozeni na ikonu, ktory moze niekedy dodefinovat dany switch (eg. doplnkove sluzby)
		customLabel?: any
		customOnChange?: (value: boolean) => void
	}

const SwitchField = (props: Props) => {
	const {
		input,
		label,
		disabled,
		meta: { form, error, touched },
		style,
		size,
		onClick,
		checked,
		className,
		suffixIcon,
		extraText,
		description,
		offsetLabel,
		customLabel,
		customOnChange
	} = props
	// NOTE: ak existuje label znamena to ze switch je pouzity ako label vo forme a vtedy sa pouzije novy layout ikona + label text + switch
	// Ak nie je label pouzite je v tabulke alebo vo filtri a vtedy sa nerenderuje label ani ikona ale len samotny switch field

	const checkedState = input.value === 'true' || input.value === true || checked
	const onChange = useCallback(
		(chck: boolean) => {
			if (customOnChange) {
				customOnChange(chck)
			} else {
				input.onChange(chck)
			}
		},
		[input, customOnChange]
	)

	return (
		<Item help={touched && error} validateStatus={error && touched ? 'error' : undefined} style={style} className={cx(className, { 'pt-25px': offsetLabel })}>
			{label || customLabel ? (
				<div
					className={cx('noti-switch', { 'pointer-events-none': disabled, 'bg-gray-50': disabled })}
					onClick={() => onChange(!checkedState)}
					onKeyDown={(e) => {
						if (e.key === KEYBOARD_KEY.ENTER) {
							onChange(!checkedState)
						}
					}}
					role={'checkbox'}
					aria-checked={checkedState}
					tabIndex={0}
				>
					<div className={'flex items-center justify-between w-full'}>
						<div className={'noti-switch__label flex items-center w-11/12'}>
							{customLabel || (
								<Typography.Paragraph ellipsis={{ rows: 1, tooltip: true }} className={'label'}>
									{label}
								</Typography.Paragraph>
							)}
							{description && (
								<Tooltip title={description} className={'cursor-pointer'}>
									{suffixIcon || <InfoIcon className={'text-blue-600'} />}
								</Tooltip>
							)}
						</div>
						<div className={cx('flex justify-end extra-text w-2/12 sm:w-4/12 text-right', { 'text-blue-600': checkedState })}>
							<div>{extraText}</div>
							<span id={formFieldID(form, input.name)}>
								<Switch className={'ml-2'} checked={checkedState} disabled={disabled} size={size} onClick={onClick} tabIndex={-1} />
							</span>
						</div>
					</div>
				</div>
			) : (
				<Switch onChange={onChange} checked={checkedState} disabled={disabled} size={size} onClick={onClick} />
			)}
		</Item>
	)
}

export default SwitchField
