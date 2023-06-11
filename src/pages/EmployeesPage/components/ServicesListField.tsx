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
import { FORM, PERMISSION, ROW_BUTTON_WITH_ID } from '../../../utils/enums'
import { formFieldID } from '../../../utils/helper'
import Permissions from '../../../utils/Permissions'
import { renderPriceAndDurationInfo } from '../../ServicesPage/serviceUtils'

// components
import DeleteButton from '../../../components/DeleteButton'
import AvatarComponents from '../../../components/AvatarComponents'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/icons/question.svg'
import { ReactComponent as CloudOfflineIcon } from '../../../assets/icons/cloud-offline-icon.svg'

// schema
import { IEmployeeServiceEditForm } from '../../../schemas/service'

const { Panel } = Collapse

type ComponentProps = {
	currencySymbol?: string
	setVisibleServiceEditModal: (visible: boolean) => void
	disabledEditButton?: boolean
	disabledEditButtonTooltip?: string
	// ak sa to rendruje vramci detailu zamestnanca
	isEmployeeDetail?: boolean
	disabled?: boolean
}

type Props = WrappedFieldArrayProps<IEmployeeServiceEditForm> & ComponentProps

const panelHeaderRenderCategoryName = (fieldData: IEmployeeServiceEditForm) => {
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

const panelHeaderRenderEmployee = (fieldData: IEmployeeServiceEditForm) => {
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
		isEmployeeDetail = true,
		disabled
	} = props
	const dispatch = useDispatch()

	const genExtra = (index: number, field: IEmployeeServiceEditForm) => {
		const salonPriceAndDuration = field?.salonPriceAndDurationData
		const employeePriceAndDuration = field?.employeePriceAndDurationData
		const hasOverridenData = field?.hasOverriddenPricesAndDurationData

		return (
			<div className={'flex gap-1 items-center ml-2'}>
				{!field?.useCategoryParameter && renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, hasOverridenData, currencySymbol)}
				<Permissions
					allowed={[PERMISSION.EMPLOYEE_UPDATE, PERMISSION.PARTNER_ADMIN]}
					render={(hasPermission, { openForbiddenModal }) => {
						return (
							<div onClick={(e) => e.stopPropagation()} className={'flex items-center'}>
								{/* // Workaround for disabled button inside tooltip: https://github.com/react-component/tooltip/issues/18 */}
								<Tooltip title={disabledEditButton ? disabledEditButtonTooltip : null} destroyTooltipOnHide>
									<span className={cx('w-full flex items-center md:w-auto', { 'cursor-not-allowed': disabledEditButton })}>
										<Button
											id={formFieldID(FORM.SERVICE_FORM, ROW_BUTTON_WITH_ID(field.employee.id))}
											htmlType={'button'}
											size={'small'}
											icon={<EditIcon className={'small-icon'} />}
											className={cx('ant-btn noti-btn', {
												'pointer-events-none': disabledEditButton || disabled
											})}
											disabled={disabledEditButton || disabled}
											onClick={(e) => {
												e.stopPropagation()
												if (hasPermission) {
													dispatch(initialize(FORM.EMPLOYEE_SERVICE_EDIT, field))
													setVisibleServiceEditModal(true)
												} else {
													openForbiddenModal()
												}
											}}
										/>
									</span>
								</Tooltip>
							</div>
						)
					}}
				/>
				<Permissions
					allowed={[PERMISSION.SERVICE_DELETE, PERMISSION.PARTNER_ADMIN]}
					render={(hasPermission, { openForbiddenModal }) => {
						return (
							<DeleteButton
								onConfirm={(e) => {
									e?.stopPropagation()
									if (hasPermission) {
										fields.remove(index)
									} else {
										openForbiddenModal()
									}
								}}
								disabled={disabled}
								onCancel={(e) => e?.stopPropagation()}
								smallIcon
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
								size={'small'}
								entityName={t('loc:službu')}
								type={'default'}
								onlyIcon
							/>
						)
					}}
				/>
			</div>
		)
	}

	return (
		<div id={'service-employees-list'}>
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
		</div>
	)
}

export default ServicesListField
