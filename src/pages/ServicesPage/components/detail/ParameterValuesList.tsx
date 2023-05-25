import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, WrappedFieldArrayProps } from 'redux-form'
import { Col, Collapse, Row } from 'antd'
import cx from 'classnames'

// atoms
import InputNumberField from '../../../../atoms/InputNumberField'
import SwitchField from '../../../../atoms/SwitchField'

// utils
import { renderFromTo } from '../../serviceUtils'
import { validationNumberMin } from '../../../../utils/helper'

// assets
import { ReactComponent as ClockIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../../assets/icons/coupon.svg'

// schema
import { IParameterValue } from '../../../../schemas/service'

const { Panel } = Collapse

const numberMin0 = validationNumberMin(0)

type Props = WrappedFieldArrayProps<IParameterValue> & {
	showDuration?: boolean
	currencySymbol?: string
	form: any
	disabled?: boolean
}

const ParameterValuesList: FC<Props> = (props) => {
	const [t] = useTranslation()
	const {
		fields,
		meta: { error, invalid },
		showDuration,
		currencySymbol,
		form
	} = props

	const formErrors = form?.syncErrors?.serviceCategoryParameter || []
	const isFieldArrayError = invalid && error

	const genExtra = (fieldData: IParameterValue, field: string) => {
		return (
			<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
				<div className={'flex'}>
					{showDuration &&
						renderFromTo(
							fieldData?.durationFrom,
							fieldData?.durationTo,
							!!fieldData?.variableDuration,
							<ClockIcon className={'text-notino-black'} />,
							t('loc:min'),
							'mr-3'
						)}
					{renderFromTo(fieldData?.priceFrom, fieldData?.priceTo, !!fieldData?.variablePrice, <CouponIcon />, currencySymbol, 'mr-3')}
					<Field
						className={'mb-0 pb-0'}
						disabled={props.disabled}
						component={SwitchField}
						onClick={(_checked: boolean, event: Event) => event.stopPropagation()}
						name={`${field}.useParameter`}
						size={'middle'}
					/>
				</div>
			</div>
		)
	}

	return (
		<>
			{isFieldArrayError && (
				<div role='alert' className='text-danger'>
					{error}
				</div>
			)}
			<Collapse className={cx('collapse-list', { 'error-border': isFieldArrayError })} bordered={false}>
				{fields.map((field, index: number) => {
					const fieldData = fields.get(index)
					const variableDuration = fieldData?.variableDuration
					const variablePrice = fieldData?.variablePrice
					const useParameter = fieldData?.useParameter
					const hasError = formErrors[index]?.error

					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div className={'list-title leading-7'}>{fieldData?.name}</div>
								</div>
							}
							key={index}
							forceRender
							extra={genExtra(fieldData, field)}
							collapsible={useParameter ? undefined : 'disabled'}
							className={cx({ 'collapse-header-has-error': hasError })}
						>
							{showDuration && (
								<Row gutter={8} align='top' justify='center'>
									<Col className={'mt-5'} span={8}>
										<Field
											className={'mb-0'}
											component={SwitchField}
											label={t('loc:Variabilné trvanie')}
											name={`${field}.variableDuration`}
											size={'middle'}
											disabled={!useParameter || props.disabled}
										/>
									</Col>
									<Col span={variableDuration ? 8 : 16}>
										<Field
											component={InputNumberField}
											label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
											placeholder={t('loc:min')}
											name={`${field}.durationFrom`}
											precision={0}
											step={1}
											min={0}
											max={999}
											size={'large'}
											validate={[numberMin0]}
											disabled={!useParameter || props.disabled}
											required
										/>
									</Col>
									{variableDuration && (
										<Col span={8}>
											<Field
												component={InputNumberField}
												label={t('loc:Trvanie do (minúty)')}
												placeholder={t('loc:min')}
												name={`${field}.durationTo`}
												precision={0}
												step={1}
												min={0}
												max={999}
												size={'large'}
												validate={[numberMin0]}
												disabled={!useParameter || props.disabled}
												required
											/>
										</Col>
									)}
								</Row>
							)}
							<Row gutter={8} align='top' justify='center'>
								<Col className={'mt-5'} span={8}>
									<Field
										className={'mb-0'}
										component={SwitchField}
										label={t('loc:Variabilná cena')}
										name={`${field}.variablePrice`}
										size={'middle'}
										disabled={!useParameter || props.disabled}
									/>
								</Col>
								<Col span={variablePrice ? 8 : 16}>
									<Field
										component={InputNumberField}
										label={variablePrice ? t('loc:Cena od ({{symbol}})', { symbol: currencySymbol }) : t('loc:Cena ({{symbol}})', { symbol: currencySymbol })}
										placeholder={currencySymbol}
										name={`${field}.priceFrom`}
										precision={2}
										step={1}
										min={0}
										size={'large'}
										validate={[numberMin0]}
										disabled={!useParameter || props.disabled}
										required
									/>
								</Col>
								{variablePrice && (
									<Col span={8}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: currencySymbol })}
											placeholder={currencySymbol}
											name={`${field}.priceTo`}
											precision={2}
											step={1}
											min={0}
											size={'large'}
											validate={[numberMin0]}
											disabled={!useParameter || props.disabled}
											required
										/>
									</Col>
								)}
							</Row>
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

export default ParameterValuesList