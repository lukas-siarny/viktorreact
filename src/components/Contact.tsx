import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import emailjs from 'emailjs-com'
import { TFunction } from 'i18next'
import { toast } from 'react-toastify'
import ListDivided from './ListDivided'
import { SECTIONS } from '../utils/enums'
import { ReactComponent as SuccesIcon } from '../assets/check-circle-icon.svg'
import { ReactComponent as ErrorIcon } from '../assets/alert-circle-icon.svg'
import { ReactComponent as LoadingIcon } from '../assets/loading-icon.svg'

const SERVICE_ID = 'service_gwu9msx'
const TEMPLATE_ID = 'template_gfznzes'
const PUBLIC_KEY = '5-1IF9iQq_K5_VvR5'

type FormValues = {
	name: string
	email: string
	subject?: string
	message: string
}

type FormErrors = {
	name?: string
	email?: string
	subject?: string
	message?: string
}

const DEFAULT_VALUES: FormValues = {
	name: '',
	email: '',
	subject: '',
	message: ''
}

// eslint-disable-next-line no-useless-escape
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const validateForm = (values: FormValues, t: TFunction) => {
	let errors: FormErrors = {}

	if (!values.name) {
		errors = {
			...errors,
			name: t('loc:Toto pole je povinné')
		}
	}

	if (!values.email) {
		errors = {
			...errors,
			email: t('loc:Toto pole je povinné')
		}
	}

	if (values.email && !emailRegex.test(values.email)) {
		errors = {
			...errors,
			email: t('loc:Nesprávny formát e-mailovej adresy')
		}
	}

	if (!values.message) {
		errors = {
			...errors,
			message: t('loc:Toto pole je povinné')
		}
	}

	return errors
}

const Contact = () => {
	const { t, i18n } = useTranslation()
	const [formValues, setFormValues] = useState<FormValues>(DEFAULT_VALUES)
	const [formErrors, setFormErrors] = useState<FormErrors>(DEFAULT_VALUES)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const sections = SECTIONS[i18n.language as keyof typeof SECTIONS]

	const handleSubmit = async () => {
		const errors = validateForm(formValues, t)
		setFormErrors(errors)

		if (Object.keys(errors).length) {
			return
		}

		const { name, email, subject, message } = formValues

		try {
			setIsSubmitting(true)
			const templateParams = {
				from_name: name,
				from_email: email,
				email_subject: subject,
				message
			}
			await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
			setFormValues(DEFAULT_VALUES)
			toast(
				<div className={'toast-content-body'}>
					<SuccesIcon />
					{t('loc:Vaša správa bola úspešne odoslaná!')}
				</div>,
				{
					className: 'submit-feedback success'
				}
			)
		} catch (e) {
			toast(
				<div className={'toast-content-body'}>
					<ErrorIcon />
					{t('loc:Vašu správu sa nepodarilo odoslať. Skúste to znova prosím.')}
				</div>,
				{
					className: 'submit-feedback error'
				}
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='section-base contact' id={sections.CONTACT}>
			<div className='contact-content container'>
				<h2>{t('loc:Kontakt')}</h2>
				<address>
					<Trans defaults={t('loc:SNP 24<br />Slovenská Ľupča 976 13 , Slovensko')} components={{ strong: <strong /> }} />
					<br />
					<br />
					<ListDivided items={[<a href='mailto:kabekovo@gmail.com'>kabekovo@gmail.com</a>, <a href='tel:+421910539872'>+421 910 539 872</a>]} />
				</address>
				<span className={'divider'}>{t('loc:alebo využite kontaktný formulár')}</span>
				<form onSubmit={(e) => e.preventDefault()} className={'contact-form'}>
					<div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
						<label htmlFor='name'>{t('loc:Meno')}*</label>
						<input
							id='name'
							type='text'
							name='name'
							placeholder={t('loc:Zadajte svoje meno')}
							value={formValues.name}
							onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
						/>
						<span className={'error'}>{formErrors.name}</span>
					</div>

					<div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
						<label htmlFor='email'>{t('loc:E-mail')}*</label>
						<input
							id='email'
							name='email'
							type='text'
							placeholder={t('loc:Zadajte svoj e-mail')}
							value={formValues.email}
							onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
						/>
						<span className={'error'}>{formErrors.email}</span>
					</div>

					<div className={`form-group ${formErrors.subject ? 'has-error' : ''}`}>
						<label htmlFor='subject'>{t('loc:Predmet správy')}</label>
						<input
							id='subject'
							name='subject'
							type='text'
							placeholder={t('loc:Zadajte predmet správy')}
							value={formValues.subject}
							onChange={(e) => setFormValues((prev) => ({ ...prev, subject: e.target.value }))}
						/>
						<span className={'error'}>{formErrors.subject}</span>
					</div>

					<div className={`form-group ${formErrors.message ? 'has-error' : ''}`}>
						<label htmlFor='message'>{t('loc:Správa')}*</label>
						<textarea
							id='message'
							name='message'
							placeholder={t('loc:Zadajte správu')}
							rows={4}
							cols={50}
							value={formValues.message}
							onChange={(e) => setFormValues((prev) => ({ ...prev, message: e.target.value }))}
						/>
						<span className={'error'}>{formErrors.message}</span>
					</div>

					<button
						type={'submit'}
						onClick={handleSubmit}
						className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
						disabled={formValues === DEFAULT_VALUES || isSubmitting}
					>
						<LoadingIcon />
						{t('loc:Odoslať')}
					</button>
				</form>
			</div>
		</section>
	)
}

export default Contact
