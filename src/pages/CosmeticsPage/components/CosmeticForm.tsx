import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Button } from 'antd'
import cx from 'classnames'

// utils
import { UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, FORM, STRINGS, DELETE_BUTTON_ID, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { showErrorNotification, checkUploadingBeforeSubmit, formFieldID, validationRequired } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'

// types
import { ICosmeticForm } from '../../../types/interfaces'

type ComponentProps = {
	cosmeticID?: string
	closeForm: () => void
	onDelete: () => void
}

type Props = InjectedFormProps<ICosmeticForm, ComponentProps> & ComponentProps

const CosmeticForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, cosmeticID, closeForm, onDelete, submitting, pristine } = props

	return (
		<Form layout={'vertical'} className={'w-full top-0 sticky overflow-hidden pt-1 px-6 pb-6 -mx-6'} onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)}>
			<div className={'h-full'}>
				<h3 className={'mb-0 mt-3 relative pr-7'}>
					{cosmeticID ? t('loc:Upraviť kozmetiku') : t('loc:Vytvoriť kozmetiku')}
					<Button className='noti-close-form-btn absolute top-1 right-0' onClick={() => closeForm()}>
						<CloseIcon />
					</Button>
				</h3>
				<Divider className={'my-3'} />

				<Field
					component={InputField}
					label={t('loc:Názov')}
					placeholder={STRINGS(t).enter(t('loc:názov'))}
					name={'name'}
					size={'large'}
					required
					className='w-full'
					validate={validationRequired}
				/>
				<Field
					className={'m-0 '}
					component={ImgUploadField}
					name={'image'}
					label={t('loc:Logo')}
					signUrl={URL_UPLOAD_IMAGES}
					category={UPLOAD_IMG_CATEGORIES.COSMETIC}
					multiple={false}
					maxCount={1}
				/>

				<div className={cx('flex w-full mt-6 gap-2 flex-wrap', { 'justify-between': cosmeticID, 'justify-center': !cosmeticID })}>
					{cosmeticID && (
						<DeleteButton
							onConfirm={onDelete}
							entityName={''}
							type={'default'}
							className='w-full xl:w-auto xl:min-w-40'
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							id={formFieldID(FORM.COSMETIC, DELETE_BUTTON_ID)}
						/>
					)}
					<Button
						className={'noti-btn w-full xl:w-auto xl:min-w-40'}
						size='middle'
						type='primary'
						htmlType='submit'
						disabled={submitting || pristine}
						loading={submitting}
						icon={cosmeticID ? <EditIcon /> : <CreateIcon />}
						id={formFieldID(FORM.COSMETIC, SUBMIT_BUTTON_ID)}
					>
						{cosmeticID ? t('loc:Uložiť') : STRINGS(t).createRecord(t('loc:kozmetiku'))}
					</Button>
				</div>
			</div>
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
