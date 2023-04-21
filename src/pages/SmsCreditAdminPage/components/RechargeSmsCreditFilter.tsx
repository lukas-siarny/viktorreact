import React, { useCallback, useMemo, useState } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Badge, Button, Col, Collapse, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FILTER_BUTTON_ID, FORM, RESET_BUTTON_ID, ROW_GUTTER_X_M, SALON_SOURCE_TYPE, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, formFieldID, optionRenderWithImage, optionRenderWithTag, validationString } from '../../../utils/helper'

// components
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import InputNumberField from '../../../atoms/InputNumberField'

// types
import { IEnumerationsCountriesPayload, ILoadingAndFailure, IRechargeSmsCreditFilter } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as FilterIcon } from '../../../assets/icons/filter.svg'

// redux
import { IEnumerationsCurrenciesPayload } from '../../../reducers/enumerations/enumerationActions'

const { Panel } = Collapse

type ComponentProps = {
	onResetFilter: (e: any) => void
	currency?: NonNullable<IEnumerationsCurrenciesPayload['data']>[0]
	countries?: IEnumerationsCountriesPayload & ILoadingAndFailure
	disabledFilter?: boolean
}

type Props = InjectedFormProps<IRechargeSmsCreditFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const RechargeSmsCreditFilter = (props: Props) => {
	const { handleSubmit, form, onResetFilter, countries, currency, disabledFilter } = props
	const [t] = useTranslation()

	const [visible, setVisible] = useState<undefined | string>(undefined)

	const sourceOptions = useMemo(
		() => [
			{ label: t('loc:Notino'), value: SALON_SOURCE_TYPE.NOTINO, key: SALON_SOURCE_TYPE.NOTINO, tagClassName: 'bg-source-notino' },
			{ label: t('loc:Partner'), value: SALON_SOURCE_TYPE.PARTNER, key: SALON_SOURCE_TYPE.PARTNER, tagClassName: 'bg-source-partner' },
			{ label: t('loc:Import'), value: SALON_SOURCE_TYPE.IMPORT, key: SALON_SOURCE_TYPE.IMPORT, tagClassName: 'bg-source-import' }
		],
		[t]
	)

	const onClick = useCallback(() => {
		const activeKey = visible === '1' ? undefined : '1'
		setVisible(activeKey)
	}, [visible])

	const formValues = useSelector((state: RootState) => state.form?.[FORM.RECHARGE_SMS_CREDIT_FILTER])?.values

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0 mb-4 noti-sms-credits-filter'}>
			<Collapse collapsible={'disabled'} activeKey={visible} ghost className='ghost-filters'>
				<Panel
					header={
						<Row justify={'space-between'} gutter={ROW_GUTTER_X_M}>
							<Col span={8}>
								<Field
									component={SelectField}
									optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
									name={'countryCode'}
									label={t('loc:Krajina')}
									placeholder={t('loc:Krajina')}
									className={'country-selection'}
									size={'large'}
									filterOptions
									onDidMountSearch
									options={countries?.enumerationsOptions}
									loading={countries?.isLoading}
									disabled={countries?.isLoading}
									required
								/>
							</Col>
							<Col span={8}>
								<Field
									className={'h-10 p-0 m-0 mt-6 w-full'}
									component={InputField}
									size={'large'}
									placeholder={t('loc:Hľadať podľa názvu, adresy')}
									name='search'
									fieldMode={FIELD_MODE.FILTER}
									search
									validate={fixLength255}
									disabled={disabledFilter}
								/>
							</Col>
							<Col span={8}>
								<div className={'relative w-10 h-10 mt-6'}>
									<Button
										id={formFieldID(form, FILTER_BUTTON_ID)}
										onClick={onClick}
										htmlType='button'
										type='dashed'
										size={'large'}
										className={'noti-btn w-full h-full p-0 flex items-center justify-center'}
									>
										<FilterIcon className={'relative top-0 left-0 text-black'} style={{ transform: 'translate(0,0)' }} />
									</Button>
									<Badge
										count={checkFiltersSizeWithoutSearch(formValues)}
										className={'absolute mr-1'}
										style={{ top: '-48px', right: '-30px', background: '#DC0069' }}
									/>
								</div>
							</Col>
						</Row>
					}
					showArrow={false}
					key='1'
				>
					<Row gutter={ROW_GUTTER_X_M}>
						<Col span={8}>
							<Field
								component={SelectField}
								name={'sourceType'}
								placeholder={t('loc:Zdroj vytvorenia')}
								className={'select-with-tag-options'}
								allowClear
								size={'large'}
								filterOptions
								onDidMountSearch
								options={sourceOptions}
								optionRender={optionRenderWithTag}
								disabled={disabledFilter}
							/>
						</Col>
						<Col span={16}>
							<Row gutter={ROW_GUTTER_X_M} wrap={false}>
								<Col flex='auto'>
									<Row gutter={ROW_GUTTER_X_M} className={'wallet-available-balance'}>
										<span className={'from-to-divider'} />
										<Col span={12}>
											<Field
												component={InputNumberField}
												prefix={currency?.symbol}
												name={'walletAvailableBalanceFrom'}
												placeholder={t('loc:Od')}
												size={'large'}
												min={0}
												disabled={disabledFilter}
											/>
										</Col>
										<Col span={12}>
											<Field
												component={InputNumberField}
												name={'walletAvailableBalanceTo'}
												placeholder={t('loc:Do')}
												size={'large'}
												min={0}
												prefix={currency?.symbol}
												disabled={disabledFilter}
											/>
										</Col>
									</Row>
								</Col>
								<Col>
									<Button
										id={formFieldID(FORM.RECHARGE_SMS_CREDIT_FILTER, RESET_BUTTON_ID)}
										type={'dashed'}
										size={'middle'}
										className={'noti-btn'}
										htmlType={'button'}
										onClick={onResetFilter}
										disabled={disabledFilter}
									>
										{t('loc:Resetovať')}
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Panel>
			</Collapse>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.RECHARGE_SMS_CREDIT_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(RechargeSmsCreditFilter)

export default form
