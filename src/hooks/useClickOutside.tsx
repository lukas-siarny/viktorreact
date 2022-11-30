import { useEffect, RefObject } from 'react'

type Event = MouseEvent | TouchEvent

const useOnClickOutside = (refsArray: RefObject<HTMLElement>[], handler: (event: Event) => void) => {
	useEffect(() => {
		const listener = (event: Event) => {
			if (
				refsArray?.length &&
				refsArray.some((ref) => {
					const el = ref?.current
					if (!el || el.contains((event?.target as Node) || null)) {
						return true
					}
					return false
				})
			) {
				return
			}

			handler(event) // Call the handler only if the click is outside of the element passed.
		}

		document.addEventListener('mousedown', listener)
		document.addEventListener('touchstart', listener)

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [refsArray, handler]) // Reload only if ref or handler changes
}

export default useOnClickOutside
