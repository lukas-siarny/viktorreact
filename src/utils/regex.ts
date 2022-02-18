// validate password with rules
//	- min length is 8 characters: (?=.{8,})
//	- contains at least one lowercase letter: (?=.*[a-z]+)
//	- contains at least one uppercase letter: (?=.*[A-Z]+)
//	- contains at least one number: (?=.*\d+)

const passwordRegEx = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/ // 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak
export const positiveIntegerRegEx = /^[0-9]+$/ // allow 0 on start, prevent + / - and exponential character
export default passwordRegEx
