import React, { useCallback, useState } from 'react'
import { Collapse } from 'antd'
import { filter, get, some } from 'lodash'
import { Field } from 'redux-form'
import i18next from 'i18next'
import cx from 'classnames'

// assets
import { ReactComponent as LanguageIcon } from '../assets/icons/language-icon.svg'

// utils
import { validationString } from '../utils/helper'
import { LOCALIZATIONS, LANGUAGE, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { LOCALES } from './LanguagePicker'

// atoms
import InputField from '../atoms/InputField'

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)
const horizontalLabelStyle = { minWidth: 25 }
const inputFieldStyle = { paddingBottom: 4 }

const Localizations = (param: any) => {
	const formValueLocalizations = param.fields.getAll()
	const existNameLocalization = some(formValueLocalizations, 'value')
	const [activeKey, setActiveKey] = useState<string | null>()
	const [focusedFieldInCollapse, setFocusedFieldInCollapse] = useState<boolean>()
	const keyName = LOCALIZATIONS

	let finalCollapseKey: any
	if (activeKey !== undefined) {
		finalCollapseKey = activeKey // Otvorenie/zatvorenie kontrolovane buttonom
	} else if (existNameLocalization || (focusedFieldInCollapse && !existNameLocalization)) {
		// Automaticke otvorenie ak existuje aspon jeden preklad
		// alebo Collapse ma ostat otvoreny po odstraneni posledneho prekladu
		finalCollapseKey = keyName
	}

	const onChange = useCallback(() => {
		setActiveKey(finalCollapseKey ? null : keyName)
		setFocusedFieldInCollapse(false)
	}, [finalCollapseKey, keyName])

	const setFocusedWrap = useCallback(() => setFocusedFieldInCollapse(true), [])

	const otherFields: any[] = []

	param.fields.forEach((field: any, index: any, fields: any) => {
		const value = fields.get(index)
		const displayAs = get(LOCALES[value.language as LANGUAGE], 'displayAs', value.language)?.toUpperCase()

		if (index === param.ignoreFieldIndex) {
			return
		}

		otherFields.push(
			<div className={'flex items-start'} key={`${field}.value`}>
				{param.horizontal && (
					<label htmlFor={`${field}.value`} className={cx('noti-input-label pt-1', { required: param.required })} style={horizontalLabelStyle}>
						{displayAs}
					</label>
				)}

				<Field
					className={'flex-grow'}
					key={`${field}.value`}
					name={`${field}.value`}
					component={param.fieldComponent || InputField}
					disabled={param.disabled}
					size={'small'}
					placeholder={`${get(param, 'placeholder')} (${displayAs})`}
					validate={param?.customValidate || [fixLength255]}
					autoSize={param.fieldAutoSize}
					focusRow={param.fieldFocusRow}
					required={param.required}
					rows={param?.customRows}
					onFocus={setFocusedWrap}
					style={inputFieldStyle}
				/>
			</div>
		)
	})

	return (
		<div className={cx(param.className, 'relative noti-localizations-collapse-wrapper')}>
			<button
				type='button'
				className={cx('noti-language-button flex items-center justify-end cursor-pointer border-none bg-none p-0 bg-transparent', {
					'noti-absolute': param.noSpace,
					'absolute -top-1 right-0': !param.noSpace
				})}
				style={{ zIndex: 1 }}
				onClick={onChange}
			>
				<LanguageIcon className={'text-blue-600'} />
				<div className={'text-blue-600'}>{i18next.t('loc:Jazyk')}</div>
				<div className={'ml-2'}>{`${filter(formValueLocalizations, (item) => !!item.value)?.length}/${formValueLocalizations?.length || 0}`}</div>
			</button>
			{param.mainField}
			<Collapse
				// Collapse is controlled by other element
				expandIcon={() => null}
				bordered={false}
				className={'noti-localizations-collapse'}
				activeKey={finalCollapseKey}
			>
				<Collapse.Panel header={''} key={keyName}>
					<div className={`mt-2 ${get(param, 'otherFieldsClass', '')}`}>{otherFields}</div>
				</Collapse.Panel>
			</Collapse>
			{param?.meta?.error && (
				<div id={`${param.meta.form}-${param.fields.name}._error`} className={'text-red-600'}>
					{param.meta.error}
				</div>
			)}
		</div>
	)
}

export default Localizations
