import React, { FC, useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Button } from 'antd'

// utils
import { isEmpty } from 'lodash'
import { UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, FORM, STRINGS, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { showErrorNotification, checkUploadingBeforeSubmit } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// types
import { ICosmeticForm } from '../../../types/interfaces'

type ComponentProps = {
	cosmeticID?: string
	closeForm: () => void
	onDelete: () => void
	usedBrands?: string[]
}

type Props = InjectedFormProps<ICosmeticForm, ComponentProps> & ComponentProps

const CosmeticForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, cosmeticID, closeForm, onDelete, usedBrands = [], submitting, pristine } = props

	const validateName = useCallback(
		(value: string) => {
			if (isEmpty(value)) {
				return t('loc:Toto pole je povinné')
			}

			if (value.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
				return t('loc:Max. počet znakov je {{max}}', {
					max: VALIDATION_MAX_LENGTH.LENGTH_100
				})
			}

			// each cosmetic name is unique brand and can be created only once
			if (!cosmeticID && usedBrands.includes(value)) {
				return t('loc:Kozmetika so zadaným názvom už existuje')
			}

			return undefined
		},
		[usedBrands, t, cosmeticID]
	)

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)}>
			<Col className={'flex'}>
				<Row className={'mx-8 xl:mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 relative pr-7'}>
						{cosmeticID ? t('loc:Upraviť kozmetiku') : t('loc:Vytvoriť kozmetiku')}
						<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={() => closeForm()}>
							<CloseIcon />
						</Button>
					</h3>
					<Divider className={'my-3'} />
					<Row className={'w-full items-center'} justify='space-between'>
						<Field
							component={InputField}
							label={t('loc:Názov')}
							placeholder={STRINGS(t).enter(t('loc:názov'))}
							name={'name'}
							size={'large'}
							required
							className='w-full xl:w-1/2'
							validate={validateName}
						/>
						<Field
							className={'m-0 w-full xl:w-1/3'}
							component={ImgUploadField}
							name={'image'}
							label={t('loc:Logo')}
							signUrl={URL_UPLOAD_IMAGES}
							category={UPLOAD_IMG_CATEGORIES.COSMETIC}
							multiple={false}
							maxCount={1}
						/>
					</Row>
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
