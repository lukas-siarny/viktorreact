import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Spin, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Link, unstable_usePrompt, useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Alert from '../../components/Dashboards/Alert'
import SwitchField from '../../atoms/SwitchField'
import ServicesStats from './components/list/ServicesStats'
import IconTooltip from '../../atoms/IconTooltip'
import IndustriesList from './components/list/IndustriesList'

// utils
import { PERMISSION, SERVICES_LIST_INIT, STRINGS } from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getServices, IServicesListData, setServicesActiveKeys } from '../../reducers/services/serviceActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, PatchSettingsBody, SalonSubPageProps, ServicesActiveKeys } from '../../types/interfaces'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as DragIcon } from '../../assets/icons/drag-icon.svg'
import { ReactComponent as ChevronPink } from '../../assets/icons/chevron-pink.svg'
import { ReactComponent as InfoNotinoIcon } from '../../assets/icons/info-notino-icon.svg'
import { ReactComponent as ServiceIcon } from '../../assets/icons/services-24-icon.svg'

type ServicesPatchBody = Paths.PatchApiB2BAdminSalonsSalonIdCategoriesReorder.RequestBody

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { salonID, parentPath } = props

	const services = useSelector((state: RootState) => state.service.services)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [servicesListData, setServicesListData] = useState<IServicesListData>(SERVICES_LIST_INIT)
	const [reorderView, setReoderView] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const enabledRS = selectedSalon?.data?.settings.enabledReservations

	const loading = services?.isLoading || selectedSalon.isLoading || isSubmitting

	const activeKeys = useMemo(() => services.servicesActiveKeys, [services.servicesActiveKeys])
	const setActiveKeys = useCallback((newActiveKeys: ServicesActiveKeys) => dispatch(setServicesActiveKeys(newActiveKeys)), [dispatch])

	const promptMessage = t('loc:Chcete zahodiť vykonané zmeny?')
	const dirty = reorderView && JSON.stringify(servicesListData) !== JSON.stringify(services.listData)

	unstable_usePrompt({ when: dirty, message: promptMessage })

	useEffect(() => {
		dispatch(
			getServices(
				{
					salonID
				},
				true
			)
		)
	}, [dispatch, salonID])

	useEffect(() => {
		setServicesListData(cloneDeep(services.listData))
	}, [services.listData])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenie služieb')
			}
		]
	}

	const handleSaveOrder = async () => {
		if (dirty) {
			setIsSubmitting(true)
			try {
				const requestBody = servicesListData.industries.data.reduce(
					(acc, industry) => {
						return {
							rootCategories: [
								...acc.rootCategories,
								{
									id: industry.id,
									categoryIDs: industry.categories.data.reduce((catIDs, category) => {
										return [...catIDs, ...category.services.data.map((service) => service.categoryID)]
									}, [] as string[])
								}
							]
						} as any
					},
					{ rootCategories: [] } as ServicesPatchBody
				)

				await patchReq('/api/b2b/admin/salons/{salonID}/categories/reorder', { salonID }, requestBody)

				dispatch(
					getServices(
						{
							salonID
						},
						true
					)
				)
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setIsSubmitting(false)
			}
		} else {
			setReoderView(false)
		}
	}

	const handleCancelOrder = () => {
		if (dirty) {
			// eslint-disable-next-line no-alert
			if (window.confirm(promptMessage)) {
				setServicesListData(services.listData)
				setReoderView(false)
			}
		} else {
			setReoderView(false)
		}
	}

	const handleChangeRsSettings = async (checked: boolean) => {
		setIsSubmitting(true)
		// set state immediately so user can see checkbox change
		try {
			const reqData: PatchSettingsBody = {
				settings: {
					enabledReservations: checked
				}
			}

			await patchReq('/api/b2b/admin/salons/{salonID}/settings', { salonID }, reqData)
			await dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleReorderItems = useCallback(
		(currentIndexes: [number, number?, number?], newIndex: number) => {
			const newData: IServicesListData = cloneDeep(servicesListData)
			const industryIndex = currentIndexes[0]

			switch (currentIndexes.length) {
				case 1: {
					// reorder industries
					if (industryIndex === newIndex) {
						break
					}

					newData.industries.data = arrayMove(newData.industries.data, industryIndex, newIndex)
					break
				}
				case 2: {
					// reorder categories
					const categoryIndex = currentIndexes[1] as number

					if (categoryIndex === newIndex) {
						break
					}

					const categoriesData = [...newData.industries.data[industryIndex].categories.data]
					const reorderedData = arrayMove(categoriesData, categoryIndex, newIndex)
					newData.industries.data[industryIndex].categories.data = reorderedData
					break
				}
				case 3: {
					// reorder services
					const serviceIndex = currentIndexes[2] as number

					if (serviceIndex === newIndex) {
						break
					}

					const categoryIndex = currentIndexes[1] as number

					const servicesData = [...newData.industries.data[industryIndex].categories.data[categoryIndex].services.data]
					const reorderedData = arrayMove(servicesData, serviceIndex, newIndex)
					newData.industries.data[industryIndex].categories.data[categoryIndex].services.data = reorderedData
					break
				}
				default:
					break
			}
			setServicesListData(newData)
		},
		[servicesListData]
	)

	return (
		<div className={'services-setttings-wrapper'}>
			<div className={'services-setttings-inner-wrapper'}>
				<Spin spinning={loading} />
				<Row>
					<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
				</Row>
				{!services.isLoading && !services.listData.industries.data.length ? (
					<div className={'flex w-full items-center text-center flex-col mt-40'}>
						<div className={'w-32 h-32 bg-notino-white rounded-full mb-6 flex items-center justify-center'}>
							<ServiceIcon className={'w-16 h-16'} />
						</div>
						<h2 className={'text-2xl mb-3'}>{t('loc:Nemáte vybraté žiadne služby')}</h2>
						<p className={'text-sm mb-6'}>{t('loc:Najprv prejdite do sekcie Obory a služby, kde si vyberiete, ktoré služby ponúkate.')}</p>
						<Button type={'primary'} className={'noti-btn'} onClick={() => navigate(parentPath + t('paths:industries-and-services'))}>
							{t('loc:Vybrať obory a služby')}
						</Button>
					</div>
				) : (
					<>
						{/* RS system info */}
						<Alert
							className='mb-8'
							title={
								<span className={'mb-2 text-notino-grayDarker block text-base'}>
									{t('loc:Rezervačný systém je')} <strong className={'text-notino-black'}>{enabledRS ? t('loc:zapnutý') : t('loc:vypnutý')}</strong>
								</span>
							}
							subTitle={
								<Link to={`${parentPath + t('paths:reservations-settings')}`} className={'inline-flex gap-1 items-center text-notino-pink text-sm font-medium'}>
									{t('loc:Viac info o rezervačnom systéme')} <ChevronPink className={'text-notino-pink'} />
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
							<div className={'flex items-center gap-2'}>
								{reorderView ? (
									<>
										<Button type={'dashed'} className={'noti-btn'} onClick={handleCancelOrder} disabled={loading}>
											{STRINGS(t).cancel('').trim()}
										</Button>
										<Button type={'primary'} className={'noti-btn'} onClick={handleSaveOrder} disabled={loading || !dirty}>
											{STRINGS(t).save('').trim()}
										</Button>
									</>
								) : (
									<Permissions
										allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
										render={(hasPermission, { openForbiddenModal }) => (
											<>
												<Button
													type={'dashed'}
													className={'noti-btn'}
													icon={<DragIcon />}
													onClick={() => {
														if (hasPermission) {
															setReoderView(true)
														} else {
															openForbiddenModal()
														}
													}}
												>
													{t('loc:Zmeniť poradie')}
												</Button>
												<IconTooltip
													title={t('loc:Zmena poradia')}
													text={t('loc:Poradie služieb na tejto obrazovke zodpovedá poradiu služieb v zákazníckej aplikácii Notino.')}
												/>
											</>
										)}
									/>
								)}
							</div>
						</div>

						<div className={cx('services-collapse-wrapper', { 'reorder-view': reorderView })}>
							<Spin spinning={loading}>
								{activeKeys && (
									<IndustriesList
										idustriesData={servicesListData.industries.data}
										activeKeys={activeKeys}
										setActiveKeys={setActiveKeys}
										reorderView={reorderView}
										parentPath={parentPath}
										disabledRS={!enabledRS}
										handleReorder={handleReorderItems}
										salonID={salonID}
									/>
								)}
							</Spin>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServicesPage)
