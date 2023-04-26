import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Spin, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { arrayMove } from '@dnd-kit/sortable'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Alert from '../../components/Dashboards/Alert'
import SwitchField from '../../atoms/SwitchField'
import ServicesStats from './components/list/ServicesStats'
import InfoTooltip from '../../atoms/InfoTooltip'
import IndustriesList from './components/list/IndustriesList'

// utils
import { PERMISSION, STRINGS } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getServices, IServicesListData } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, PatchSettingsBody, SalonSubPageProps, ServicesActiveKeys } from '../../types/interfaces'

// assets
import { ReactComponent as DragIcon } from '../../assets/icons/drag-icon.svg'
import { ReactComponent as ChevronPink } from '../../assets/icons/chevron-pink.svg'
import { ReactComponent as InfoNotinoIcon } from '../../assets/icons/info-notino-icon.svg'

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { salonID, parentPath } = props

	const services = useSelector((state: RootState) => state.service.services)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [servicesListData, setServicesListData] = useState<IServicesListData>({
		industries: {
			data: [],
			servicesCount: 0,
			servicesAvailableForOnlineReservationsCount: 0,
			servicesVisibleInPricelistCount: 0
		}
	})
	const [reorderView, setReoderView] = useState(true)
	const [activeKeys, setActiveKeys] = useState<ServicesActiveKeys>({ industries: [], categories: [] })
	const [enabledRS, setEnabledRS] = useState(false)

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

			setServicesListData(listData)

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
					{ industries: [], categories: [] } as ServicesActiveKeys
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

	const handleReorderItems = useCallback(
		(currentIndexes: [number, number?, number?], newIndex: number) => {
			const newData: IServicesListData = { ...servicesListData }
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
					const categoryIndex = currentIndexes[1] as number
					const serviceIndex = currentIndexes[2] as number

					if (serviceIndex === newIndex) {
						break
					}

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

			<div className={cx('services-collapse-wrapper', { 'reorder-view': reorderView })}>
				<Spin spinning={services.isLoading}>
					<IndustriesList
						idustriesData={servicesListData.industries.data}
						activeKeys={activeKeys}
						setActiveKeys={setActiveKeys}
						reorderView={reorderView}
						parentPath={parentPath}
						disabledRS={!enabledRS}
						handleReorder={handleReorderItems}
					/>
				</Spin>
			</div>
		</div>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServicesPage)
