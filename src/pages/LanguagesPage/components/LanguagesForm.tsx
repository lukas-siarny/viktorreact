import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Button } from 'antd'
import cx from 'classnames'

// utils
import { UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, FORM, STRINGS, DELETE_BUTTON_ID, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { showErrorNotification, validationString, checkUploadingBeforeSubmit, formFieldID } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import DeleteButton from '../../../components/DeleteButton'
import Localizations from '../../../components/Localizations'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'

// types
import { ILanguageForm } from '../../../types/interfaces'

// validate
import validateLanguagesFrom from './validateLanguagesFrom'

type ComponentProps = {
	languageID?: string
	closeForm: () => void
	onDelete: () => void
}

type Props = InjectedFormProps<ILanguageForm, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const LanguagesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, languageID, closeForm, onDelete, submitting, pristine } = props

	return (
		<Form layout={'vertical'} className={'w-full top-0 sticky overflow-hidden pt-1 px-6 pb-6 -mx-6'} onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)}>
			<div className={'h-full '}>
				<h3 className={'mb-0 mt-3 relative pr-7'}>
					{languageID ? t('loc:Upraviť jazyk') : t('loc:Vytvoriť jazyk')}
					<Button className='noti-close-form-btn absolute top-1 right-0' onClick={() => closeForm()}>
						<CloseIcon />
					</Button>
				</h3>
				<Divider className={'my-3'} />
				<FieldArray
					key='nameLocalizations'
					name='nameLocalizations'
					component={Localizations}
					placeholder={t('loc:Zadajte názov')}
					horizontal
					className={'flex-1 noti-languages-localizations'}
					ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
					customValidate={fixLength255}
					noSpace
					mainField={
						<Field
							className='mb-0 pb-0'
							component={InputField}
							label={t('loc:Názov jazyka (EN)')}
							placeholder={t('loc:Zadajte názov')}
							key='nameLocalizations[0].value'
							name='nameLocalizations[0].value'
							required
							validate={fixLength255}
						/>
					}
				/>
				<Field component={ImgUploadField} name='image' label={t('loc:Vlajka')} maxCount={1} signUrl={URL_UPLOAD_IMAGES} category={UPLOAD_IMG_CATEGORIES.LANGUAGE_IMAGE} />

				<div className={cx('flex w-full mt-6 gap-2 flex-wrap', { 'justify-between': languageID, 'justify-center': !languageID })}>
					{languageID && (
						<DeleteButton
							onConfirm={onDelete}
							entityName={''}
							id={formFieldID(FORM.LANGUAGES, DELETE_BUTTON_ID)}
							type={'default'}
							className='w-full xl:w-auto xl:min-w-40'
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
						/>
					)}
					<Button
						className={'noti-btn w-full xl:w-auto xl:min-w-40'}
						size='middle'
						type='primary'
						htmlType='submit'
						disabled={submitting || pristine}
						loading={submitting}
						id={formFieldID(FORM.LANGUAGES, SUBMIT_BUTTON_ID)}
						icon={languageID ? <EditIcon /> : <CreateIcon />}
					>
						{languageID ? t('loc:Uložiť') : STRINGS(t).createRecord(t('loc:jazyk'))}
					</Button>
				</div>
			</div>
		</Form>
	)
}

const form = reduxForm<ILanguageForm, ComponentProps>({
	form: FORM.LANGUAGES,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateLanguagesFrom
})(withPromptUnsavedChanges(LanguagesForm))

export default form
