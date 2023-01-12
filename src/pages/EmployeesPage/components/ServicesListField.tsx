/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC } from 'react'
import { initialize, WrappedFieldArrayProps } from 'redux-form'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Collapse, Button, Tooltip } from 'antd'
import cx from 'classnames'
import i18next from 'i18next'

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
	disabledEditButton?: boolean
	disabledEditButtonTooltip?: string
	// ak sa to rendruje vramci detailu zamestnanca
	isEmployeeDetail?: boolean
}

type Props = WrappedFieldArrayProps<EmployeeServiceData> & ComponentProps

const panelHeaderRenderCategoryName = (fieldData: EmployeeServiceData) => {
	return (
		<div className='flex flex-col' style={{ gap: 2 }}>
			<div className={'inline items-center flex-wrap'}>
				<span className={'font-bold inline leading-4'}>{fieldData?.name}</span>
				<span className={'service-badge without-separator font-normal text-xxs p-1 leading-3 inline ml-2 whitespace-nowrap'}>{fieldData?.industry}</span>
			</div>
			{fieldData.useCategoryParameter && (
				<span className='leading-4 font-normal text-xs text-notino-grayDark'>
					{i18next.t('loc:Parameter')}: <strong>{fieldData?.serviceCategoryParameterName}</strong>
				</span>
			)}
		</div>
	)
}

const panelHeaderRenderEmployee = (fieldData: EmployeeServiceData) => {
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

const ServicesListField: FC<Props> = (props) => {
	const [t] = useTranslation()
	const {
		fields,
		currencySymbol,
		setVisibleServiceEditModal,
		disabledEditButton = false,
		disabledEditButtonTooltip = t('loc:Pred editáciou služby zamestnanca je najprv potrebné uložiť rozpracované zmeny vo formulári.'),
		isEmployeeDetail = true
	} = props
	const dispatch = useDispatch()

	const genExtra = (index: number, field: EmployeeServiceData) => {
		const salonPriceAndDuration = field?.salonPriceAndDurationData
		const employeePriceAndDuration = field?.employeePriceAndDurationData
		const hasOverridenData = field?.hasOverriddenPricesAndDurationData

		return (
			<div className={'flex gap-1 items-center ml-2'}>
				{!field?.useCategoryParameter && renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, hasOverridenData, currencySymbol)}
				<div onClick={(e) => e.stopPropagation()}>
					<Tooltip title={disabledEditButton ? disabledEditButtonTooltip : null} destroyTooltipOnHide>
						<span className={cx('w-full md:w-auto', { 'cursor-not-allowed': disabledEditButton })}>
							<Button
								htmlType={'button'}
								size={'small'}
								icon={<EditIcon />}
								className={cx('ant-btn noti-btn', {
									'pointer-events-none': disabledEditButton
								})}
								disabled={disabledEditButton}
								onClick={(e) => {
									e.stopPropagation()
									dispatch(initialize(FORM.EMPLOYEE_SERVICE_EDIT, field))
									setVisibleServiceEditModal(true)
								}}
							/>
						</span>
					</Tooltip>
				</div>
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
					onlyIcon
				/>
			</div>
		)
	}

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false} accordion>
				{fields.map((_field: any, index: number) => {
					const fieldData = fields.get(index)
					const categoryParameter = fieldData?.serviceCategoryParameter

					return (
						<Panel
							header={isEmployeeDetail ? panelHeaderRenderCategoryName(fieldData) : panelHeaderRenderEmployee(fieldData)}
							key={isEmployeeDetail ? fieldData.id : fieldData.employee.id}
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
											<React.Fragment key={parameterValue.id}>
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
											</React.Fragment>
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
