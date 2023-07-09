import { EN_SECTIONS, SK_SECTIONS } from './enums'

export const getWindow = () => {
	if (typeof window !== 'undefined') {
		return window
	}
	return null
}

export const getSections = (langauge: string) => {
	switch (langauge) {
		case 'en':
			return EN_SECTIONS
		case 'sk':
			return SK_SECTIONS
		default:
			return null
	}
}
