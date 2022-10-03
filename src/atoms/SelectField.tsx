import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, FormAction, WrappedFieldProps } from 'redux-form'
import { useDispatch } from 'react-redux'
import cx from 'classnames'
import { debounce, filter, find, get, isArray, isEmpty, isString, last, map, size as length, some, take } from 'lodash'
import i18next from 'i18next'

// ant
import { Button, Divider, Empty, Form, Popconfirm, Select, Spin, Tooltip } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { FormItemProps } from 'antd/lib/form/FormItem'

// icons
import { ReactComponent as ArrowIcon } from '../assets/icons/select-arrow-icon.svg'
import { ReactComponent as CheckedIcon } from '../assets/icons/checkbox-checked-icon-24.svg'
import { ReactComponent as CloseIconSmall } from '../assets/icons/close-icon-16.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon.svg'

// utils
import { FIELD_MODE, FORM } from '../utils/enums'
import { createSlug, formFieldID } from '../utils/helper'

// assets
import { ReactComponent as LoadingIcon } from '../assets/icons/loading-icon.svg'

const { Item } = Form
const { Option } = Select

type Action = {
	title: string
	icon?: ReactNode
	onAction: () => void
}

export type Props = {
	update?: (value: any, ref: any) => FormAction
	actions?: Action[] | null
	allowInfinityScroll?: boolean
	maxTagLength?: number
	fieldMode?: FIELD_MODE
	maxTagsLimit?: number
	backgroundColor?: string
	showErrorWhenUntouched?: boolean
	hideHelp?: boolean
	hasExtra?: boolean
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
	onSelect?: (opt: any, option: any, value: any) => any
	optionRender?: any // custom render for item(option)
	formName?: FORM
	confirmSelection?: boolean
	confirmModalExtraTitle?: string
	tooltipSelect?: string | null
} & WrappedFieldProps &
	SelectProps<any> &
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

const setGetPopupContainer = (mode: Props['mode'], getPopupContainer: Props['getPopupContainer']) => {
	let popupContainer = (node: any) => node
	// ak je multiple alebo tags tak sa nastavuje pre .ant-select-selector overflow: auto, aby sa scrollovali selectnute multiple option v selecte preto sa nastavuje container na document.body (aby sa to vzdy z hora nemuselo posielat)
	if (mode === 'multiple' || mode === 'tags') {
		popupContainer = (node: any) => node.closest('.ant-drawer-body') || node.closest('.ant-modal-body') || document.body
	} else if (getPopupContainer) {
		// Ak existuje getPopupContainer nastav ho -> vacsinou v editovatelnych tabulkach sa posiela
		popupContainer = getPopupContainer
	}
	return popupContainer
}

const renderMenuItemSelectedIcon = (
	mode: Props['mode'],
	menuItemSelectedIcon: Props['menuItemSelectedIcon'],
	disableMenuItemSelectedIcon: Props['disableMenuItemSelectedIcon']
) => {
	// NOTE: menuItemSelectedIcon sa renderuje len ak je select typu tags / multiple alebo ak pretazim logiku a zhora ju poslem v prope menuItemSelectedIcon
	let icon: any
	if (menuItemSelectedIcon) {
		icon = menuItemSelectedIcon
	} else if (disableMenuItemSelectedIcon) {
		icon = null
	} else if ((mode === 'tags' || mode === 'multiple') && !disableMenuItemSelectedIcon) {
		icon = <CheckedIcon /> || menuItemSelectedIcon
	}
	return icon
}

const getOptions = (optionRender: any, options: any) =>
	map(options, (option) => (
		<Option
			key={option.key}
			value={option.value}
			disabled={option.disabled}
			label={option.label}
			extra={option.extra}
			className={option.className}
			style={option.level ? { paddingLeft: 16 * option.level } : undefined}
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

const handleChange = async (data: any) => {
	const { value, options, autoBlur, hasExtra, input, itemRef, maxTagLength, maxTagsLimit, mode, update } = data
	let val = value
	// NOTE condition for checking if select field has 'tags' mode with maxTagLength prop for checking length string of added tag
	// if input value's length is larger than maxTagLength, filter this value from tags
	if (mode === 'tags' && maxTagLength && length(last(value)) > maxTagLength) {
		val = filter(value, (v, i: number) => i !== value.length - 1)
	}
	// NOTE: extra data k value, key, label ak potrebujeme poslat ine data -> eg. pri reservacii sa neposiela ID travelera ale cely objekt
	if ((mode === 'tags' || mode === 'multiple') && hasExtra) {
		val = map(value, (valInput) => ({
			...valInput,
			extra: find(options, (item) => item.value === valInput.value)?.extra
		}))
	} else if (hasExtra && options?.extra) {
		val = {
			...value,
			extra: options?.extra
		}
	}
	if (maxTagsLimit && val?.length > maxTagsLimit) {
		val = take(val, maxTagsLimit)
	}
	await input.onChange(val === undefined ? null : val)
	if (update) {
		// NOTE: update prop for onSelect and onDeselect submitting form (eg. setting Tags)
		update(val, itemRef.current)
	}

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
		let collectedData = []
		if (page !== 1 && selectState.data) collectedData = selectState.data

		const newData: any = await onSearch(value, page, missingValues)
		const dataOptions = get(newData, dataSourcePath)
		if (newData.pagination || dataOptions) {
			const mergedData = [...collectedData, ...dataOptions]
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

const SelectField = (props: Props) => {
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
		loading,
		mode,
		tagRender,
		allowClear,
		style,
		showSearch,
		filterOption,
		suffixIcon,
		labelInValue,
		actions,
		disabled,
		notFoundContent,
		removeIcon,
		allowInfinityScroll,
		defaultValue,
		backgroundColor,
		clearIcon,
		className,
		optionLabelProp,
		open,
		showArrow,
		menuItemSelectedIcon,
		dropdownClassName,
		dropdownStyle,
		dropdownMatchSelectWidth = true,
		listHeight,
		emptyText,
		bordered,
		autoClearSearchValue,
		maxTagTextLength,
		showAction,
		getPopupContainer,
		disableMenuItemSelectedIcon,
		fieldMode = FIELD_MODE.INPUT,
		readOnly,
		disableTpStyles = false,
		autoFocus,
		optionRender,
		dataSourcePath = 'data',
		onDidMountSearch,
		update,
		maxTagLength,
		maxTagsLimit,
		autoBlur,
		hasExtra,
		formName,
		confirmSelection,
		confirmModalExtraTitle,
		onClear,
		tooltipSelect
	} = props

	const dispatch = useDispatch()
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
			handleChange({ value, options: antdOptions, autoBlur, hasExtra, input, itemRef, maxTagLength, maxTagsLimit, mode, update })
		},
		[autoBlur, hasExtra, input, itemRef, maxTagLength, maxTagsLimit, mode, update, confirmSelection]
	)

	const onSelectWrap = async (value: any, option: any) => {
		const { onSelect } = props
		if (onSelect) {
			let opt
			if ((mode === 'tags' || mode === 'multiple') && hasExtra) {
				opt = {
					...value,
					extra: find(options, (item) => Number(item.value) === value.value)?.extra
				}
			} else {
				opt = { ...value }
			}
			await onSelect(opt, option, input.value)
		}
	}

	const onDeselectWrap = async (value: any, option: any) => {
		const { onDeselect } = props
		if (onDeselect) {
			let val
			if ((mode === 'tags' || mode === 'multiple') && hasExtra) {
				val = {
					...value,
					extra: find(options, (item) => Number(item.value) === value.value)?.extra
				}
			}
			await onDeselect(val, option)
		}
	}

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
		if (values.size > 0) handleSearch('', 1, [...values])

		checkInitialSelectedValues.current = false
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [input.value, selectState.data])

	const localFilterOption = (inputValue: any, option: any) => createSlug(option.label.toLowerCase()).indexOf(createSlug(inputValue.toLowerCase())) >= 0

	const value = input.value === null || input.value === '' ? undefined : input.value

	let opt = options
	if (isEmpty(options) && isEmpty(selectState.data)) {
		opt = []
	} else if (isEmpty(options)) {
		opt = selectState.data
	}

	// select first option
	useEffect(() => {
		if (opt?.length === 1 && formName) {
			if (mode === 'tags' || mode === 'multiple') {
				dispatch(change(formName, input?.name, [opt[0]?.value]))
			} else {
				dispatch(change(formName, input?.name, opt[0]?.value))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opt, formName])

	let suffIcon
	if (!loading && !selectState.fetching) {
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

	const select = (
		<Select
			bordered={bordered}
			style={{ backgroundColor }}
			className={cx({ 'noti-select-input': !disableTpStyles, rounded: backgroundColor, 'filter-select': fieldMode === FIELD_MODE.FILTER })}
			tagRender={tagRender}
			mode={mode}
			{...input}
			id={formFieldID(meta.form, input.name)}
			onFocus={onFocus}
			onChange={onChange}
			size={size || 'middle'}
			// if is only one option select it
			value={value}
			onBlur={onBlur}
			placeholder={placeholder || ''}
			loading={loading || selectState.fetching}
			clearIcon={clearIcon || <RemoveIcon className={'text-blue-600'} />}
			allowClear={allowClear}
			showSearch={showSearch}
			// NOTE: set to FALSE when we expect filtering on BE
			filterOption={filterOption && localFilterOption}
			onSearch={showSearch ? onSearchDebounced : undefined}
			suffixIcon={suffIcon}
			labelInValue={labelInValue}
			dropdownRender={props.dropdownRender || renderDropdown(actions)}
			disabled={disabled}
			removeIcon={removeIcon || <CloseIconSmall className={'text-blue-600'} />}
			notFoundContent={notFound}
			onPopupScroll={allowInfinityScroll ? onScroll : undefined}
			onDropdownVisibleChange={onDropdownVisibleChange}
			ref={itemRef as any}
			defaultValue={defaultValue}
			optionLabelProp={optionLabelProp}
			open={open}
			onDeselect={onDeselectWrap}
			onSelect={onSelectWrap}
			showArrow={showArrow}
			menuItemSelectedIcon={renderMenuItemSelectedIcon(mode, menuItemSelectedIcon, disableMenuItemSelectedIcon)}
			dropdownClassName={cx(`noti-select-dropdown ${dropdownClassName}`, { 'dropdown-match-select-width': dropdownMatchSelectWidth })}
			dropdownStyle={dropdownStyle}
			dropdownMatchSelectWidth={dropdownMatchSelectWidth}
			listHeight={listHeight}
			autoClearSearchValue={autoClearSearchValue}
			maxTagTextLength={maxTagTextLength}
			showAction={showAction}
			getPopupContainer={setGetPopupContainer(mode, getPopupContainer)}
			autoFocus={autoFocus}
			onClear={onClear}
			// NOTE: Do not show chrome suggestions dropdown and do not autofill this field when user picks chrome suggestion for other field
			{...{ autoComplete: 'new-password' }}
		>
			{getOptions(optionRender, opt)}
		</Select>
	)

	const selectItem = (
		<Item
			label={label}
			required={required}
			style={style}
			className={cx(className, { 'form-item-disabled': disabled, readOnly })}
			help={(meta?.touched || showErrorWhenUntouched) && !hideHelp && isString(meta?.error) ? meta?.error : undefined}
			validateStatus={(meta?.touched || showErrorWhenUntouched) && meta?.error ? 'error' : undefined}
		>
			{tooltipSelect ? <Tooltip title={tooltipSelect}>{select}</Tooltip> : select}
		</Item>
	)

	return (
		<>
			{confirmSelection ? (
				<Popconfirm
					visible={confVisibility}
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
						handleChange({ value: onChangeValue, options: onChangeAntdOptions, autoBlur, hasExtra, input, itemRef, maxTagLength, maxTagsLimit, mode, update })
						// close conf modal
						setConfVisibility(false)
					}}
					cancelText={t('loc:Zrušiť')}
					onCancel={() => {
						setConfVisibility(false)
					}}
				>
					{selectItem}
				</Popconfirm>
			) : (
				selectItem
			)}
		</>
	)
}

export default SelectField
