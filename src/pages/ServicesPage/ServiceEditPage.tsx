import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialize, startSubmit, stopSubmit } from 'redux-form'
import { compose, Dispatch } from 'redux'
import { isNil, unionBy } from 'lodash'
import { useNavigate } from 'react-router-dom'

// components
import ServiceForm from './components/detail/ServiceForm'
import ServiceEditModal from '../EmployeesPage/components/ServiceEditModal'

// reducers
import { RootState } from '../../reducers'
import { getService } from '../../reducers/services/serviceActions'
import { getCategory } from '../../reducers/categories/categoriesActions'

// types
import { SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { patchReq } from '../../utils/request'
import { FORM, LANGUAGE, NOTIFICATION_TYPE, PARAMETER_TYPE, PERMISSION, SERVICE_DESCRIPTION_LNG } from '../../utils/enums'
import { decodePrice, encodePrice } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'
import {
	getEmployeeServiceDataForPatch,
	parseParameterValuesInit,
	parseEmployeesInit,
	parseEmployeeCreateAndUpdate,
	parseParameterValuesCreateAndUpdate,
	addEmployee
} from './serviceUtils'

// schema
import { IEmployeeServiceEditForm, IServiceForm } from '../../schemas/service'
import { LOCALES } from '../../components/LanguagePicker'

type Props = SalonSubPageProps & {
	serviceID: string
}

type ServicePatch = Paths.PatchApiB2BAdminServicesServiceId.RequestBody

const ServiceEditPage = (props: Props) => {
	const { serviceID, salonID, parentPath } = props
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const employees = useSelector((state: RootState) => state.employees.employees)
	const service = useSelector((state: RootState) => state.service.service.data?.service)
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])

	const [visibleServiceEditModal, setVisibleServiceEditModal] = useState(false)
	const [updatingService, setUpdatingSerivce] = useState(false)

	const fetchData = useCallback(async () => {
		const { data } = await dispatch(getService(serviceID))

		if (!data?.service?.id) {
			navigate('/404')
		}

		const { data: dataCategory } = await dispatch(getCategory(data?.service?.category?.child?.child?.id))
		if (data) {
			// union parameter values form service and category detail based on categoryParameterValueID
			const parameterValues = unionBy(data.service?.serviceCategoryParameter?.values, dataCategory as any, 'categoryParameterValueID')
			const descDefaultLng = data.service.descriptionLocalizations.find((v) => v.language === SERVICE_DESCRIPTION_LNG.DEFAULT)
			const descEnLng = data.service.descriptionLocalizations.find((v) => v.language === SERVICE_DESCRIPTION_LNG.EN)

			const initData: IServiceForm = {
				id: data.service.id,
				serviceCategoryParameterType: data.service.serviceCategoryParameter?.valueType as PARAMETER_TYPE,
				serviceCategoryParameter: parseParameterValuesInit(parameterValues),
				serviceCategoryParameterName: data.service.serviceCategoryParameter?.name,
				durationFrom: data.service.priceAndDurationData.durationFrom,
				durationTo: data.service.priceAndDurationData.durationTo,
				variableDuration: !!data.service.priceAndDurationData.durationTo,
				priceFrom: decodePrice(data.service.priceAndDurationData.priceFrom),
				priceTo: decodePrice(data.service.priceAndDurationData.priceTo),
				variablePrice: !!data.service.priceAndDurationData.priceTo,
				employees: parseEmployeesInit(data?.service),
				useCategoryParameter: data.service.useCategoryParameter,
				settings: data.service.settings,
				descriptionLocalizations: {
					use: !!descDefaultLng?.value,
					defualtLanguage:
						descDefaultLng?.value ||
						dataCategory?.descriptionLocalizations.find((desc) => {
							return LOCALES[desc.language?.toLowerCase() as LANGUAGE]?.countryCode?.toLowerCase() === salon.data?.address?.countryCode?.toLowerCase()
						})?.value ||
						null,
					enLanguage: descEnLng?.value || dataCategory?.descriptionLocalizations.find((desc) => desc.language?.toLowerCase() === LANGUAGE.EN.toLowerCase())?.value || null
				}
			}
			dispatch(initialize(FORM.SERVICE_FORM, initData))
		}
	}, [dispatch, serviceID, navigate, salon.data?.address?.countryCode])

	const editEmployeeService = async (values: IEmployeeServiceEditForm, _dispatch?: Dispatch<any>, customProps?: any) => {
		const employeeID = values.employee?.id
		const { resetUserServiceData = false } = customProps || {}

		if (employeeID) {
			try {
				setUpdatingSerivce(true)
				const employeePatchServiceData = getEmployeeServiceDataForPatch(values, resetUserServiceData)

				await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID, serviceID }, employeePatchServiceData)
				fetchData()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setUpdatingSerivce(false)
				setVisibleServiceEditModal(false)
			}
		}
	}

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleSubmit = async (values: IServiceForm) => {
		dispatch(startSubmit(FORM.SERVICE_FORM))
		try {
			let reqData: ServicePatch = {
				useCategoryParameter: values.useCategoryParameter,
				noteForPriceAndDuration: undefined,
				// set null if useCategoryParameter is true
				priceAndDurationData: (values.useCategoryParameter
					? null
					: {
							durationFrom: values.durationFrom ?? null,
							durationTo: values.variableDuration ? values.durationTo : null,
							priceFrom: encodePrice(values.priceFrom as number),
							priceTo: values.variablePrice && !isNil(values.priceTo) ? encodePrice(values.priceTo) : null
					  }) as any,
				categoryParameterValues: values.useCategoryParameter ? parseParameterValuesCreateAndUpdate(values.serviceCategoryParameter) : undefined,
				employeeIDs: parseEmployeeCreateAndUpdate(values.employees),
				settings: values.settings
			}

			let descriptionLocalizations: any[] | null = []

			const serviceDescDefaultLng = values.descriptionLocalizations.defualtLanguage
			const serviceDescEnLng = values.descriptionLocalizations.enLanguage

			if (values.descriptionLocalizations.use) {
				descriptionLocalizations.push({ language: SERVICE_DESCRIPTION_LNG.DEFAULT, value: serviceDescDefaultLng })

				if (values.descriptionLocalizations.enLanguage) {
					descriptionLocalizations.push({ language: SERVICE_DESCRIPTION_LNG.EN, value: serviceDescEnLng })
				}
			} else {
				descriptionLocalizations = null
			}

			reqData = {
				...reqData,
				descriptionLocalizations
			}

			await patchReq('/api/b2b/admin/services/{serviceID}', { serviceID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			fetchData()
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			dispatch(stopSubmit(FORM.SERVICE_FORM))
		}
	}

	return (
		<Permissions
			allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<>
					<ServiceForm
						backUrl={parentPath}
						addEmployee={() => {
							if (service) {
								addEmployee(dispatch, employees?.data?.employees || [], service, form?.values as IServiceForm)
							}
						}}
						onSubmit={(formData: IServiceForm) => {
							if (hasPermission) {
								handleSubmit(formData)
							} else {
								openForbiddenModal()
							}
						}}
						salonID={salonID}
						serviceID={serviceID}
						setVisibleServiceEditModal={setVisibleServiceEditModal}
					/>
					<ServiceEditModal
						visible={visibleServiceEditModal}
						setVisible={setVisibleServiceEditModal}
						loading={updatingService}
						editEmployeeService={editEmployeeService}
					/>
				</>
			)}
		/>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServiceEditPage)
