/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover } from 'antd'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon-16.svg'

// interfaces
import { ICalendarEmployeeReservationsPopover } from '../../../../types/interfaces'

/// utils
import { CALENDAR_VIEW } from '../../../../utils/enums'

// hooks
import useKeyUp from '../../../../hooks/useKeyUp'
import { serializeParams } from '../../../../hooks/useQueryParams'

const CalendarEmployeeReservationsPopover: FC<ICalendarEmployeeReservationsPopover> = (props) => {
	const { position, setIsOpen, data, isOpen, parentPath, query } = props

	const [t] = useTranslation()

	const handleClosePopover = useCallback(() => setIsOpen(false), [setIsOpen])

	useEffect(() => {
		const contentOverlay = document.querySelector('#nc-content-overlay') as HTMLElement

		const listener = (e: Event) => {
			const popoverLink = document.querySelector('#calendar-employees-reservation-popover-link')
			if ((e?.target as HTMLElement)?.id !== popoverLink?.id) {
				handleClosePopover()
			}
		}

		if (contentOverlay) {
			if (isOpen) {
				document.addEventListener('mousedown', listener)
				document.addEventListener('touchstart', listener)
				contentOverlay.style.display = 'block'
			} else {
				contentOverlay.style.display = 'none'
			}
		}

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [isOpen, handleClosePopover])

	useKeyUp('Escape', isOpen ? handleClosePopover : undefined)

	const getEmployeeLink = () => {
		if (!data?.date || !data?.employeeId) {
			return ''
		}
		const linkSearchParams = {
			...query,
			employeeIDs: data?.employeeId,
			view: CALENDAR_VIEW.DAY,
			date: data?.date
		}

		return `${parentPath}${t('paths:calendar')}?${queryString.stringify(serializeParams(linkSearchParams))}`
	}

	const linkToDayEmployeeDetail = getEmployeeLink()

	return (
		<Popover
			destroyTooltipOnHide={{ keepParent: true }}
			open={isOpen}
			placement={'left'}
			overlayClassName={'dark-style nc-popover-overlay nc-popover-overlay-fixed nc-popover-show'}
			content={
				linkToDayEmployeeDetail && (
					<div className='nc-popover-content text-notino-black w-60'>
						<main className={'m-2 overflow-y-auto relative flex items-center justify-between h-5 gap-2'}>
							<Link
								id={'calendar-employees-reservation-popover-link'}
								className={'p-0 m-0 text-white text-xs underline hover:no-underline whitespace-nowrap truncate'}
								to={linkToDayEmployeeDetail}
								target='_blank'
								rel='noreferrer'
								onClick={(e) => {
									e.stopPropagation()
									handleClosePopover()
								}}
							>
								{t('loc:Zobraziť rezervácie zamestnanca')}
							</Link>

							<button className={'nc-popover-header-button'} type={'button'} onClick={handleClosePopover}>
								<CloseIcon />
							</button>
						</main>
					</div>
				)
			}
		>
			<div style={{ top: position?.top, left: position?.left, width: position?.width, height: position?.height, position: 'fixed' }} />
		</Popover>
	)
}

export default CalendarEmployeeReservationsPopover
