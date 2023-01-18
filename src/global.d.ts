declare module 'lodash-checkit' {
	export const isEmail: (email: string) => boolean
	export const isNaturalNonZero: (value: string) => boolean
	export const isNatural: (value: string) => boolean
	export const isNotNumeric: (value: number) => boolean
	export const isIpv4: (value: string) => boolean
	export const isIpv6: (value: string) => boolean
}

declare module 'moment' {
	import { Dayjs } from 'dayjs'

	namespace moment {
		type Moment = Dayjs
	}
	export = moment
	export as namespace moment
}

declare module 'react-flagpack' {
	interface Props {
		code: string
		size?: string
		gradient?: 'top-down' | 'real-circular' | 'real-linear'
		hasBorder?: boolean
		hasDropShadow?: boolean
		hasBorderRadius?: boolean
		className?: string
	}

	export default class Flag extends React.PureComponent<Props, any> {}
}

declare module 'tailwindcss/colors' {
	export const black: string
	export const white: string
	export const rose: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const pink: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const fuchsia: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const purple: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const violet: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const indigo: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const blue: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const lightBlue: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const cyan: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const emerald: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const green: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const lime: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const yellow: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const amber: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const orange: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const red: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const warmGray: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const gray: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const blueGray: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
	export const neutral: { '100': string; '200': string; '300': string; '400': string; '500': string; '600': string; '700': string; '800': string; '900': string; '50': string }
}

interface Window {
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
}
