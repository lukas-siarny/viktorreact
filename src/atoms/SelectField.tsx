import React, { PureComponent, ReactNode } from 'react'
import { FormAction, WrappedFieldProps } from 'redux-form'
import cx from 'classnames'
import { debounce, filter, find, get, isArray, isEmpty, isNil, isString, last, map, size as length, take } from 'lodash'

// ant
import { Button, Divider, Empty, Form, Select, Spin, Typography } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { FormItemProps } from 'antd/lib/form/FormItem'
import i18next from 'i18next'
import { createSlug, formFieldID } from '../utils/helper'
// icons
import { ReactComponent as ArrowIcon } from '../assets/icons/select-arrow-icon.svg'
import { ReactComponent as CheckedIcon } from '../assets/icons/checkbox-checked-icon-24.svg'
import { ReactComponent as CloseIconSmall } from '../assets/icons/close-icon-16.svg'
import { ReactComponent as RemoveIcon } from '../assets/icons/remove-select-icon.svg'
import { ReactComponent as PlusIcon } from '../assets/icons/plus-icon.svg'

import { FIELD_MODE } from '../utils/enums'
import { ReactComponent as LoadingIcon } from '../assets/icons/loading-icon.svg'

const { Item } = Form
const { Option, OptGroup } = Select

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
} & WrappedFieldProps &
	SelectProps<any> &
	FormItemProps

type IPagination = {
	limit: number
	page: number
	totalPages: number
	totalCount: number
}

export default class SelectField extends PureComponent<Props> {
	// eslint-disable-next-line react/sort-comp
	onBlur = () => {
		// NOTE: let the function empty
	}

	itemRef: any

	state = {
		data: [],
		fetching: false,
		searchValue: '',
		emptyText: null,
		pagination: null as IPagination | null
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onSearchDebounced: (value: string, page?: number) => any

	constructor(props: Props) {
		super(props)
		this.itemRef = this.props.itemRef || React.createRef()

		this.onSearchDebounced = debounce(this.onSearch, 300)
		if (props.onDidMountSearch) {
			this.onSearch('', 1)
		}
	}

	renderDropdown = (actions?: Action[] | null) => (menu: React.ReactElement) => {
		const divider = isEmpty(actions) ? null : <Divider style={{ margin: 0 }} />

		return (
			<Spin
				style={{ margin: '10px', justifyContent: 'flex-start' }}
				indicator={<LoadingIcon className={'loading-spinner text-blue-600'} />}
				className={'flex-center'}
				tip={'Načítavam...'}
				spinning={this.state.fetching}
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

	onSearch = async (value: string, page = 1) => {
		const onSearch = this.props.onSearch as any
		const { dataSourcePath = 'data', allowInfinityScroll } = this.props

		const { fetching } = this.state
		if (fetching) {
			return
		}
		if (onSearch) {
			try {
				const collectedData = page === 1 ? [] : this.state.data
				this.setState({ fetching: true, searchValue: value })

				const data: any = await onSearch(value, page)
				const dataOptions = get(data, dataSourcePath)

				if (data.pagination || dataOptions) {
					const mergedData = [...collectedData, ...dataOptions]
					this.setState({ data: mergedData, pagination: data.pagination, fetching: false })
				} else if (!allowInfinityScroll && isArray(data)) {
					// NOTE: Výsledky sa nedoliepajú
					this.setState({ data, fetching: false })
				} else {
					this.setState({
						data: [],
						pagination: null,
						fetching: false,
						searchValue: ''
					})
				}
				if (data.emptyText) {
					this.setState({
						emptyText: data.emptyText
					})
				}
			} catch (e) {
				this.setState({
					data: [],
					pagination: null,
					fetching: false,
					searchValue: ''
				})
			}
		}
	}

	onChange = async (value: any, options: any) => {
		const { input, update, maxTagLength, maxTagsLimit, mode, autoBlur, hasExtra } = this.props
		if (input.onChange) {
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
				update(val, this.itemRef.current)
			}

			if (autoBlur && this.itemRef.current) {
				this.itemRef.current.blur()
			}
		}
	}

	onSelectWrap = async (value: any, option: any) => {
		const { mode, onSelect, options, hasExtra, input } = this.props
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

	onDeselectWrap = async (value: any, option: any) => {
		const { mode, onDeselect, options, hasExtra } = this.props
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

	filterOption = (inputValue: any, option: any) => createSlug(option.label.toLowerCase()).indexOf(createSlug(inputValue.toLowerCase())) >= 0

	onScroll = (e: any) => {
		const { fetching, searchValue, pagination } = this.state

		let hasMore = true
		let nextPage = 1
		if (pagination) {
			hasMore = pagination.page < pagination.totalPages
			nextPage = pagination.page + 1
		}
		if (Math.ceil(e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight && !fetching && hasMore) {
			this.onSearch(searchValue, nextPage)
		}
	}

	onDropdownVisibleChange = (isOpen: boolean) => {
		const { onSearch } = this.props
		if (isOpen && onSearch) {
			// NOTE: Po vyhladani, vybrani polozky a znovu otvoreni ostavali vo vysledkoch stare vyhladane vysledky, nie 1. strana zo vsetkych
			this.onSearch('', 1)
		}
	}

	onFocus = (e: any) => {
		const { input } = this.props

		if (input.onFocus) {
			input.onFocus(e)
		}
	}

	render() {
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
			autoFocus
		} = this.props
		const { fetching, data } = this.state

		const value = input.value === null || input.value === '' ? undefined : input.value

		let opt = options
		if (isEmpty(options) && isEmpty(data)) {
			opt = []
		} else if (isEmpty(options)) {
			opt = data
		}

		let suffIcon
		if (!loading && !fetching) {
			if (showSearch && !suffixIcon) {
				suffIcon = <ArrowIcon className={'text-blue-600'} />
			} else if (suffixIcon) {
				suffIcon = suffixIcon
			} else {
				suffIcon = <ArrowIcon className={'text-blue-600'} />
			}
		}

		const dropdownRender = this.props.dropdownRender || this.renderDropdown(actions)
		const onScroll = allowInfinityScroll ? this.onScroll : undefined

		const contentOpts = map(opt, (option) => (
			<Option key={option.key} value={option.value} disabled={option.disabled} label={option.label} extra={option.extra}>
				{option.label}
			</Option>
		))

		let notFound = notFoundContent
		if (emptyText || this.state.emptyText) {
			notFound = <Empty className={'m-4'} image={Empty.PRESENTED_IMAGE_SIMPLE} description={this.state.emptyText || emptyText} />
		}

		const setGetPopupContainer = () => {
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
		const renderMenuItemSelectedIcon = () => {
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
		return (
			<Item
				label={label}
				required={required}
				style={style}
				className={cx(className, { 'form-item-disabled': disabled, readOnly })}
				help={(meta?.touched || showErrorWhenUntouched) && !hideHelp && isString(meta?.error) ? meta?.error : undefined}
				validateStatus={(meta?.touched || showErrorWhenUntouched) && meta?.error ? 'error' : undefined}
			>
				<Select
					bordered={bordered}
					style={{ backgroundColor }}
					className={cx({ 'noti-select-input': !disableTpStyles, rounded: backgroundColor, 'filter-select': fieldMode === FIELD_MODE.FILTER })}
					tagRender={tagRender}
					mode={mode}
					{...input}
					id={formFieldID(meta.form, input.name)}
					onFocus={this.onFocus}
					onChange={this.onChange}
					size={size || 'middle'}
					value={value}
					onBlur={this.onBlur}
					placeholder={placeholder || ''}
					loading={loading || fetching}
					clearIcon={clearIcon || <RemoveIcon className={'text-blue-600'} />}
					allowClear={allowClear}
					showSearch={showSearch}
					filterOption={filterOption && this.filterOption}
					onSearch={showSearch ? this.onSearchDebounced : undefined}
					suffixIcon={suffIcon}
					labelInValue={labelInValue}
					dropdownRender={dropdownRender}
					disabled={disabled}
					removeIcon={removeIcon || <CloseIconSmall className={'text-blue-600'} />}
					notFoundContent={notFound}
					onPopupScroll={onScroll}
					onDropdownVisibleChange={this.onDropdownVisibleChange}
					ref={this.itemRef as any}
					defaultValue={defaultValue}
					optionLabelProp={optionLabelProp}
					open={open}
					onDeselect={this.onDeselectWrap}
					onSelect={this.onSelectWrap}
					showArrow={showArrow}
					menuItemSelectedIcon={renderMenuItemSelectedIcon()}
					dropdownClassName={cx(`noti-select-dropdown ${dropdownClassName}`, { 'dropdown-match-select-width': dropdownMatchSelectWidth })}
					dropdownStyle={dropdownStyle}
					dropdownMatchSelectWidth={dropdownMatchSelectWidth}
					listHeight={listHeight}
					autoClearSearchValue={autoClearSearchValue}
					maxTagTextLength={maxTagTextLength}
					showAction={showAction}
					getPopupContainer={setGetPopupContainer()}
					autoFocus={autoFocus}
					// NOTE: Do not show chrome suggestions dropdown and do not autofill this field when user picks chrome suggestion for other field
					{...{ autoComplete: 'new-password' }}
				>
					{contentOpts}
				</Select>
			</Item>
		)
	}
}
