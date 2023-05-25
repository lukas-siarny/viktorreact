import React, { FC } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { TFunction } from 'i18next'
import { ColumnProps } from 'antd/es/table'

// assets
import { ReactComponent as CheckedPinkIcon } from '../../../../assets/icons/check-current-color.svg'

// types
import { IServicesListCategory, IServicesListService } from '../../../../reducers/services/serviceActions'
import { HandleServicesReorderFunc } from '../../../../types/interfaces'

// utils
import { getLinkWithEncodedBackUrl, parseServiceRowKey } from '../../../../utils/helper'

// components
import { AvatarGroup } from '../../../../components/AvatarComponents'
import IconTooltip from '../../../../atoms/IconTooltip'
import CustomTable from '../../../../components/CustomTable'

type SevicesTableProps = {
	category: IServicesListCategory
	parentPath?: string
	reorderView: boolean
	disabledRS?: boolean
	parentIndexes: [number, number]
	handleReorder: HandleServicesReorderFunc
}

const lineIcon = <span className={'text-notino-grayDark'}>{'—'}</span>

const checkerCell = (checked: boolean) => {
	return (
		<div className={cx('w-full h-full flex items-center justify-center')}>{checked ? <CheckedPinkIcon width={16} height={16} className={'text-notino-pink'} /> : lineIcon}</div>
	)
}

const getTableColumns = (t: TFunction, disabledRS?: boolean): ColumnProps<IServicesListService>[] => [
	{
		title: <span className={'truncate block'}>{t('loc:Služba')}</span>,
		dataIndex: 'name',
		key: 'name',
		ellipsis: true
	},
	{
		title: t('loc:Trvanie služby'),
		dataIndex: 'duration',
		key: 'duration',
		ellipsis: true,
		className: 'noti-light-pink-col'
	},
	{
		title: t('loc:Cena služby'),
		dataIndex: 'price',
		key: 'price',
		ellipsis: true,
		className: 'noti-light-pink-col'
	},
	{
		title: <span className={cx('transition transition-opacity duration-200', { 'opacity-50': disabledRS })}>{t('loc:Zamestnanec')}</span>,
		dataIndex: 'employees',
		key: 'employees',
		className: 'noti-medium-pink-col',
		render: (_value, record) => {
			const value = record.employees
			return value.length ? (
				<div className={cx('w-full h-full flex items-center transition transition-opacity duration-200', { 'opacity-50': disabledRS })}>
					<AvatarGroup maxCount={4} avatars={value} maxPopoverPlacement={'right'} size={'small'} />
				</div>
			) : (
				<div className={'w-full h-full flex items-center'}>{lineIcon}</div>
			)
		}
	},
	{
		title: (
			<div className={cx('flex items-center gap-1 transition transition-opacity duration-200', { 'opacity-50': disabledRS })}>
				<span className={'truncate inline-block'}>{t('loc:Online rezervácie')}</span>
				<IconTooltip
					title={t('loc:Online rezervácie')}
					text={t(
						'loc:Ak máte zapnutý rezervačný systém, k službe priradeného aspoň 1 kolegu a zapnutú online rezerváciu, zákazníci majú možnosť rezervovať si termín online.'
					)}
				/>
			</div>
		),
		dataIndex: 'isAvailableForOnlineReservations',
		key: 'isAvailableForOnlineReservations',
		className: 'noti-medium-pink-col',
		render: (_value, record) => checkerCell(record.isAvailableForOnlineReservations)
	},
	{
		title: (
			<div className={cx('flex w-full items-center gap-1 transition transition-opacity duration-200', { 'opacity-50': disabledRS })}>
				<span className={'truncate inline-block'}>{t('loc:Auto. potvrdenie')}</span>
				<IconTooltip
					title={t('loc:Automatické potvrdenie')}
					text={t('loc:Online rezervácia bude zákazníkovi v Notino aplikácii automaticky schválená, nemusíte ju už ručne potvrdzovať.')}
				/>
			</div>
		),
		dataIndex: 'automaticApproval',
		key: 'automaticApproval',
		render: (_value, record) => checkerCell(record.automaticApproval)
	}
]

const ServicesList: FC<SevicesTableProps> = React.memo((props) => {
	const { category, parentPath, reorderView, disabledRS, handleReorder, parentIndexes } = props
	const navigate = useNavigate()
	const [t] = useTranslation()

	const handleDrop = (oldId: string, newId?: string) => {
		if (newId) {
			const oldIndex = category.services.data.findIndex((s) => s.id === parseServiceRowKey(oldId).serviceID)
			const newIndex = category.services.data.findIndex((s) => s.id === parseServiceRowKey(newId).serviceID)
			handleReorder([...parentIndexes, oldIndex], newIndex)
		}
	}

	return (
		<CustomTable<IServicesListService>
			className={cx('table-fixed noti-services-settings-table', { 'disabled-rs': disabledRS })}
			wrapperClassName={'overflow-hidden'}
			columns={getTableColumns(t, disabledRS)}
			dataSource={category.services.data}
			pagination={false}
			rowKey={'key'}
			dnd={
				reorderView
					? {
							dndDrop: handleDrop,
							dndColWidth: 36
					  }
					: undefined
			}
			rowClassName={reorderView ? undefined : 'clickable-row'}
			onRow={
				reorderView
					? undefined
					: (record) => ({
							onClick: () => {
								if (parentPath) {
									navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID: record.id })))
								}
							}
					  })
			}
		/>
	)
})

export default React.memo(ServicesList)