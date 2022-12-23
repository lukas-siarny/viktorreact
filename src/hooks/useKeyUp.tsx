import { useEffect } from 'react'

const useKeyUp = (keyName = 'Enter', onKeyUp?: () => void) => {
	useEffect(() => {
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === keyName && onKeyUp) {
				onKeyUp()
			}
		}
		if (onKeyUp) {
			document.addEventListener('keyup', handleKeyUp, false)
		}
		return () => {
			document.removeEventListener('keyup', handleKeyUp, false)
		}
	}, [onKeyUp, keyName])
}

export default useKeyUp
