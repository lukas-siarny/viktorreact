import React from 'react'
import {
	first,
	floor,
	forEach,
	get,
	includes,
	inRange,
	isArray,
	isEmpty,
	isFinite,
	isInteger,
	isNaN,
	isNil,
	isNumber,
	mapValues,
	orderBy,
	pick,
	round,
	some,
	split,
	toNumber,
	chain,
	lowerCase,
	isString,
	replace,
	map,
	size,
	filter,
	trimEnd,
	repeat
} from 'lodash'
import { notification, Tag } from 'antd'
import slugify from 'slugify'
import { submit, SubmissionError } from 'redux-form'
import { isEmail, isIpv4, isIpv6, isNaturalNonZero, isNotNumeric } from 'lodash-checkit'
import i18next from 'i18next'
import dayjs, { Dayjs } from 'dayjs'
import { ArgsProps } from 'antd/lib/notification'
// eslint-disable-next-line import/no-cycle
import showNotifications from './tsxHelpers'
import {
	DEFAULT_DATE_FORMAT,
	DEFAULT_DATE_WITH_TIME_FORMAT,
	DEFAULT_TIME_FORMAT,
	FORM,
	INVALID_DATE_FORMAT,
	MSG_TYPE,
	DEFAULT_LANGUAGE,
	BYTE_MULTIPLIER,
	MONDAY_TO_FRIDAY,
	DAY,
	LANGUAGE,
	EN_DATE_WITH_TIME_FORMAT,
	EN_DATE_WITHOUT_TIME_FORMAT,
	SALON_STATES,
	IMAGE_UPLOADING_PROP,
	DEFAULT_PHONE_PREFIX,
	QUERY_LIMIT,
	NOTIFICATION_TYPE,
	ADMIN_PERMISSIONS,
	SALON_PERMISSION,
	SALON_CREATE_TYPES,
	DEFAULT_DATE_TIME_OPTIONS
} from './enums'
import { IPrice, ISelectOptionItem, IStructuredAddress, IDateTimeFilterOption, CountriesData, IAuthUserPayload, IEmployeePayload } from '../types/interfaces'
import { phoneRegEx } from './regex'

import { Paths } from '../types/api'

import { ReactComponent as LanguageIcon } from '../assets/icons/language-icon-16.svg'
// eslint-disable-next-line import/no-cycle
import { LOCALES } from '../components/LanguagePicker'

export const preventDefault = (e: any) => e?.preventDefault?.()

/**
 * Zakóduj dáta do base64 stringu, pre použitie v url query parametry
 */
// NOTE: https://stackoverflow.com/a/26603875
export const encodeBackDataQuery = (any: any) => {
	let encoded
	if (any) {
		const string = JSON.stringify(any)
		if (string) {
			encoded = btoa(encodeURIComponent(string))
		}
	}
	return encoded
}

export const decodeBackDataQuery = (base64?: string | null) => {
	let decoded = null
	try {
		if (base64) {
			const decodedString = decodeURIComponent(atob(base64))
			decoded = JSON.parse(decodedString)
		}
	} catch (e) {
		decoded = null
	}
	return decoded
}

export const getLinkWithEncodedBackUrl = (link: string) => {
	if (!window.location.search) {
		return link
	}
	const backUrl = btoa(`${window.location.pathname}${window.location.search}`)
	return `${link}?backUrl=${backUrl}`
}

export const toNormalizeQueryParams = (queryParams: any, allowQueryParams: string[]) => {
	const pickQueryParams = pick(queryParams, Object.values(allowQueryParams))

	return mapValues(pickQueryParams, (val) => {
		let normalizeVal
		if (val === undefined || val === null || val === '' || isArray(val)) {
			normalizeVal = val
		} else if (val === 'true' || val === true) {
			normalizeVal = true
		} else if (val === 'false' || val === false) {
			normalizeVal = false
		} else if (get(val, 'length') > 1 && first(val) === '0') {
			normalizeVal = decodeURIComponent(val)
		} else {
			const number = toNumber(val)
			normalizeVal = isNaN(number) ? decodeURIComponent(val) : number
		}
		return normalizeVal
	})
}

/**
 * @param date Date
 * @param locale iso country code sk,cz,en,... etc.
 * @return string
 *
 * Returns formatted date by location
 */
export const formatDateByLocale = (date?: string | Date | Dayjs | null, skipTime?: boolean): string | null | undefined => {
	if (!date) {
		return date
	}
	const locale = i18next.language || DEFAULT_LANGUAGE

	if (locale === LANGUAGE.SK || locale === LANGUAGE.CZ) {
		return dayjs(date).format(skipTime ? DEFAULT_DATE_FORMAT : DEFAULT_DATE_WITH_TIME_FORMAT)
	}
	return dayjs(date).format(skipTime ? EN_DATE_WITHOUT_TIME_FORMAT : EN_DATE_WITH_TIME_FORMAT)
}

/**
 * @param date Date
 * @param placeholder String
 * @param format DEFAULT_DATE_FORMAT
 * @return string
 *
 * Returns formatted date
 */
export const formatDate = (date: string | Date | undefined | Dayjs, placeholder = INVALID_DATE_FORMAT, format = DEFAULT_DATE_FORMAT) => {
	if (!date) {
		return placeholder
	}
	// ISO 8601
	if (!dayjs(date, undefined, true).isValid()) {
		return INVALID_DATE_FORMAT
	}
	return dayjs(date).format(format)
}

/**
 * Returns e.g. "UTC+05:00"
 * @param timezoneName
 */
export const formatUTCOffset = (timezoneName?: any) => (timezoneName ? `UTC${dayjs().tz(timezoneName).format('Z')}` : '-')

/**
 * @param date
 * @param placeholder
 * @return string
 *
 * Returns formatted date with time
 */
export const formatDateWithTime = (date?: any, placeholder = '-') => {
	// ISO 8601
	if (!dayjs(date, undefined, true).isValid()) {
		return placeholder
	}
	return dayjs(date).format(DEFAULT_DATE_WITH_TIME_FORMAT)
}

/**
 * @param date
 * @return string
 *
 * Returns formatted time without date infromations eg. 14:35
 */
export const formatTime = (date?: string) => {
	// ISO 8601
	if (!dayjs(date, undefined, true).isValid()) {
		return '-'
	}
	return dayjs(date).format(DEFAULT_TIME_FORMAT)
}

/**
 * @param date
 * @return string
 *
 * Returns formatted date with day name eg. nedeľa, 7. január
 */
export const formatDateWithDayName = (date?: string) => {
	if (!dayjs(date, undefined, true).isValid()) {
		return '-'
	}
	return dayjs(date).format('dddd, D.MMMM')
}

export const translateMessageType = (msgType: MSG_TYPE) => {
	switch (msgType) {
		case MSG_TYPE.ERROR:
			return i18next.t('loc:Chyba')
		case MSG_TYPE.WARNING:
			return i18next.t('loc:Upozornenie')
		case MSG_TYPE.SUCCESS:
			return i18next.t('loc:Úspešné')
		case MSG_TYPE.INFO:
			return i18next.t('loc:Info')
		default:
			return ''
	}
}

export const translateDayName = (day: DAY | typeof MONDAY_TO_FRIDAY, shortName?: boolean) => {
	switch (day) {
		case DAY.MONDAY:
			return shortName ? i18next.t('loc:Po') : i18next.t('loc:Pondelok')
		case DAY.TUESDAY:
			return shortName ? i18next.t('loc:Ut') : i18next.t('loc:Utorok')
		case DAY.WEDNESDAY:
			return shortName ? i18next.t('loc:St') : i18next.t('loc:Streda')
		case DAY.THURSDAY:
			return shortName ? i18next.t('loc:Štv') : i18next.t('loc:Štvrtok')
		case DAY.FRIDAY:
			return shortName ? i18next.t('loc:Pia') : i18next.t('loc:Piatok')
		case DAY.SATURDAY:
			return shortName ? i18next.t('loc:So') : i18next.t('loc:Sobota')
		case DAY.SUNDAY:
			return shortName ? i18next.t('loc:Ne') : i18next.t('loc:Nedeľa')
		case MONDAY_TO_FRIDAY:
			return shortName ? i18next.t('loc:Po - Pia') : i18next.t('loc:Pondelok - Piatok')
		default:
			return ''
	}
}

export const createSlug = (value: string, separator = '-', lower = true) => {
	if (value) {
		return slugify(value, {
			replacement: separator,
			lower
		})
	}
	return ''
}

export const normalizeQueryParams = (queryParams: any) =>
	mapValues(queryParams, (queryParam) => {
		if (queryParam === '' || isNil(queryParam)) {
			return undefined
		}
		return queryParam
	})

// Number validators
export const validationNumber = (value: string) => !isNaturalNonZero(value) && i18next.t('loc:Nie je validná číselná hodnota')
export const validationDecimalNumber = (value: number) => isNotNumeric(value) && i18next.t('loc:Nie je validná číselná hodnota')
export const validationIntegerNumber = (value: string | number) => value && !isInteger(Number(value)) && i18next.t('loc:Nie je validná číselná hodnota')
export const validationNumberMin = (min: number) => (value: any) => isFinite(value) && value < min && i18next.t('loc:Zadajte minimálne {{min}}', { min })
export const validationNumberMax = (max: number) => (value: any) => isFinite(value) && value > max && i18next.t('loc:Zadajte maximálne {{max}}', { max: floor(max, 2) })

// IP validators
export const validationIP = (value: string) => !isIpv4(value) && !isIpv6(value) && i18next.t('loc:Nie je validná IP')

export const validationNumberRange = (range: { from: number; to: number }, optional?: boolean) => (value: number) => {
	// NOTE: .000001 because of end of the range is not equal to range.to in inRange lodash function
	if (optional && (value === null || value === undefined)) {
		return null
	}
	return !inRange(value, range.from, range.to + 0.000001) && i18next.t(`loc:Nie je v rozsahu od ${range.from} do ${range.to}`)
}

// String validators
export const validationString = (maxLength: number) => (value: string) => get(value, 'length') > maxLength && i18next.t('loc:Max. počet znakov je {{max}}', { max: maxLength })
export const validationStringFixLength = (length: number, optional?: boolean) => (value: string) => {
	if (optional && !get(value, 'length')) {
		return null
	}
	return get(value, 'length') !== length && i18next.t('loc:Počet znakov musí byť {{length}}', { length })
}

export const validationEmail = (value: any) => value && !isEmail(value) && i18next.t('loc:Nesprávny formát emailovej adresy')

// Other validators
export const validationRequired = (value: string) => !value && i18next.t('loc:Toto pole je povinné')

export const validationPastDate = (date: any) => date && dayjs(date).isBefore(dayjs()) && i18next.t('loc:Dátum nesmie byť v minulosti')
export const validationDateBefore = (compareDate: string | undefined) => (date: string) =>
	date && compareDate && dayjs(date).isBefore(compareDate) && i18next.t('loc:Zvolený dátum nesmie byť pred dátumom {{ compareDate }}', { compareDate: formatDate(compareDate) })

export const validationRequiredNumber = (value: any) => (isNil(value) || isNaN(value)) && i18next.t('loc:Toto pole je povinné')

export const validationOptionsRequired = (value: string) => isEmpty(value) && i18next.t('loc:Vyberte aspoň jednu z možností')
export const validateArray = (key: string) => (values: any) => {
	const hasSome = some(values, (value) => !!get(value, key))
	return !hasSome && i18next.t('loc:Názov musí byť vyplnení pre aspoň jeden jazyk')
}

export const validationPhone = (value: string) => value && !phoneRegEx.test(value) && i18next.t('loc:Telefónne číslo nie je platné')

export const normalizeDirectionKeys = (direction: 'ascend' | 'descend' | null | undefined) => (direction === 'descend' ? 'DESC' : 'ASC')
export const normalizeASCDESCKeys = (direction: string) => (direction === 'DESC' ? 'descend' : 'ascend')

export const setOrder = (order: string | null | undefined, colName: string) => {
	const [name, direction] = split(order || '', ':')
	let result
	if (name === colName) {
		result = normalizeASCDESCKeys(direction)
	}
	return result as 'descend' | 'ascend' | undefined
}

const dotNotate = (obj: any, target?: any, prefix?: any, pathSeparator = '.') => {
	// eslint-disable-next-line
	target = target || {}
	// eslint-disable-next-line no-param-reassign
	prefix = prefix || ''
	// eslint-disable-next-line
	Object.keys(obj).forEach((key) => {
		if (!isNaN(Number(key))) {
			const newKey = `[${key}]`
			const oldValue = obj[key]
			// eslint-disable-next-line
			delete obj.key
			// eslint-disable-next-line
			obj[newKey] = oldValue
			// eslint-disable-next-line
			if (typeof prefix === 'string' || prefix instanceof String) {
				// eslint-disable-next-line
				if (prefix.charAt(prefix.length - 1) === '.') prefix = prefix.substring(0, prefix.length - 1)
			}
		}
	})
	// eslint-disable-next-line
	Object.keys(obj).forEach((key) => {
		if (typeof obj[key] === 'object') {
			dotNotate(obj[key], target, `${prefix + key}${pathSeparator}`, pathSeparator)
		} else {
			// eslint-disable-next-line
			return (target[prefix + key] = obj[key])
		}
	})

	return target
}

export const formFieldID = (form?: FORM | string, name?: string) => {
	let id
	if (form && name) {
		// NOTE: element can't be queried if id contains dots
		const fieldSelector = chain(name)
			.filter((char) => char !== ']')
			.map((char) => (char === '[' || char === '.' ? '-' : char))
			.value()
			.join('')
		id = `${form}-${fieldSelector}`
	}
	return id
}

export const scrollToFirstError = (errors: any, form: FORM | string) => {
	const getDotNotation = dotNotate(errors, null, `${form}-`, '.')
	const els: any = []
	forEach(Object.keys(getDotNotation), (errName) => {
		const el = document.getElementById(errName)
		if (el && el.getBoundingClientRect) {
			els.push({
				id: errName,
				value: el.getBoundingClientRect().top
			})
		}
	})
	const sortedErrors = orderBy(els, ['value'], ['asc'])
	if (!isEmpty(sortedErrors)) {
		const el = document.getElementById(get(sortedErrors, '[0].id'))
		if (el?.scrollIntoView) {
			el.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			})
		}
	}
}

export const getPrefixCountryCode = (options: string[], fallback: string = DEFAULT_PHONE_PREFIX) => {
	const locale = split(lowerCase(i18next.language), '-')
	const language = locale[1] || locale[0]
	let prefix = fallback.toUpperCase()

	some(options, (item) => {
		if (!includes(language, lowerCase(item))) return false
		prefix = item
		return true
	})

	return prefix
}

export function setIntervalImmediately(func: Function, interval: number) {
	func()
	return setInterval(func, interval)
}

export const getGoogleMapUrl = (): string => {
	// query params for google API
	const base = 'https://maps.googleapis.com/maps/api/'
	// TODO read Google Map API key from .env file
	const key = `key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
	const language = `language=${i18next.language.toLowerCase()}`

	return `${base}js?${key}&libraries=places&${language}`
}

/**
 * @see https://medium.com/@almestaadmicadiab/how-to-parse-google-maps-address-components-geocoder-response-774d1f3375d
 */
export const parseAddressComponents = (addressComponents: any[] = []): IStructuredAddress => {
	const address: IStructuredAddress = {
		streetNumber: null,
		zip: null,
		street: null,
		city: null,
		country: null,
		houseNumber: null
	}

	if (!isEmpty(addressComponents)) {
		const addressProperties = {
			streetNumber: ['street_number'],
			houseNumber: ['premise'],
			zip: ['postal_code'],
			street: ['street_address', 'route'],
			city: ['locality', 'sublocality', 'political', 'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3', 'sublocality_level_4'],
			country: ['country']
		}

		addressComponents.forEach((component: any) => {
			Object.keys(addressProperties).forEach((shouldBe) => {
				if (addressProperties[shouldBe as keyof IStructuredAddress].indexOf(component.types[0]) !== -1) {
					if (shouldBe === 'country') {
						address[shouldBe] = component.short_name
					} else {
						address[shouldBe as keyof IStructuredAddress] = component.long_name
					}
				}
			})
		})
	}

	return address
}

export const fromStringToFloat = (string: string | number | null | undefined): number | null => {
	let result
	if (string && isString(string)) {
		result = parseFloat(replace(string, ',', '.').replace(' ', ''))
	} else if (string) {
		result = Number(string)
	} else {
		result = null
	}

	return result
}

/**
 * Returns null - e.g. input was cleared
 *
 * Returns NaN - e.g. input value is "asdf"
 */
export const transformNumberFieldValue = (rawValue: number | string | undefined | null, min?: number, max?: number, precision?: number, notNullValue?: boolean) => {
	let result = null
	const value = typeof rawValue === 'string' ? fromStringToFloat(rawValue) : rawValue
	if (!value && notNullValue) {
		result = min
	}
	if (isNumber(value) && isFinite(value)) {
		if (isNumber(min) && value < min) {
			result = min
		} else if (isNumber(max) && value > max) {
			result = max
		} else if (isNumber(min) && isNumber(max) && value >= min && value <= max) {
			result = value
		}
	} else if (Number.isNaN(value)) {
		result = NaN
	}

	if (isFinite(result) && isNumber(precision)) {
		result = round(result as number, precision)
	}

	return result
}

/**
 * Transforms number to normalized form
 * @param {number} price
 * @returns {{ exponent: number, significand: number }}
 */
export const encodePrice = (price: number): IPrice => {
	const stringPrice = `${price}`

	let exponent = 0
	const significand = +trimEnd(stringPrice.replace('.', ''), '0')

	if (price % 1 !== 0) {
		exponent = -stringPrice.split('.')[1].length
	} else {
		const reversedSplittedStringPrice = stringPrice.split('').reverse()

		some(reversedSplittedStringPrice, (char) => {
			if (char === '0') {
				exponent += 1

				return false
			}

			return true
		})
	}

	return {
		exponent,
		significand
	}
}

/**
 * Transforms normalized form to number
 * @param {IPrice | null} [price]
 * @returns {number}
 */
export const decodePrice = (price?: IPrice | null): number | null | undefined => {
	if (price === null) {
		return null
	}

	if (price === undefined) {
		return undefined
	}

	const stringPrice = `${price.significand}`

	if (price.exponent < 0) {
		const index = stringPrice.length + price.exponent
		return +`${stringPrice.substring(0, index)}.${stringPrice.substring(index)}`
	}

	return +(stringPrice + repeat('0', price.exponent))
}

export const getMaxSizeNotifMessage = (maxFileSize: any) => {
	let notifMaxSize
	if (maxFileSize >= BYTE_MULTIPLIER.MEGA) {
		notifMaxSize = [maxFileSize / BYTE_MULTIPLIER.MEGA, 'MB']
	} else {
		notifMaxSize = [maxFileSize / BYTE_MULTIPLIER.KILO, 'KB']
	}
	return {
		type: MSG_TYPE.ERROR,
		message: i18next.t('loc:Súbor je príliš veľký (max. {{size}} {{unit}})', {
			size: notifMaxSize[0],
			unit: notifMaxSize[1]
		})
	}
}

type ImgUploadData = { uid: string; path: string } & Paths.PostApiB2BAdminFilesSignUrls.Responses.$200['files'][0]
export type ImgUploadParam = { [key: string]: ImgUploadData }

export const getImagesFormValues = (fileList: any, filesData: ImgUploadParam) => {
	const values = map(fileList, (file) => {
		const fileData = filesData[get(file, 'uid')]

		let img = {
			...file,
			url: get(file, 'url') || fileData?.path
		}

		if (get(file, 'resizedImages')) {
			img = {
				...img,
				thumbUrl: fileData?.resizedImages?.thumbnail
			}
		}

		if (get(file, 'id') || fileData?.id) {
			img = {
				...img,
				id: get(file, 'id') || fileData?.id
			}
		}
		if (fileData?.signedUrl) {
			img = {
				...img,
				signedUrl: fileData?.signedUrl
			}
		}
		return img
	})
	return values
}

export const getServiceRange = (from: number | undefined | null, to: number | undefined | null, unit = '') => {
	if (isNil(from) && isNil(to)) {
		return null
	}

	if (isNil(to)) {
		return `${from || ''} ${unit}`
	}

	if (from === to) {
		return `${from} ${unit}`
	}

	return `${from || ''} - ${to || ''} ${unit}`
}

export const isValidDateRange = (from: string, to: string) => {
	const dateFrom = dayjs(from)
	const dateTo = dayjs(to)
	return dateTo.diff(dateFrom) > 0 // 'from' must be smaller than 'to'
}

export const checkFiltersSizeWithoutSearch = (formValues: any) => size(filter(formValues, (value, key) => (!isNil(value) || !isEmpty(value)) && key !== 'search'))

export const checkFiltersSize = (formValues: any) => size(filter(formValues, (value) => !isNil(value) || !isEmpty(value)))

type NameLocalizationsItem = {
	language: string
	value?: string | null
}

/**
 * add default language to the first position
 * or
 * move default language to the first position
 */
export const normalizeNameLocalizations = (nameLocalizations: NameLocalizationsItem[]) => {
	return Object.keys(LOCALES)
		.sort((a: string, b: string) => {
			if (a === DEFAULT_LANGUAGE) {
				return -1
			}
			return b === DEFAULT_LANGUAGE ? 1 : 0
		})
		.map((language) => {
			const value = nameLocalizations.find((localization) => localization.language === language)
			return { language, value: value?.value || null }
		})
}

type SelectDataItem = {
	id: string
	children?: any
	name?: string | undefined
}

export const getSelectOptionsFromData = (data: SelectDataItem[] | null, useOnly: number[] | string[] = []) => {
	if (!data) return []

	let source = data

	if (useOnly.length > 0) {
		source = data.filter((item: SelectDataItem) => useOnly.includes(item.id as never))
	}

	return map(source, (item) => {
		return { ...item, label: item.name, value: item.id, key: item.id, children: item.children }
	})
}

export const showErrorNotification = (errors: any, dispatch: any, submitError: any, props: any, customMessage?: ArgsProps) => {
	if (errors && props.form) {
		scrollToFirstError(errors, props.form)
		const errorKeys = Object.keys(errors)

		// Error invoked during image uploading has custom notification
		if (errorKeys.length === 1 && errorKeys[0] === IMAGE_UPLOADING_PROP) {
			return undefined
		}

		const isErrors: boolean = errorKeys.length > 1
		return notification.error(
			customMessage || {
				message: i18next.t('loc:Chybne vyplnený formulár'),
				description: i18next.t(
					`loc:Skontrolujte správnosť vyplnených polí vo formulári. Vo formulári sa ${isErrors ? i18next.t('nachádzajú chyby') : i18next.t('nachádza chyba')}!`
				)
			}
		)
	}
	return undefined
}

export const showServiceCategory = (category: any): string | undefined => {
	if (category?.child?.child) {
		return category.child.child.name
	}
	if (category?.child) {
		return category.child.name
	}
	return category?.name
}

/**
 * Recursively flatten a nested array of any depth
 * and
 * optionally map output
 */
export const flattenTree = (array: any[], callback?: (item: any, level: number) => any, nestingKey = 'children', levelOfDepth = 0) => {
	let output: any[] = []

	array.forEach((item: any) => {
		output.push(callback ? callback(item, levelOfDepth) : item)
		output = output.concat(flattenTree(item[nestingKey] || [], callback, nestingKey, levelOfDepth + 1))
	})

	return output
}

export const isEnumValue = <T extends { [k: string]: string }>(checkValue: any, enumObject: T): checkValue is T[keyof T] =>
	typeof checkValue === 'string' && Object.values(enumObject).includes(checkValue)

export const getCountryPrefix = (countriesData: CountriesData | null, countryCode?: string) => {
	const country = countriesData?.find((c) => c.code.toLocaleLowerCase() === countryCode?.toLocaleLowerCase())
	return country?.phonePrefix
}

export const getCountryNameFromNameLocalizations = (nameLocalizations?: { value: string | null; language: string }[], currentLng = DEFAULT_LANGUAGE) => {
	const countryTranslation = nameLocalizations?.find((translation) => translation.language === currentLng)
	return countryTranslation?.value
}

// salon status tags
export const getSalonTagPublished = (salonStatus?: SALON_STATES) => {
	if (!salonStatus) {
		return null
	}

	switch (salonStatus) {
		case SALON_STATES.PUBLISHED:
		case SALON_STATES.PUBLISHED_PENDING:
		case SALON_STATES.PUBLISHED_DECLINED:
			return (
				<Tag className={'noti-tag bg-status-published'}>
					<span>{i18next.t('loc:Publikovaný')}</span>
				</Tag>
			)
		default:
			return (
				<Tag className={'noti-tag bg-status-notPublished'}>
					<span>{i18next.t('loc:Nepublikovaný')}</span>
				</Tag>
			)
	}
}

export const getSalonTagDeleted = (deleted?: boolean, returnOnlyDeleted = false) => {
	if (deleted) {
		return (
			<Tag className={'noti-tag danger'}>
				<span>{i18next.t('loc:Vymazaný')}</span>
			</Tag>
		)
	}

	if (returnOnlyDeleted) {
		return null
	}

	return (
		<Tag className={'noti-tag info'}>
			<span>{i18next.t('loc:Nevymazaný')}</span>
		</Tag>
	)
}

export const getSalonTagChanges = (salonStatus?: SALON_STATES) => {
	if (!salonStatus) {
		return null
	}

	switch (salonStatus) {
		case SALON_STATES.NOT_PUBLISHED_PENDING:
		case SALON_STATES.PUBLISHED_PENDING:
			return (
				<Tag className={'noti-tag bg-status-pending'}>
					<span>{i18next.t('loc:Na schválenie')}</span>
				</Tag>
			)
		case SALON_STATES.NOT_PUBLISHED_DECLINED:
		case SALON_STATES.PUBLISHED_DECLINED:
			return (
				<Tag className={'noti-tag bg-status-declined'}>
					<span>{i18next.t('loc:Zamietnuté')}</span>
				</Tag>
			)
		default:
			return null
	}
}

export const getSalonTagCreateType = (salonStatus?: SALON_STATES, createType?: SALON_CREATE_TYPES) => {
	if (salonStatus && createType) {
		if (salonStatus === SALON_STATES.PUBLISHED && createType === SALON_CREATE_TYPES.NON_BASIC) {
			return (
				<Tag className={'noti-tag bg-status-premium text-color-white'}>
					<span>{i18next.t('loc:PREMIUM')}</span>
				</Tag>
			)
		}

		if (createType === SALON_CREATE_TYPES.BASIC) {
			return (
				<Tag className={'noti-tag bg-status-basic'}>
					<span>{i18next.t('loc:BASIC')}</span>
				</Tag>
			)
		}
	}
	return null
}
/**
 * Remove accent and transform to lower case
 * Usefull for searching on FE
 * @link https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
 */
export const transformToLowerCaseWithoutAccent = (source?: string): string =>
	source
		? source
				.toLowerCase()
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
		: ''

export const sortData = (a?: any, b?: any) => {
	if (!isNil(a) && !isNil(b)) {
		const aValue = typeof a === 'string' ? transformToLowerCaseWithoutAccent(a) : a
		const bValue = typeof b === 'string' ? transformToLowerCaseWithoutAccent(b) : b

		if (aValue < bValue) {
			return -1
		}
		if (aValue > bValue) {
			return 1
		}
	}

	return 0
}

export const optionRenderWithImage = (itemData: any, fallbackIcon?: React.ReactNode, imageWidth = 24, imageHeight = 24) => {
	const { label, extra } = itemData
	const style = { width: imageWidth, height: imageHeight }
	return (
		<div className='flex items-center'>
			{extra?.image ? (
				<img className={'option-render-image'} style={style} src={extra.image} alt={label} />
			) : (
				<div className={'option-render-image fallback-icon'} style={style}>
					{fallbackIcon}
				</div>
			)}
			{label}
		</div>
	)
}

export const langaugesOptionRender = (itemData: any) => {
	const { value, label, flag } = itemData
	return (
		<div className='flex items-center'>
			{flag ? (
				<img className='noti-flag w-6 mr-1 rounded' src={flag} alt={value} />
			) : (
				<div className={'noti-flag mr-1'}>
					<LanguageIcon />
				</div>
			)}
			{label}
		</div>
	)
}

export const formatLongQueryString = (search: string, limit?: number) => {
	const maxQueryLimit = limit || QUERY_LIMIT.MAX_255
	let formattedSearch = search
	if (search.length > maxQueryLimit) {
		formattedSearch = search.slice(0, maxQueryLimit)
	}
	return formattedSearch
}

export const checkUploadingBeforeSubmit = (values: any, dispatch: any, props: any) => {
	const { form } = props

	if (values && values[IMAGE_UPLOADING_PROP]) {
		const error = i18next.t('loc:Prebieha nahrávanie')
		showNotifications([{ type: MSG_TYPE.ERROR, message: error }], NOTIFICATION_TYPE.NOTIFICATION)
		throw new SubmissionError({
			[IMAGE_UPLOADING_PROP]: error
		})
	} else {
		dispatch(submit(form))
	}
}

export const hasAuthUserPermissionToEditRole = (
	salonID?: string,
	authUser?: IAuthUserPayload['data'],
	employee?: IEmployeePayload['data'],
	salonRoles?: ISelectOptionItem[]
): { hasPermission: boolean; tooltip: string | null } => {
	const result: { hasPermission: boolean; tooltip: string | null } = {
		hasPermission: false,
		tooltip: i18next.t('loc:Pre túto akciu nemáte dostatočné oprávnenia.')
	}

	if (!salonID || !authUser || !employee || !salonRoles) {
		return result
	}

	if (authUser.uniqPermissions?.some((permission) => [...ADMIN_PERMISSIONS, SALON_PERMISSION.PARTNER_ADMIN].includes(permission as any))) {
		// admin and super admin roles have access to all salons, so salons array in authUser data is empty (no need to list there all existing salons)
		result.hasPermission = true
		result.tooltip = null
		return result
	}
	if (authUser.id === employee?.employee?.user?.id) {
		// salon user can't edit his own role
		result.tooltip = i18next.t('loc:Nemôžeš editovať svoju rolu')
		return result
	}

	const authUserSalonRole = authUser.salons?.find((salon) => salon.id === salonID)?.role
	if (authUserSalonRole) {
		const authUserRoleIndex = salonRoles.findIndex((role) => role?.value === authUserSalonRole?.id)
		if (authUserRoleIndex === 0) {
			// is salon admin - has all permissions
			result.hasPermission = true
			result.tooltip = null
			return result
		}

		const employeeRole = employee.employee?.role
		const employeeRoleIndex = salonRoles.findIndex((role) => role?.value === employeeRole?.id)
		// it's not possible to edit admin role	if auth user is not admin
		if (employeeRoleIndex === 0) {
			return result
		}
		// it's possible to edit role only if you have permission to edit
		if (authUserSalonRole?.permissions.find((permission) => permission.name === SALON_PERMISSION.USER_ROLE_EDIT)) {
			result.hasPermission = true
			result.tooltip = null
			return result
		}
		return result
	}
	return result
}

export const filterSalonRolesByPermission = (salonID?: string, authUser?: IAuthUserPayload['data'], salonRoles?: ISelectOptionItem[]) => {
	if (!salonID || !authUser || !salonRoles) {
		return salonRoles
	}

	if (authUser?.uniqPermissions?.some((permission) => [...ADMIN_PERMISSIONS, SALON_PERMISSION.PARTNER_ADMIN].includes(permission as any))) {
		// admin and super admin roles have access to all salons, so salons array in authUser data is empty (no need to list there all existing salons)
		// they automatically see all options
		return salonRoles
	}
	// other salon roles can assign only options that they have permission on
	const authUserSalonRole = authUser?.salons?.find((salon) => salon.id === salonID)?.role
	if (authUserSalonRole) {
		const highestUserRoleIndex = salonRoles.findIndex((role) => role?.value === authUserSalonRole?.id)
		if (highestUserRoleIndex === 0) {
			// is admin - has permission to asign all roles
			return salonRoles
		}
		// lower roles can assign all roles execpt admin
		const authUserDisabledRolesOptions = salonRoles.slice(0, 1).map((option) => ({ ...option, disabled: true }))
		const authUserAllowedRolesOptions = salonRoles.slice(1)
		return [...authUserDisabledRolesOptions, ...authUserAllowedRolesOptions]
	}

	return salonRoles
}

/**
 * Split array into two arrays by condition.
 * Example: splitArrayByCondition([1, 2, 5, 2, 9], (item) => item > 2) => [[5, 9], [1, 2, 2]]
 */
export const splitArrayByCondition = (source: any[], condition: (item: any) => boolean): any[][] => {
	return source.reduce(
		([pass, fail], item) => {
			return condition(item) ? [[...pass, item], fail] : [pass, [...fail, item]]
		},
		[[], []]
	)
}

export const getSalonFilterRanges = (values?: IDateTimeFilterOption[]): { [key: string]: Dayjs[] } => {
	const options = values ?? Object.values(DEFAULT_DATE_TIME_OPTIONS())
	const now = dayjs()
	return options.reduce((ranges, value) => {
		return {
			...ranges,
			[value.name]: [now.subtract(value.value, value.unit), now]
		}
	}, {})
}
