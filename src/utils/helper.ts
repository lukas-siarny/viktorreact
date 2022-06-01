/* eslint-disable import/no-cycle */
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
	filter
} from 'lodash'
import { notification } from 'antd'
import slugify from 'slugify'
import { isEmail, isIpv4, isIpv6, isNaturalNonZero, isNotNumeric } from 'lodash-checkit'
import i18next from 'i18next'
import dayjs, { Dayjs } from 'dayjs'
import {
	DEFAULT_DATE_FORMAT,
	DEFAULT_DATE_WITH_TIME_FORMAT,
	DEFAULT_TIME_FORMAT,
	FORM,
	INVALID_DATE_FORMAT,
	MSG_TYPE,
	DEFAULT_LANGUAGE,
	GOOGLE_MAPS_API_KEY,
	BYTE_MULTIPLIER,
	MONDAY_TO_FRIDAY,
	DAY,
	LOCALES,
	LANGUAGE,
	EN_DATE_WITH_TIME_FORMAT
} from './enums'
import { IStructuredAddress } from '../types/interfaces'
import { phoneRegEx } from './regex'

import { Paths } from '../types/api'
import { RootState } from '../reducers'

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
export const formatDateByLocale = (date: string | Date | undefined | Dayjs) => {
	const locale = (LOCALES[i18next.language as LANGUAGE] || LOCALES[DEFAULT_LANGUAGE]).ISO_639

	if (locale === LOCALES[LANGUAGE.SK].ISO_639 || locale === LOCALES[LANGUAGE.CZ].ISO_639) {
		return dayjs(date).format(DEFAULT_DATE_WITH_TIME_FORMAT)
	}
	return dayjs(date).format(EN_DATE_WITH_TIME_FORMAT)
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

export const validationPhone = (value: string) => !phoneRegEx.test(value) && i18next.t('loc:Telefónne číslo nie je platné')

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

export const getPrefixCountryCode = (options: string[], fallback: string) => {
	const locale = split(lowerCase(i18next.language), '-')
	const language = locale[1] || locale[0]
	let prefix = fallback

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

export const getCurrentLanguageCode = (fallbackLng = DEFAULT_LANGUAGE) => {
	const locale = split(i18next.language, '-')
	const result = locale[0] || fallbackLng
	return result.toLowerCase()
}

export const getGoogleMapUrl = (): string => {
	const locale = getCurrentLanguageCode()

	// query params for google API
	const base = 'https://maps.googleapis.com/maps/api/'
	// TODO read Google Map API key from .env file
	const key = `key=${GOOGLE_MAPS_API_KEY}`
	const language = `language=${locale.toLowerCase()}`

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

		return {
			...file,
			id: get(file, 'id') || fileData?.id,
			url: get(file, 'url') || fileData?.path,
			signedUrl: fileData?.signedUrl
		}
	})
	return values
}

export const getServiceRange = (from: number, to?: number, unit = '') => {
	if (!to) return `${from}${unit}+`
	if (from === to) return `${from}${unit}`
	return `${from} - ${to}${unit}`
}

export const isValidDateRange = (from: string, to: string) => {
	const dateFrom = dayjs(from)
	const dateTo = dayjs(to)
	return dateTo.diff(dateFrom) > 0 // 'from' must be smaller than 'to'
}

export const checkFiltersSizeWithoutSearch = (formValues: any) => size(filter(formValues, (value, key) => (!isNil(value) || !isEmpty(value)) && key !== 'search'))
export const checkFiltersSize = (formValues: any) => size(filter(formValues, (value) => !isNil(value) || !isEmpty(value)))

export const convertCountriesToLocalizations = (countries: RootState['enumerationsStore']['countries'], defaultLanguageName?: string) => {
	const fieldValues = map(countries.data, (country) => ({
		language: lowerCase(country.code)
	}))

	if (!defaultLanguageName) return fieldValues

	const defaultLanguage = { language: defaultLanguageName }
	const otherLanguages = filter(fieldValues, (field) => field.language !== defaultLanguageName)

	// default language must be first
	return [defaultLanguage, ...otherLanguages]
}

type NameLocalizationsItem = {
	language: string
}

/**
 * add default language to the first position
 * or
 * move default language to the first position
 */
export const normalizeNameLocalizations = (nameLocalizations: NameLocalizationsItem[], defaultLanguageName?: string) => {
	let defaultLanguage = { language: defaultLanguageName }
	const otherLanguages: any = []
	forEach(nameLocalizations, (localization) => {
		if (localization.language === defaultLanguageName) {
			defaultLanguage = localization
		} else {
			otherLanguages.push(localization)
		}
	})
	return [defaultLanguage, ...otherLanguages]
}

type SelectDataItem = {
	id: number
	children?: any
	name?: string | undefined
}

export const getSelectOptionsFromData = (data: SelectDataItem[] | null) => {
	if (!data) return []

	return map(data, (item) => {
		return { ...item, label: item.name, value: item.id, key: item.id, children: item.children }
	})
}

export const getDefaultFormCategories = (id: number | undefined, categories: any, parentCategories: any = []): any => {
	if (!id) return []
	for (let index = 0; index < categories.length; index += 1) {
		const currentCategories = [...parentCategories, categories[index]]
		if (categories[index].id === id) return currentCategories // if id is found return current category and all parents
		if (categories[index].children) return getDefaultFormCategories(id, categories[index].children, currentCategories)
	}
	return parentCategories
}

export const showErrorNotification = (errors: any, dispatch: any, submitError: any, props: any) => {
	if (errors && props.form) {
		scrollToFirstError(errors, props.form)
		const isErrors: boolean = Object.keys(errors).length > 1
		return notification.error({
			message: i18next.t('loc:Chybne vyplnený formulár'),
			description: i18next.t(
				`loc:Skontrolujte správnosť vyplnených polí vo formulári. Vo formulári sa ${isErrors ? i18next.t('nachádzajú chyby') : i18next.t('nachádza chyba')}!`
			)
		})
	}
	return undefined
}
