import React, { FC, useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Button } from 'antd'

// utils
import { isEmpty } from 'lodash'
import {FORM } from '../../../utils/enums'
import { showErrorNotification } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// types
import { ICosmeticForm } from '../../../types/interfaces'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

type ComponentProps = {
	cosmeticID?: string
	closeForm: () => void
	onDelete: () => void
	usedBrands?: string[]
}

type Props = InjectedFormProps<ICosmeticForm, ComponentProps> & ComponentProps

const CosmeticForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, cosmeticID, closeForm, onDelete, submitting, pristine } = props

	const disabledForm = false

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-8 xl:mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 relative pr-7'}>
						{cosmeticID ? t('loc:Upraviť kozmetiku') : t('loc:Vytvoriť kozmetiku')}
						<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={() => closeForm()}>
							<CloseIcon />
						</Button>
					</h3>
					<Divider className={'my-3'} />
					<Field
						className={'w-12/25'}
						component={InputField}
						label={t('loc:Email')}
						placeholder={t('loc:Zadajte email')}
						name={'companyContactPerson.email'}
						size={'large'}
						disabled={disabledForm}
						required
					/>
					<PhoneWithPrefixField
						label={'Telefón'}
						placeholder={t('loc:Zadajte telefón')}
						size={'large'}
						prefixName={'companyContactPerson.phonePrefixCountryCode'}
						phoneName={'companyContactPerson.phone'}
						disabled={disabledForm}
						className='w-12/25'
						formName={FORM.SALON}
						required
					/>
					<div className={'flex w-full justify-around space-between mt-10 gap-2 flex-wrap'}>
						{cosmeticID && (
							<DeleteButton
								onConfirm={onDelete}
								entityName={''}
								type={'default'}
								className='w-40'
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						)}
						<Button className={'noti-btn w-40'} size='middle' type='primary' htmlType='submit' disabled={submitting || pristine} loading={submitting}>
							{cosmeticID ? t('loc:Uložiť') : t('loc: Vytvoriť')}
						</Button>
					</div>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<ICosmeticForm, ComponentProps>({
	form: FORM.COSMETIC,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(CosmeticForm)

export default form
