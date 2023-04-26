import React, { useEffect, useState, FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Spin, Button, Tooltip, Collapse, TooltipProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Link, useNavigate } from 'react-router-dom'
import { TFunction } from 'i18next'
import cx from 'classnames'
import { debounce } from 'lodash'

// components
import { ColumnProps } from 'antd/es/table'
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import { AvatarGroup } from '../../components/AvatarComponents'
import Alert from '../../components/Dashboards/Alert'
import SwitchField from '../../atoms/SwitchField'
import ServicesStats from './components/ServicesStats'

// utils
import { PERMISSION, STRINGS } from '../../utils/enums'
import { getLinkWithEncodedBackUrl } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices, IServicesListCategory, IServicesListInudstry, IServicesListService } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, PatchSettingsBody, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as InfoIcon16 } from '../../assets/icons/info-icon-16.svg'
import { ReactComponent as DragIcon } from '../../assets/icons/drag-icon.svg'
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg'
import { ReactComponent as ChevronPink } from '../../assets/icons/chevron-pink.svg'
import { ReactComponent as InfoNotinoIcon } from '../../assets/icons/info-notino-icon.svg'
import { ReactComponent as CheckedPinkIcon } from '../../assets/icons/checkbox-checked-pink.svg'
import { patchReq } from '../../utils/request'

const { Panel } = Collapse

const getExpandIcon = (isActive: boolean, size = 24) => (
	<ChevronDown
		width={size}
		height={size}
		color={'#000'}
		style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease-in-out', transformOrigin: 'center' }}
	/>
)

type InfoTooltipProps = {
	title: React.ReactNode
	text: React.ReactNode
	tooltipProps?: TooltipProps
}

const InfoTooltip: FC<InfoTooltipProps> = React.memo((props) => {
	const { title, text, tooltipProps = {} } = props

	return (
		<Tooltip
			align={{ points: ['br', 'tr'] }}
			arrow={true}
			overlayClassName={'min-w-72 noti-tooltip-light'}
			trigger={'click'}
			{...tooltipProps}
			title={
				<>
					<h4 className={'mb-0 text-xs text-notino-black'}>{title}</h4>
					<p className={'mb-0 text-xs'} style={{ color: '#6D7483' }}>
						{text}
					</p>
				</>
			}
		>
			<InfoIcon16 className={'mr-2 cursor-pointer shrink-0'} />
		</Tooltip>
	)
})

const checkerCell = (checked: boolean, disabled?: boolean) => {
	return (
		<div className={cx('w-full h-full flex items-center justify-center transition transition-opacity duration-200', { 'opacity-50': disabled })}>
			{checked ? (
				<CheckedPinkIcon width={16} height={16} className={cx('transition duration-200', { 'text-notino-gray': disabled, 'text-notino-pink': !disabled })} />
			) : (
				<div className={'w-4 h-4 border border-solid border-notino-grayDark rounded-lg'} />
			)}
		</div>
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
				'-'
			)
		}
	},
	{
		title: (
			<div className={cx('flex items-center gap-1 transition transition-opacity duration-200', { 'opacity-50': disabledRS })}>
				<span className={'truncate inline-block'}>{t('loc:Online rezervácie')}</span>
				<InfoTooltip
					title={t('loc:Online rezervácie')}
					text={t(
						'loc:Ak máte zapnutý rezervačný systém, k službe priradeného aspoň 1 kolegu a zapnutú online rezerváciu, zákazníci majú možnosť rezervovať si termín online. '
					)}
				/>
			</div>
		),
		dataIndex: 'isAvailableForOnlineReservations',
		key: 'isAvailableForOnlineReservations',
		className: 'noti-medium-pink-col',
		render: (_value, record) => checkerCell(record.isAvailableForOnlineReservations, disabledRS)
	},
	{
		title: (
			<div className={'flex w-full items-center gap-1'}>
				<span className={'truncate inline-block'}>{t('loc:Auto. schvaľovanie')}</span>
				<InfoTooltip
					title={t('loc:Automatické schvaľovanie')}
					text={t('loc:Online rezervácia bude zákazníkovi v Notino aplikácii automaticky schválená, nemusíte ju už ručne potvrdzovať.')}
				/>
			</div>
		),
		dataIndex: 'automaticApproval',
		key: 'automaticApproval',
		render: (_value, record) => checkerCell(record.automaticApproval, disabledRS)
	}
]

type SevicesTableProps = {
	category: IServicesListCategory
	parentPath?: string
	reorderView: boolean
	disabledRS?: boolean
}

const ServicesTable: FC<SevicesTableProps> = React.memo((props) => {
	const { category, parentPath, reorderView, disabledRS } = props
	const navigate = useNavigate()
	const [t] = useTranslation()

	const handleDrop = (oldIndex: number, newIndex: number) => {
		console.log({ oldIndex, newIndex })
	}

	return (
		<CustomTable<IServicesListService>
			className={cx('table-fixed noti-services-settings-table', { 'disabled-rs': disabledRS })}
			columns={getTableColumns(t, disabledRS)}
			dataSource={category.services.data}
			pagination={false}
			rowKey={'key'}
			dndDrop={reorderView ? handleDrop : undefined}
			rowClassName={reorderView ? undefined : 'clickable-row'}
			dndWithHandler={false}
			dndColWidth={36}
			onRow={
				reorderView
					? undefined
					: (record) => ({
							onClick: () => {
								if (parentPath) {
									navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:services-settings/{{serviceID}}', { serviceID: record.serviceID })))
								}
							}
					  })
			}
		/>
	)
})

type CategoriesListProps = {
	industry: IServicesListInudstry
	activeKeys: string[]
	parentPath?: string
	onChange: (newActiveKeys: string[]) => void
	reorderView: boolean
	disabledRS?: boolean
}

const CategoriesList: FC<CategoriesListProps> = React.memo((props) => {
	const { onChange, industry, activeKeys, parentPath, reorderView, disabledRS } = props
	return (
		<div className={'w-full overflow-x-auto'}>
			<Collapse
				bordered={false}
				activeKey={activeKeys}
				onChange={(newKeys) => onChange(typeof newKeys === 'string' ? [newKeys] : newKeys)}
				expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive, 16)}
				style={{ minWidth: 800 }}
			>
				{industry.categories.data.map((category) => (
					<Panel key={category.id} className={'panel panel-category'} header={<h4>{category.name}</h4>}>
						<ServicesTable category={category} parentPath={parentPath} reorderView={reorderView} disabledRS={disabledRS} />
					</Panel>
				))}
			</Collapse>
		</div>
	)
})

type ActiveKeys = {
	industries: string[]
	categories: string[]
}

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { salonID, parentPath } = props

	const services = useSelector((state: RootState) => state.service.services)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [reorderView, setReoderView] = useState(true)
	const [activeKeys, setActiveKeys] = useState<ActiveKeys>({ industries: [], categories: [] })
	const [enabledRS, setEnabledRS] = useState(false)

	const servicesListData = services?.listData

	useEffect(() => {
		dispatch(getCategories())
		;(async () => {
			const data = await dispatch(selectSalon(salonID))
			setEnabledRS(!!data?.data?.settings.enabledB2cReservations)
		})()
	}, [dispatch, salonID])

	useEffect(() => {
		;(async () => {
			const { listData } = await dispatch(
				getServices({
					salonID,
					rootCategoryID: undefined
				})
			)

			// id of first industry and all category ids
			setActiveKeys(
				listData.industries.data.reduce(
					(keys, industry) => {
						return {
							industries: keys.industries.length === 0 ? [industry.id] : keys.industries,
							categories: [
								...keys.categories,
								...industry.categories.data.reduce((categoriesKeys, category) => {
									return [...categoriesKeys, category.id]
								}, [] as string[])
							]
						}
					},
					{ industries: [], categories: [] } as ActiveKeys
				)
			)
		})()
	}, [dispatch, salonID])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenie služieb')
			}
		]
	}

	const handleSaveOrder = () => {
		setReoderView(false)
	}

	const handleChangeRsSettings = async (checked: boolean) => {
		setEnabledRS(checked)
		try {
			const reqData: PatchSettingsBody = {
				settings: {
					enabledReservations: checked
				}
			}

			await patchReq('/api/b2b/admin/salons/{salonID}/settings', { salonID }, reqData)
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	return (
		<div className={'services-setttings-wrapper'}>
			<Spin spinning={services?.isLoading || selectedSalon.isLoading} />
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			{/* RS system info */}
			<Alert
				className='mb-8'
				title={
					<span className={'mb-2 text-notino-grayDarker block text-base'}>
						{t('loc:Rezervačný systém je')} <strong className={'text-notino-black'}>{enabledRS ? t('loc:zapnutý') : t('loc:vypnutý')}</strong>
					</span>
				}
				subTitle={
					<Link to={`${parentPath + t('paths:reservations-settings')}`} className={'inline-flex gap-1 items-center text-notino-pink text-sm'}>
						{t('loc:Viac info  o rezervačnom systéme')} <ChevronPink className={'text-notino-pink'} />
					</Link>
				}
				message={''}
				icon={<InfoNotinoIcon className={'text-notino-pink'} />}
				actionItem={<SwitchField input={{ value: enabledRS, onChange: handleChangeRsSettings } as any} meta={{} as any} />}
			/>

			{/* Services stats cards */}
			<ServicesStats
				allServicesCount={servicesListData.industries.servicesCount}
				servicesAvailableForOnlineReservationsCount={servicesListData.industries.servicesAvailableForOnlineReservationsCount}
				servicesVisibleInPricelistCount={servicesListData.industries.servicesVisibleInPricelistCount}
			/>

			{/* Services list */}
			<div className={'flex items-center justify-between gap-4 mb-4'}>
				<h2 className={'text-2xl mb-0'}>{`${t('loc:Zoznam služieb')} (${servicesListData.industries.servicesCount})`}</h2>
				{reorderView ? (
					<Button type={'primary'} className={'noti-btn'} onClick={handleSaveOrder}>
						{STRINGS(t).save('').trim()}
					</Button>
				) : (
					<div className={'flex items-center gap-2'}>
						<Button type={'dashed'} className={'noti-btn'} icon={<DragIcon />} onClick={() => setReoderView(true)}>
							{t('loc:Zmeniť poradie')}
						</Button>
						<InfoTooltip title={t('loc:Zmena poradia')} text={t('loc:Poradie služieb na tejto obrazovke zodpovedá poradiu služieb v zákazníckej aplikácii Notino.')} />
					</div>
				)}
			</div>

			<div className={'services-collapse-wrapper'}>
				<Collapse
					bordered={false}
					activeKey={activeKeys.industries}
					onChange={(newKeys) => setActiveKeys((prevState) => ({ ...prevState, industries: typeof newKeys === 'string' ? [newKeys] : newKeys }))}
					expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive)}
				>
					{servicesListData.industries.data.map((industry) => {
						return (
							<Panel
								key={industry.id}
								header={
									<h3>
										{industry.name} ({industry.categories.servicesCount})
									</h3>
								}
								className={'panel panel-industry'}
								// forceRender
							>
								{!industry.categories.servicesCount ? (
									<div className={'w-full justify-center text-center p-2'}>
										<p>{t('loc:K tomuto oboru zatiaľ nemáte priradené žiadne služby.')}</p>
										<Button
											type={'primary'}
											className={'noti-btn'}
											onClick={() => navigate(parentPath + t('paths:industries-and-services/{{industryID}}', { industryID: industry.id }))}
										>
											{STRINGS(t).assign(t('loc:služby'))}
										</Button>
									</div>
								) : (
									<CategoriesList
										parentPath={parentPath}
										industry={industry}
										activeKeys={activeKeys.categories}
										onChange={(newKeys: string[]) => setActiveKeys((prevState) => ({ ...prevState, categories: newKeys }))}
										reorderView={reorderView}
										disabledRS={!enabledRS}
									/>
								)}
							</Panel>
						)
					})}
				</Collapse>
			</div>
		</div>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServicesPage)
