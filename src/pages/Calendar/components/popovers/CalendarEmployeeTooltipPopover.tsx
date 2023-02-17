/* eslint-disable import/no-cycle */
import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover } from 'antd'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon-16.svg'
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down-currentColor-12.svg'

// interfaces
import { ICalendarEmployeeTooltipPopover } from '../../../../types/interfaces'

/// utils
import { CALENDAR_VIEW } from '../../../../utils/enums'

// hooks
import { serializeParams } from '../../../../hooks/useQueryParams'
import { getAssignedUserLabel } from '../../../../utils/helper'

const CalendarEmployeeTooltipPopover: FC<ICalendarEmployeeTooltipPopover> = (props) => {
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

	const getEmployeeLink = () => {
		if (!data?.date || !data?.employee) {
			return ''
		}
		const linkSearchParams = {
			...query,
			employeeIDs: data?.employee.id,
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
				linkToDayEmployeeDetail &&
				data?.employee && (
					<div className='nc-popover-content text-notino-black min-w-40 max-w-xl'>
						<main className={'flex itmes-center m-2 relative w-full relative mr-10'}>
							<Link
								id={'calendar-employees-reservation-popover-link'}
								className={'flex gap-1 overflow-hidden items-center'}
								to={linkToDayEmployeeDetail}
								target='_blank'
								rel='noreferrer'
								onClick={(e) => {
									e.stopPropagation()
									handleClosePopover()
								}}
							>
								<span className={'p-0 m-0 text-white truncate'}>
									{`${t('loc:Zobraziť rezervácie zamestnanca')}
								${getAssignedUserLabel({
									firstName: data.employee.firstName,
									lastName: data.employee.lastName,
									email: data.employee.email,
									id: data.employee.id
								})}`}
								</span>
								<ChevronDownIcon className='shrink-0' width={10} height={10} color={'#fff'} style={{ transform: 'rotate(-90deg)' }} />
							</Link>

							<button className={'nc-popover-header-button absolute right-4 top-0'} type={'button'} onClick={handleClosePopover}>
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

export default CalendarEmployeeTooltipPopover
