// NOTE: Nova verzia i18 pridala pre typ t aj nullable hodnotu a aby to vsade nepadalo (doteraz volo string | undefined) tak sa nullable hodnota vypina
// https://www.i18next.com/overview/typescript#argument-of-type-defaulttfuncreturn-is-not-assignable-to-parameter-of-type-xyz
import 'i18next'

declare module 'i18next' {
	interface CustomTypeOptions {
		returnNull: false
	}
}
