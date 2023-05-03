import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// validations
import validateVoucherForm from './validateVoucherForm'

// utils
import { FORM, SUBMIT_BUTTON_ID } from '../../../../utils/enums'
import { formFieldID } from '../../../../utils/helper'

// assets
import { ReactComponent as VoucherIcon } from '../../../../assets/icons/coupon.svg'

// types
import { IVoucherForm } from '../../../../types/interfaces'

// components
import InputField from '../../../../atoms/InputField'

type ComponentProps = {}

type Props = InjectedFormProps<IVoucherForm, ComponentProps> & ComponentProps

const VoucherForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row>
				<Col span={24}>
					<Field
						component={InputField}
						label={t('loc:Kupón')}
						name={'code'}
						size={'large'}
						prefix={(<VoucherIcon />) as any}
						placeholder={t('loc:Zadajte kód pre kupón')}
						required
						disabled={submitting}
					/>
				</Col>
			</Row>
			<Button
				id={formFieldID(FORM.VOUCHER_FORM, SUBMIT_BUTTON_ID)}
				className='noti-btn'
				block
				size='large'
				type='primary'
				htmlType='submit'
				disabled={submitting}
				loading={submitting}
			>
				{t('loc:Odoslať')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IVoucherForm, ComponentProps>({
	form: FORM.VOUCHER_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateVoucherForm
})(VoucherForm)

export default form
