import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormAction, WrappedFieldProps } from 'redux-form'
import cx from 'classnames'
import { debounce, get, isArray, isEmpty, isString, map, some } from 'lodash'
import i18next from 'i18next'

// ant
import { AutoComplete, AutoCompleteProps, Button, Divider, Empty, Form, Popconfirm, Spin } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'

// icons
import { ReactComponent as ArrowIcon } from '../assets/icons/select-arrow-icon.svg'
import { ReactComponent as CloseIconSmall } from '../assets/icons/close-icon-16.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon.svg'

// utils
import { FIELD_MODE, FORM } from '../utils/enums'
import { createSlug, formFieldID } from '../utils/helper'

// assets
import { ReactComponent as LoadingIcon } from '../assets/icons/loading-icon.svg'

// types
import { ISelectOptionItem } from '../types/interfaces'

const { Item } = Form
const { Option } = AutoComplete

type Action = {
	title: string
	icon?: ReactNode
	onAction: () => void
}

export type Props = {
	update?: (value: any, ref: any) => FormAction
	actions?: Action[] | null
	allowInfinityScroll?: boolean
	fieldMode?: FIELD_MODE
	backgroundColor?: string
	showErrorWhenUntouched?: boolean
	hideHelp?: boolean
	/** Klúč podľa ktorého sa vytiahnu dáta v onSearch */
	dataSourcePath?: string
	/** propa urcena predovsetkym pre filtre, kedy mozeme skopirovat URL na novy TAB
	 *  propa zabezpeci spravne initializovanie z query filtra a formu filtra (forcne dotiahnutie options dat pre select)
	 *  posielat len vtedy ak mame v selecte search a dotahujeme vsetky data (spravidla vtedy ked nie je BE vyhladavanie, alebo neexistuje paginacia)
	 */
	onDidMountSearch?: boolean
	/**
	 * Propa renderuje labels vo vnútri vstupného poľa
	 * Use case: po vybraní položky z dropdown chcem aby sa položka vyrenderovala do inputu nezávysle od toho ako sa renderuje v dropdowne
	 */
	renderInnerLabel?: (option: any, parentOpt: any) => ReactNode | string
	emptyText?: string
	itemRef?: any
	autoBlur?: boolean
	readOnly?: boolean
	disableTpStyles?: boolean // Vypne styly ktore dava classa noti-input ked je potrebne (obrazovka /vyhladavanie vo filtroch su pouzite ine styly pre selecty z global)
	disableMenuItemSelectedIcon?: boolean // niekedy tuto ikonu renderujeme nie cez propu ale cez position absolute a vtedy by sa tu dve zobrazovali lebo je || SearchIcon (vo filtroch pre vyhladavanie)
	onSelect?: (value: string | ISelectOptionItem, option: ISelectOptionItem) => any
	optionRender?: any // custom render for item(option)
	formName?: FORM
	confirmSelection?: boolean
	confirmModalExtraTitle?: string
	labelInValue?: boolean
} & WrappedFieldProps &
	AutoCompleteProps<any> &
	FormItemProps

type IPagination = {
	limit: number
	page: number
	totalPages: number
	totalCount: number
}

type SelectStateTypes = {
	data?: any[]
	fetching?: boolean
	searchValue?: string
	emptyText?: string | null
	pagination?: IPagination | null
}

const renderMenuItemSelectedIcon = (menuItemSelectedIcon: Props['menuItemSelectedIcon'], disableMenuItemSelectedIcon: Props['disableMenuItemSelectedIcon']) => {
	// NOTE: menuItemSelectedIcon sa renderuje len ak pretazim logiku a zhora ju poslem v prope menuItemSelectedIcon
	let icon: any
	if (menuItemSelectedIcon) {
		icon = menuItemSelectedIcon
	} else if (disableMenuItemSelectedIcon) {
		icon = null
	}
	return icon
}

const getOptions = (optionRender: any, options: any, labelInValue = false, value?: any) =>
	map(options, (option) => (
		<Option
			key={option.value}
			value={labelInValue ? option.label : option.value}
			disabled={option.disabled}
			label={option.label}
			extra={option.extra}
			style={option.level ? { paddingLeft: 16 * option.level } : undefined}
			className={cx(option.className, 'noti-custom-autocomplete-dropdown-item', {
				'noti-custom-autocomplete-dropdown-item-selected': labelInValue && option.value === value
			})}
		>
			{optionRender ? optionRender(option) : option.label}
		</Option>
	))

const customDropdown = (actions: Action[] | null | undefined, menu: React.ReactElement, fetching: boolean | undefined) => {
	const divider = isEmpty(actions) ? null : <Divider style={{ margin: 0 }} />

	return (
		<Spin
			indicator={<LoadingIcon className={'loading-spinner text-notino-black'} />}
			className={'justify-start flex-center text-notino-black m-2-5'}
			tip={i18next.t('loc:Načítavam...')}
			spinning={fetching}
		>
			{menu}
			<div className={'w-11/12 m-auto'}>{divider}</div>
			{map(actions, (item, index) => (
				<div className={'flex items-center h-12'} key={index}>
					<Button key={item.title} type='link' size={'large'} htmlType='button' className={'noti-btn'} icon={item.icon || <PlusIcon />} onClick={item.onAction}>
						{item.title}
					</Button>
				</div>
			))}
		</Spin>
	)
}

const handleChange = async (data: any, labelInValue = false) => {
	const { value, options = {}, autoBlur, input, itemRef } = data

	await input.onChange(labelInValue ? { key: options.value, label: options.label || value, value: options.value || value, extra: options.extra } : value)

	if (autoBlur && itemRef.current) {
		itemRef.current.blur()
	}
}

const fetchSearchData = async ({
	selectState,
	value,
	page,
	onSearch,
	dataSourcePath,
	allowInfinityScroll,
	missingValues
}: {
	selectState: SelectStateTypes
	value: string
	page: number
	onSearch: any
	dataSourcePath: string
	allowInfinityScroll: boolean | undefined
	missingValues: number[] // used in select with pagination (allowInfinityScroll) when not all options are loaded during initialization
}) => {
	let newState = {}
	try {
		let collectedData: any[] = []
		if (page !== 1 && selectState.data) {
			collectedData = [...selectState.data].filter((data) => !collectedData.find((currentData) => currentData.value === data.value))
		}

		const newData: any = await onSearch(value, page, missingValues)
		const dataOptions = get(newData, dataSourcePath)
		if (newData.pagination || dataOptions) {
			const mergedData = [...collectedData]
			// filter duplicate values
			dataOptions.forEach((data: any) => {
				if (!mergedData.find((currentData) => currentData.value === data.value)) {
					mergedData.push(data)
				}
			})

			newState = { data: mergedData, pagination: newData.pagination, fetching: false }
		} else if (!allowInfinityScroll && isArray(newData)) {
			// NOTE: Výsledky sa nedoliepajú
			newState = { data: newData, fetching: false }
		} else {
			newState = {
				data: [],
				pagination: null,
				fetching: false,
				searchValue: ''
			}
		}
		if (newData.emptyText) {
			newState = {
				emptyText: newData.emptyText
			}
		}
	} catch (e) {
		newState = {
			data: [],
			pagination: null,
			fetching: false,
			searchValue: ''
		}
	}

	return newState
}

const AutocompleteField = (props: Props) => {
	const {
		input,
		size,
		placeholder,
		label,
		required,
		meta,
		showErrorWhenUntouched,
		hideHelp,
		options,
		tagRender,
		allowClear,
		style,
		showSearch,
		filterOption,
		suffixIcon,
		actions,
		disabled,
		notFoundContent,
		removeIcon,
		allowInfinityScroll,
		defaultValue,
		backgroundColor,
		clearIcon,
		className,
		open,
		showArrow,
		menuItemSelectedIcon,
		popupClassName,
		dropdownStyle,
		dropdownMatchSelectWidth = true,
		listHeight,
		emptyText,
		bordered,
		autoClearSearchValue,
		labelInValue,
		showAction,
		getPopupContainer,
		disableMenuItemSelectedIcon,
		readOnly,
		disableTpStyles = false,
		autoFocus,
		optionRender,
		dataSourcePath = 'data',
		onDidMountSearch,
		autoBlur,
		confirmSelection,
		confirmModalExtraTitle,
		onSelect,
		onClear,
		fieldMode = FIELD_MODE.INPUT
	} = props

	const localItemRef = useRef()
	const [t] = useTranslation()
	const itemRef = props.itemRef || localItemRef
	const [confVisibility, setConfVisibility] = useState<boolean>(false)
	const [onChangeValue, setOnChangeValue] = useState()
	const [onChangeAntdOptions, setOnChangeAntdOptions] = useState<any>()

	const [selectState, setSelectState] = useState<SelectStateTypes>({
		data: [],
		fetching: false,
		searchValue: '',
		emptyText: null,
		pagination: null
	})

	const renderDropdown = useCallback(
		(antdActions?: Action[] | null) => (menu: React.ReactElement) => {
			return customDropdown(antdActions, menu, selectState.fetching)
		},
		[selectState.fetching]
	)

	const handleSearch = useCallback(
		async (value = '', page = 1, missingValues = []) => {
			const onSearch = props.onSearch as any
			if (selectState.fetching) {
				return
			}
			if (onSearch) {
				setSelectState({ ...selectState, fetching: true, searchValue: value })
				const newState = await fetchSearchData({ selectState, value, page, onSearch, dataSourcePath, allowInfinityScroll, missingValues })
				setSelectState(newState)
			}
		},
		[selectState, allowInfinityScroll, dataSourcePath, props.onSearch]
	)

	const onSearchDebounced = useMemo(() => debounce(handleSearch, 300), [handleSearch])

	const onChange = useCallback(
		async (value: any, antdOptions: any) => {
			if (!input.onChange) return
			// if confirmSelection is active show confirmation modal and save selected option and value
			if (confirmSelection) {
				setOnChangeValue(value)
				setOnChangeAntdOptions(antdOptions)
				setConfVisibility(true)
				return
			}
			handleChange({ value, options: antdOptions, autoBlur, input, itemRef }, labelInValue)
		},
		[autoBlur, input, itemRef, confirmSelection, labelInValue]
	)

	const onScroll = useCallback(
		(e: any) => {
			let hasMore = true
			let nextPage = 1
			const { pagination, searchValue, fetching } = selectState

			if (pagination) {
				hasMore = pagination.page < pagination.totalPages
				nextPage = pagination.page + 1
			}
			if (Math.ceil(e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight && !fetching && hasMore) {
				handleSearch(searchValue, nextPage)
			}
		},
		[selectState, handleSearch]
	)

	const onDropdownVisibleChange = useCallback(
		(isOpen: boolean) => {
			const { onSearch } = props
			if (isOpen && onSearch) {
				// NOTE: Po vyhladani, vybrani polozky a znovu otvoreni ostavali vo vysledkoch stare vyhladane vysledky, nie 1. strana zo vsetkych
				handleSearch('', 1)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleSearch, props.onSearch]
	)

	const onBlur = () => {
		// NOTE: let the function empty
	}

	const onFocus = useCallback(
		(e: any) => {
			if (input.onFocus) {
				input.onFocus(e)
			}
		},
		[input]
	)

	useEffect(() => {
		if (onDidMountSearch) {
			handleSearch('', 1)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onDidMountSearch])

	/**
	 * check if initial selected values are all loaded
	 * only for select with pagination (allowInfinityScroll)
	 */
	const checkInitialSelectedValues = useRef(true)
	useEffect(() => {
		// options must be loaded and input value available to run the check
		if (!onDidMountSearch || !allowInfinityScroll || selectState.data?.length === 0 || !input.value || !checkInitialSelectedValues.current) return

		// check if all input values are loaded
		const values = isArray(input.value) ? new Set([...input.value]) : new Set([input.value])
		some(selectState.data, (item) => {
			values.delete(item.value)
			if (values.size === 0) return true
			return false
		})

		// refetch options if any value is missing
		if (values.size > 0) handleSearch('', 1, [...(values as never)])

		checkInitialSelectedValues.current = false
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input.value, selectState.data])

	const localFilterOption = (inputValue: any, option: any) => createSlug(option.label.toLowerCase()).indexOf(createSlug(inputValue.toLowerCase())) >= 0

	let value

	if (labelInValue && typeof input.value === 'object') {
		value = input.value.label
	} else {
		value = input.value === null || input.value === '' ? undefined : input.value
	}

	let opt = options
	if (isEmpty(options) && isEmpty(selectState.data)) {
		opt = []
	} else if (isEmpty(options)) {
		opt = selectState.data
	}

	let suffIcon
	if (!selectState.fetching) {
		if (showSearch && !suffixIcon) {
			suffIcon = <ArrowIcon className={'text-notino-black'} />
		} else if (suffixIcon) {
			suffIcon = suffixIcon
		} else {
			suffIcon = <ArrowIcon className={'text-notino-black'} />
		}
	}

	let notFound = notFoundContent
	if (emptyText || selectState.emptyText) {
		notFound = <Empty className={'m-4'} image={Empty.PRESENTED_IMAGE_SIMPLE} description={selectState.emptyText || emptyText} />
	}

	const onSelectWrap = useCallback(
		(v: string | ISelectOptionItem, optionItem: ISelectOptionItem) => {
			if (onSelect) {
				if (labelInValue) {
					return onSelect(optionItem, optionItem)
				}
				return onSelect(v, optionItem)
			}
			return undefined
		},
		[labelInValue, onSelect]
	)

	const autocompleteItem = (
		<Item
			label={label}
			required={required}
			style={style}
			className={cx(className, { 'form-item-disabled': disabled, readOnly })}
			help={(meta?.touched || showErrorWhenUntouched) && !hideHelp && isString(meta?.error) ? meta?.error : undefined}
			validateStatus={(meta?.touched || showErrorWhenUntouched) && meta?.error ? 'error' : undefined}
		>
			<AutoComplete
				bordered={bordered}
				style={{ backgroundColor }}
				className={cx({ 'noti-select-input': !disableTpStyles, rounded: backgroundColor, 'filter-select': fieldMode === FIELD_MODE.FILTER })}
				tagRender={tagRender}
				{...input}
				id={formFieldID(meta.form, input.name)}
				onFocus={onFocus}
				onChange={onChange}
				size={size || 'middle'}
				value={value}
				onBlur={onBlur}
				placeholder={placeholder || ''}
				clearIcon={clearIcon || <RemoveIcon className={'text-blue-600'} />}
				allowClear={allowClear}
				showSearch={showSearch}
				// NOTE: set to FALSE when we expect filtering on BE
				filterOption={filterOption && localFilterOption}
				onSearch={showSearch ? onSearchDebounced : undefined}
				suffixIcon={suffIcon}
				dropdownRender={props.dropdownRender || renderDropdown(actions)}
				disabled={disabled}
				removeIcon={removeIcon || <CloseIconSmall className={'text-blue-600'} />}
				notFoundContent={notFound}
				onPopupScroll={allowInfinityScroll ? onScroll : undefined}
				onDropdownVisibleChange={onDropdownVisibleChange}
				ref={itemRef as any}
				defaultValue={defaultValue}
				open={open}
				onSelect={onSelectWrap}
				showArrow={showArrow}
				menuItemSelectedIcon={renderMenuItemSelectedIcon(menuItemSelectedIcon, disableMenuItemSelectedIcon)}
				popupClassName={cx(`noti-select-dropdown ${popupClassName}`, { 'dropdown-match-select-width': dropdownMatchSelectWidth })}
				dropdownStyle={dropdownStyle}
				dropdownMatchSelectWidth={dropdownMatchSelectWidth}
				listHeight={listHeight}
				autoClearSearchValue={autoClearSearchValue}
				showAction={showAction}
				getPopupContainer={getPopupContainer}
				autoFocus={autoFocus}
				onClear={onClear}
				// NOTE: Do not show chrome suggestions dropdown and do not autofill this field when user picks chrome suggestion for other field
				{...{ autoComplete: 'new-password' }}
			>
				{getOptions(optionRender, opt, labelInValue, labelInValue && typeof input.value === 'object' ? input.value.value : undefined)}
			</AutoComplete>
		</Item>
	)

	return (
		<>
			{confirmSelection ? (
				<Popconfirm
					open={confVisibility}
					placement={'bottom'}
					title={
						<>
							<p className={'font-bold'}>{t('loc:Upozornenie!')}</p>
							{confirmModalExtraTitle}
						</>
					}
					okButtonProps={{
						type: 'default',
						className: 'noti-btn'
					}}
					cancelButtonProps={{
						type: 'primary',
						className: 'noti-btn'
					}}
					okText={t('loc:Potvrdiť')}
					onConfirm={() => {
						// change input value
						handleChange({ value: onChangeValue, options: onChangeAntdOptions, autoBlur, input, itemRef })
						// close conf modal
						setConfVisibility(false)
					}}
					cancelText={t('loc:Zrušiť')}
					onCancel={() => {
						setConfVisibility(false)
					}}
				>
					{autocompleteItem}
				</Popconfirm>
			) : (
				autocompleteItem
			)}
		</>
	)
}

export default AutocompleteField
