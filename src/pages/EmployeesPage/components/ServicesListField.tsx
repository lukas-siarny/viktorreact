import React, { FC } from 'react'
import { initialize, WrappedFieldArrayProps } from 'redux-form'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Collapse, Button } from 'antd'

// utils
import { FORM } from '../../../utils/enums'
import { renderPriceAndDurationInfo } from '../../../utils/helper'

// types
import { EmployeeServiceData } from '../../../types/interfaces'

// components
import DeleteButton from '../../../components/DeleteButton'
import AvatarComponents from '../../../components/AvatarComponents'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon-16.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/icons/question.svg'
import { ReactComponent as CloudOfflineIcon } from '../../../assets/icons/cloud-offline.svg'

const { Panel } = Collapse

type ComponentProps = {
	currencySymbol?: string
	setVisibleServiceEditModal: (visible: boolean) => void
	panelHeaderRender: (fieldData: EmployeeServiceData) => React.ReactChild
}

export const panelHeaderRenderCategoryName = (fieldData: EmployeeServiceData) => {
	return (
		<div className={'flex items-center gap-2'}>
			<div className={'font-bold'}>{fieldData?.name}</div>
			<span className={'service-badge font-normal text-xxs p-1 leading-3'}>{fieldData?.category}</span>
		</div>
	)
}

export const panelHeaderRenderEmployee = (fieldData: EmployeeServiceData) => {
	const { employee } = fieldData || {}
	return (
		<div className={'flex items-center gap-2'}>
			{employee?.image ? (
				<AvatarComponents className='w-7 h-7' src={employee?.image} />
			) : (
				<div className={'w-7 h-7 shrink-0 bg-notino-gray'} style={{ borderRadius: '50%' }} />
			)}
			<span className={'font-bold'}>{employee?.name || employee?.email || employee?.inviteEmail || employee?.id}</span>
			{employee?.hasActiveAccount === false && !employee?.inviteEmail ? <QuestionIcon width={20} height={20} /> : undefined}
			{employee?.hasActiveAccount === false && employee.inviteEmail ? <CloudOfflineIcon width={20} height={20} /> : undefined}
		</div>
	)
}

type Props = WrappedFieldArrayProps<EmployeeServiceData> & ComponentProps

const ServicesListField: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { fields, currencySymbol, setVisibleServiceEditModal, panelHeaderRender } = props
	const dispatch = useDispatch()

	const genExtra = (index: number, field: EmployeeServiceData) => {
		const salonPriceAndDuration = field?.salonPriceAndDurationData
		const employeePriceAndDuration = field?.employeePriceAndDurationData
		const hasOverridenData = field?.hasOverriddenPricesAndDurationData

		return (
			<div className={'flex gap-1 items-center'}>
				{field?.useCategoryParameter ? (
					<div>{field?.serviceCategoryParameterName}</div>
				) : (
					renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, hasOverridenData, currencySymbol)
				)}
				<Button
					htmlType={'button'}
					className={'ant-btn noti-btn'}
					size={'small'}
					icon={<EditIcon />}
					onClick={(e) => {
						e.stopPropagation()
						dispatch(initialize(FORM.EMPLOYEE_SERVICE_EDIT, field))
						setVisibleServiceEditModal(true)
					}}
					onKeyDown={(e) => e.stopPropagation()}
				/>
				<DeleteButton
					onConfirm={(e) => {
						e?.stopPropagation()
						fields.remove(index)
					}}
					onCancel={(e) => e?.stopPropagation()}
					smallIcon
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					size={'small'}
					entityName={t('loc:službu')}
					type={'default'}
					getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
					onlyIcon
				/>
			</div>
		)
	}

	const defaultActiveKeys = (fields as any).reduce((acc: any, _cv: any, index: number) => {
		const fieldData = fields.get(index)
		if (fieldData?.hasOverriddenPricesAndDurationData) {
			return acc
		}
		return [fieldData.id, ...acc]
	}, [] as string[])

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false} defaultActiveKey={defaultActiveKeys}>
				{fields.map((_field: any, index: number) => {
					const fieldData = fields.get(index)
					const categoryParameter = fieldData?.serviceCategoryParameter

					return (
						<Panel
							header={panelHeaderRender(fieldData)}
							key={index}
							extra={genExtra(index, fieldData)}
							className={'employee-collapse-panel'}
							showArrow={false}
							collapsible={fieldData?.useCategoryParameter ? undefined : 'disabled'}
						>
							{fieldData?.useCategoryParameter ? (
								<div className={'flex flex-col pb-4'}>
									{categoryParameter?.map((parameterValue) => {
										const employeePriceAndDurationData = parameterValue?.employeePriceAndDurationData
										const salonPriceAndDurationData = parameterValue?.salonPriceAndDurationData

										return (
											<>
												<div className={'flex items-center justify-between px-2 py-1 min-h-10'} key={fieldData?.id}>
													<span>{parameterValue?.name}</span>
													{renderPriceAndDurationInfo(
														salonPriceAndDurationData,
														employeePriceAndDurationData,
														fieldData?.hasOverriddenPricesAndDurationData,
														currencySymbol
													)}
												</div>
												<Divider className={'m-0'} />
											</>
										)
									})}
								</div>
							) : null}
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

export default ServicesListField
