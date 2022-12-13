import React, { FC, MouseEventHandler, ReactNode } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Space, Collapse, Tag, Button, Row, Col } from 'antd'
import cx from 'classnames'
import { isEmpty } from 'lodash'

// utils
import { FORM, STRINGS, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { showErrorNotification, validationNumberMin } from '../../../utils/helper'

// types
import { IEmployeeServiceEditForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import DeleteButton from '../../../components/DeleteButton'

// validations
import validateEmployeeServiceEditForm from './validateEmployeeServiceEditForm'

// assets
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'

// reducers
import { RootState } from '../../../reducers'

const { Panel } = Collapse

type ComponentProps = {}

type Props = InjectedFormProps<IEmployeeServiceEditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const EmployeeServiceEditForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const formValues: Partial<IEmployeeServiceEditForm> = useSelector((state: RootState) => getFormValues(FORM.EMPLOYEE)(state))
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const services = useSelector((state: RootState) => state.service.services)

	const variableDuration = false
	const variablePrice = false

	return (
		<Form id={`${FORM.EMPLOYEE}-form`} layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Row gutter={8} align='middle'>
				<Col span={8}>
					<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={`variableDuration`} size={'middle'} />
				</Col>
				<Col span={variableDuration ? 8 : 16}>
					<Field
						component={InputNumberField}
						label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
						placeholder={t('loc:min')}
						name={`durationFrom`}
						precision={0}
						step={1}
						maxChars={3}
						size={'large'}
						validate={[numberMin0]}
						required
					/>
				</Col>

				{variableDuration && (
					<Col span={8}>
						<Field
							component={InputNumberField}
							label={t('loc:Trvanie do (minúty)')}
							placeholder={t('loc:min')}
							name={`durationTo`}
							precision={0}
							step={1}
							maxChars={3}
							size={'large'}
							validate={[numberMin0]}
							required
						/>
					</Col>
				)}
			</Row>
			<Divider />
			<Row gutter={8} align='middle'>
				<Col span={8}>
					<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={`variablePrice`} size={'middle'} />
				</Col>
				<Col span={variablePrice ? 8 : 16}>
					<Field
						component={InputNumberField}
						label={
							variablePrice
								? t('loc:Cena od ({{symbol}})', { symbol: salon.data?.currency.symbol })
								: t('loc:Cena ({{symbol}})', { symbol: salon.data?.currency.symbol })
						}
						placeholder={salon.data?.currency.symbol}
						name={`priceFrom`}
						precision={2}
						step={1}
						maxChars={5}
						size={'large'}
						validate={[numberMin0]}
						required
					/>
				</Col>
				{variablePrice && (
					<Col span={8}>
						<Field
							component={InputNumberField}
							label={t('loc:Cena do ({{symbol}})', { symbol: salon.data?.currency.symbol })}
							placeholder={salon.data?.currency.symbol}
							name={`priceTo`}
							precision={2}
							step={1}
							maxChars={5}
							size={'large'}
							validate={[numberMin0]}
							required
						/>
					</Col>
				)}
			</Row>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit'>
				{STRINGS(t).save(t('loc:službu'))}
			</Button>
		</Form>
	)
}

const form = reduxForm<IEmployeeServiceEditForm, ComponentProps>({
	form: FORM.EMPLOYEE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateEmployeeServiceEditForm
})(EmployeeServiceEditForm)

export default form
