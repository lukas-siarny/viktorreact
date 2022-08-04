import React, { FC, useCallback } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Button } from 'antd'

// utils
import { isEmpty } from 'lodash'
import { UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, FORM, STRINGS, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { showErrorNotification, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import DeleteButton from '../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// types
import { ILanguageForm } from '../../../types/interfaces'
import Localizations from '../../../components/Localizations'

type ComponentProps = {
	languageID: number
	closeForm: () => void
	onDelete: () => void
}

type Props = InjectedFormProps<ILanguageForm, ComponentProps> & ComponentProps

const fixLength255 = validationString(255)

const LanguagesForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, languageID, closeForm, onDelete, submitting, pristine } = props

	return (
		<Form layout={'vertical'} className={'form w-full top-0 sticky'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-8 xl:mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3 relative pr-7'}>
						{languageID > 0 ? t('loc:Upraviť jazyk') : t('loc:Vytvoriť jazyk')}
						<Button className='absolute top-1 right-0 p-0 border-none shadow-none' onClick={() => closeForm()}>
							<CloseIcon />
						</Button>
					</h3>
					<Divider className={'my-3'} />
					<Row className={'w-full gap-4'} justify='space-between'>
						<FieldArray
							key='nameLocalizations'
							name='nameLocalizations'
							component={Localizations}
							placeholder={t('loc:Zadajte názov')}
							horizontal
							className={'flex-1 noti-languages-localizations'}
							ignoreFieldIndex={0} // do not render "0" field because it is rendered in mainField prop
							customValidate={fixLength255}
							mainField={
								<Field
									className='mb-0'
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
						<Field
							component={ImgUploadField}
							name='flag'
							label={t('loc:Vlajka')}
							maxCount={1}
							signUrl={URL_UPLOAD_IMAGES}
							category={UPLOAD_IMG_CATEGORIES.CATEGORY}
							required
						/>
					</Row>
					<div className={'flex w-full justify-around space-between mt-10 gap-2 flex-wrap'}>
						{languageID > 0 && (
							<DeleteButton
								onConfirm={onDelete}
								entityName={''}
								type={'default'}
								className='w-40'
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						)}
						<Button className={'noti-btn w-40'} size='middle' type='primary' htmlType='submit' disabled={submitting || pristine} loading={submitting}>
							{languageID > 0 ? t('loc:Uložiť') : t('loc: Vytvoriť')}
						</Button>
					</div>
				</Row>
			</Col>
		</Form>
	)
}

const form = reduxForm<ILanguageForm, ComponentProps>({
	form: FORM.LANGUAGES,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(LanguagesForm)

export default form
