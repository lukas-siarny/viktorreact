// validate password with rules
//	- min length is 8 characters: (?=.{8,})
//	- contains at least one lowercase letter: (?=.*[a-z]+)
//	- contains at least one uppercase letter: (?=.*[A-Z]+)
//	- contains at least one number: (?=.*\d+)

export const passwordRegEx = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/ // 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak
export const positiveIntegerRegEx = /^[0-9]+$/ // allow 0 on start, prevent + / - and exponential character
export const phoneRegEx = /^\d+$/
export const socialMediaRegex = {
	facebook: /^http[s]?:\/\/(www\.)?facebook\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/,
	instagram: /^http[s]?:\/\/(www\.)?instagram\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/,
	youtube: /^http[s]?:\/\/(www\.)?youtube\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/,
	tiktok: /^http[s]?:\/\/(www\.)?tiktok\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/,
	pinterest: /^http[s]?:\/\/(www\.)?pinterest\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/,
	website: /^http[s]?:\/\/(www\.)?[\S]{1,50}\.[a-zA-Z0-9()]{1,6}?\b([\S]{0,255})$/
}
// validate YYYY-MM-DD date format
export const dateRegex = /^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$/

// validate HH:mm time format
export const timeRegex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/

export const timeRegex = /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/

/**
 * @see https://ihateregex.io/expr/uuid/
 */
export const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
