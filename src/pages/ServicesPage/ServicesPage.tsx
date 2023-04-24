import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Spin, Button, Tooltip, Collapse, Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { Link, useNavigate } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import { AvatarGroup } from '../../components/AvatarComponents'
import Alert from '../../components/Dashboards/Alert'

// utils
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, STRINGS } from '../../utils/enums'
import { decodePrice, formatDateByLocale, getLinkWithEncodedBackUrl, getServiceRange } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { Columns, IBreadcrumbs, IUserAvatar, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as InfoIcon16 } from '../../assets/icons/info-icon-16.svg'
import { ReactComponent as DragIcon } from '../../assets/icons/drag-icon.svg'
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg'
import { ReactComponent as ChevronPink } from '../../assets/icons/chevron-pink.svg'
import { ReactComponent as InfoNotinoIcon } from '../../assets/icons/info-notino-icon.svg'

import SwitchField from '../../atoms/SwitchField'

const { Panel } = Collapse

const getExpandIcon = (isActive: boolean, size = 24) => (
	<ChevronDown
		width={size}
		height={size}
		color={'#000'}
		style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease-in-out', transformOrigin: 'center' }}
	/>
)

type ActiveKeys = {
	industries: string[]
	categories: string[]
}

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const { salonID, parentPath } = props

	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)
	const [reorderView, setReoderView] = useState(false)
	const [activeKeys, setActiveKeys] = useState<ActiveKeys>({ industries: [], categories: [] })

	const servicesCount = services?.tableData?.length || 0
	const enabledRS = true

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	useEffect(() => {
		;(async () => {
			const { data } = await dispatch(
				getServices({
					salonID,
					rootCategoryID: undefined
				})
			)

			if (data) {
				const panelKeys: ActiveKeys = { industries: [], categories: [] }
				const firstIndustry = data.groupedServicesByCategory[0].category
				if (firstIndustry) {
					panelKeys.industries.push(firstIndustry.id)
					firstIndustry?.children.forEach((category) => {
						if (category.category) {
							panelKeys.categories.push(category.category.id)
						}
					})
				}
				setActiveKeys(panelKeys)
			}
		})()
	}, [dispatch, salonID])

	const columns: Columns = [
		{
			title: t('loc:Služba'),
			dataIndex: ['category', 'name'],
			key: 'name',
			ellipsis: true
		},
		{
			title: t('loc:Trvanie služby'),
			dataIndex: ['service', 'rangePriceAndDurationData'],
			key: 'duration',
			ellipsis: true,
			className: 'noti-light-pink-col',
			render: (value) => {
				return getServiceRange(value?.durationFrom, value?.durationTo, t('loc:min')) || '-'
			}
		},
		{
			title: t('loc:Cena služby'),
			dataIndex: ['service', 'rangePriceAndDurationData'],
			key: 'price',
			ellipsis: true,
			className: 'noti-light-pink-col',
			render: (value) => {
				const symbol = '' // TODO: symbol
				return getServiceRange(decodePrice(value?.priceFrom), decodePrice(value?.priceTo), symbol) || '-'
			}
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: ['service', 'employees'],
			key: 'employees',
			className: 'noti-medium-pink-col',
			render: (value: IUserAvatar[]) =>
				value ? (
					<div className={'w-full h-full flex items-center'}>
						<AvatarGroup maxCount={3} avatars={value} maxPopoverPlacement={'right'} size={'small'} />{' '}
					</div>
				) : null
		},
		{
			title: t('loc:Online rezervácie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			className: 'noti-medium-pink-col',
			ellipsis: true,
			render: () => '-'
		},
		{
			title: t('loc:Auto. schvaľovanie'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			render: () => '-'
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenie služieb')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Alert
				className='mb-8'
				title={
					<span className={'mb-2 text-notino-grayDarker block text-base'}>
						{t('loc:Rezervačný systém je')} <strong className={'text-notino-black'}>{enabledRS ? t('loc:zapnutý') : t('loc:vypnut=y')}</strong>
					</span>
				}
				subTitle={
					<Link to={'s'} className={'inline-flex gap-1 items-center text-notino-pink text-sm'}>
						{t('loc:Viac info  o rezervačnom systéme')} <ChevronPink className={'text-notino-pink'} />
					</Link>
				}
				message={''}
				icon={<InfoNotinoIcon className={'text-notino-pink'} />}
				actionItem={<SwitchField input={{ value: true, onChange: (checked: boolean) => console.log(checked) } as any} meta={{} as any} />}
			/>
			<div className={'flex gap-4 mb-12'}>
				<div className={'p-6 rounded shadow-lg bg-notino-white w-1/3'}>
					<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>{'47'}</h3>
					<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-76'}>{t('loc:služieb')}</div>
					<Divider className={'my-4'} />
					<div className={'flex gap-2'}>
						<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
						<p className={'m-0 text-sm text-normal text-notino-grayDarker'}>{t('loc:Celkový počet služieb, ktoré ponúkate')}</p>
					</div>
				</div>
				<div className={'p-6 rounded shadow-lg w-1/3'} style={{ background: 'linear-gradient(0deg, rgba(220, 0, 105, 0.03), rgba(220, 0, 105, 0.03)), #FFFFFF' }}>
					<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>
						{'28'}
						<span className={'text-notino-grayMedium'}>/{'47'}</span>
					</h3>
					<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-76'}>{t('loc:služieb viditeľných v cenníku')}</div>
					<Divider className={'my-4'} />
					<div className={'flex gap-2'}>
						<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
						<div className={'flex-1'}>
							<p className={'mb-2 text-sm text-normal text-notino-grayDarker'}>{t('loc:Pre pridanie služby do cenníka')}:</p>
							<ul className={'pl-4 text-notino-pink mb-0'}>
								<li className={'mb-2'}>
									<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
										{t('loc:Vyplňte')} <strong>{t('loc:dĺžku trvania')}</strong>
									</span>
								</li>
								<li>
									<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
										{t('loc:Vyplňte')} <strong>{t('loc:cenu služby')}</strong>
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className={'p-6 rounded shadow-lg w-1/3'} style={{ background: 'linear-gradient(0deg, rgba(220, 0, 105, 0.08), rgba(220, 0, 105, 0.08)), #FFFFFF' }}>
					<h3 className={'text-notino-black mb-0 text-3xl block font-bold mb-1'}>
						{'28'}
						<span className={'text-notino-grayMedium'}>/{'47'}</span>
					</h3>
					<div className={'text-notino-black text-2xl font-normal min-h-16 max-w-76'}>{t('loc:služieb dostupných na online rezervácie')}</div>
					<Divider className={'my-4'} />
					<div className={'flex gap-2'}>
						<InfoNotinoIcon className={'text-notino-pink w-5 h-5 shrink-0'} />
						<div className={'flex-1'}>
							<p className={'mb-2 text-sm text-normal text-notino-grayDarker'}>{t('loc:Pre rezerváciu online')}:</p>
							<ul className={'pl-4 text-notino-pink mb-0'}>
								<li className={'mb-2'}>
									<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
										<strong>{t('loc:Priraďte')}</strong> {t('loc:službe aspoň')} <strong>{t('loc:1 kolegu')}</strong>
									</span>
								</li>
								<li>
									<span className={'text-notino-grayDarker inline-flex gap-1 flex-wrap'}>
										<strong>{t('loc:Zapnite si')}</strong> {t('loc:online rezerváciu')}
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className={'flex items-center justify-between gap-4 mb-4'}>
				<h2 className={'text-2xl mb-0'}>{`${t('loc:Zoznam služieb')} (${servicesCount})`}</h2>
				{reorderView ? (
					<Button type={'primary'} className={'noti-btn'} onClick={() => console.log('reorder')}>
						{STRINGS(t).save('').trim()}
					</Button>
				) : (
					<div className={'flex items-center gap-2'}>
						<Button type={'dashed'} className={'noti-btn'} icon={<DragIcon />} onClick={() => setReoderView(true)}>
							{t('loc:Zmeniť poradie')}
						</Button>
						<Tooltip
							align={{ points: ['br', 'tr'] }}
							arrow={false}
							overlayClassName={'min-w-72'}
							title={
								<>
									<h4 className={'mb-0 text-xs'}>{t('loc:Zmena poradia')}</h4>
									<p className={'mb-0 text-xs'} style={{ color: '#6D7483' }}>
										{t('loc:Poradie služieb na tejto obrazovke zodpovedá poradiu služieb v zákazníckej aplikácii Notino.')}
									</p>
								</>
							}
						>
							<InfoIcon16 className={'mr-2'} />
						</Tooltip>
					</div>
				)}
			</div>

			<div className={'services-collapse-wrapper'}>
				<Spin spinning={services?.isLoading}>
					<Collapse
						bordered={false}
						activeKey={activeKeys.industries}
						onChange={(newKeys) => setActiveKeys((prevState) => ({ ...prevState, industries: typeof newKeys === 'string' ? [newKeys] : newKeys }))}
						expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive)}
					>
						{services?.data?.groupedServicesByCategory.map((firstLevelCategory) => {
							const { category: industry } = firstLevelCategory
							return industry ? (
								<Panel key={industry.id} header={<h3>{industry.name}</h3>} className={'panel panel-industry'} forceRender>
									<Collapse
										bordered={false}
										activeKey={activeKeys.categories}
										onChange={(newKeys) => setActiveKeys((prevState) => ({ ...prevState, categories: typeof newKeys === 'string' ? [newKeys] : newKeys }))}
										expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive, 16)}
									>
										{industry.children.map((secondLevelCategory) => {
											const { category } = secondLevelCategory
											return category ? (
												<Panel key={category.id} className={'panel panel-category'} header={<h4>{category.name}</h4>} forceRender>
													<CustomTable
														className='table-fixed noti-services-settings-table'
														columns={columns}
														dataSource={category.children}
														scroll={{ x: 800 }}
														pagination={false}
														rowKey={(record) => record.category.id}
														rowClassName={'clickable-row'}
														onRow={(record) => ({
															onClick: () => {
																navigate(
																	getLinkWithEncodedBackUrl(
																		parentPath + t('paths:services-settings/{{serviceID}}', { serviceID: record.service.id })
																	)
																)
															}
														})}
													/>
												</Panel>
											) : null
										})}
									</Collapse>
								</Panel>
							) : null
						})}
					</Collapse>
				</Spin>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServicesPage)
