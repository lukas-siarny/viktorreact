import React, { FC, useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Button } from 'antd'

// utils
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import { ENUMERATIONS_KEYS, FORM } from '../../../utils/enums'
import { optionRenderWithImage, showErrorNotification } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

// types
import { ISpecialistContactForm } from '../../../types/interfaces'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import { RootState } from '../../../reducers'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	specialistContactID?: string
	closeForm: () => void
	onDelete: () => void
	disabledForm?: boolean
}

type Props = InjectedFormProps<ISpecialistContactForm, ComponentProps> & ComponentProps

const SpecialistContactForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, specialistContactID, closeForm, onDelete, submitting, pristine, disabledForm } = props

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	// povolime jeden support contact pre jednu krajinu alebo viacej ?
	/* const countriesOptions = countries?.enumerationsOptions?.map((country) => {
		const alreadyExists = supportContacts?.data?.supportContacts?.find((supportCountry) => supportCountry.country.code === (country.value as string))

		return {
			...country,
			disabled: country?.value !== formValues?.countryCode && !!alreadyExists
		}
	}) */

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-8 xl:mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 relative pr-7'}>
						{specialistContactID ? t('loc:Upraviť špecialistu') : t('loc:Vytvoriť špecialistu')}
						<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={() => closeForm()}>
							<CloseIcon />
						</Button>
					</h3>
					<Divider className={'my-3'} />
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
						label={t('loc:Krajina')}
						placeholder={t('loc:Vyberte krajinu')}
						options={countries.enumerationsOptions}
						name={'countryCode'}
						size={'large'}
						loading={countries?.isLoading}
						required
						disabled={disabledForm}
					/>
					<PhoneWithPrefixField
						label={'Telefón'}
						placeholder={t('loc:Zadajte telefón')}
						size={'large'}
						prefixName={'phonePrefixCountryCode'}
						phoneName={'phone'}
						disabled={disabledForm}
						formName={FORM.SPECIALIST_CONTACT}
						required
					/>
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} disabled={disabledForm} />
					<div className={'flex w-full justify-around space-between mt-10 gap-2 flex-wrap'}>
						{specialistContactID && (
							<DeleteButton
								onConfirm={onDelete}
								entityName={''}
								type={'default'}
								className='w-40'
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						)}
						<Button className={'noti-btn w-40'} size='middle' type='primary' htmlType='submit' disabled={submitting || pristine} loading={submitting}>
							{specialistContactID ? t('loc:Uložiť') : t('loc: Vytvoriť')}
						</Button>
					</div>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<ISpecialistContactForm, ComponentProps>({
	form: FORM.SPECIALIST_CONTACT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(SpecialistContactForm)

export default form
