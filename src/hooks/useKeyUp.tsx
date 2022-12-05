import { useCallback, useEffect } from 'react'

const useKeyUp = (keyName = 'Enter', onKeyUp: () => void) => {
	const handleKeyUp = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === keyName) {
				onKeyUp()
			}
		},
		[onKeyUp, keyName]
	)

	useEffect(() => {
		document.addEventListener('keyup', handleKeyUp, false)
		return () => {
			document.removeEventListener('keyup', handleKeyUp, false)
		}
	}, [handleKeyUp])
}

export default useKeyUp
