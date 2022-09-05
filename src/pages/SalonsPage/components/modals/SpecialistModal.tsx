import React, { useEffect, useState } from 'react'
import { Empty, Modal, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'

// reducers
import { getSpecialistContact, getSpecialistContacts } from '../../../../reducers/specialistContacts/specialistContactsActions'

// types
import { RootState } from '../../../../reducers'
import { LOCALES } from '../../../../components/LanguagePicker'

// utils
import { DEFAULT_LANGUAGE, ENUMERATIONS_KEYS, LANGUAGE } from '../../../../utils/enums'
import i18n from '../../../../utils/i18n'
import { getCountryPrefix, optionRenderWithImage } from '../../../../utils/helper'

type Props = {
	visible: boolean
	onCancel: () => void
}

const { Option } = Select

const SpecialistModal = (props: Props) => {
	const { visible, onCancel } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const specialistContacts = useSelector((state: RootState) => state.specialistContacts.specialistContacts)
	const specialistContact = useSelector((state: RootState) => state.specialistContacts.specialistContact)

	const countries = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const contactPhonePrefix = getCountryPrefix(countries.data, specialistContact?.data?.phonePrefixCountryCode)

	const [view, setView] = useState<'empty' | 'default' | 'not_found'>()

	const isLoading = specialistContacts?.isLoading || specialistContact?.isLoading || countries?.isLoading

	useEffect(() => {
		const fetchData = async () => {
			const specialistContactsData = await dispatch(getSpecialistContacts())

			if (isEmpty(specialistContactsData.data)) {
				setView('empty')
				return
			}

			if (specialistContact.data) {
				setView('default')
				return
			}

			const lng = (i18n.language || DEFAULT_LANGUAGE) as LANGUAGE
			const langToCompare = LOCALES[lng]?.countryCode?.toLowerCase()
			const currentLngCountry = specialistContactsData?.data?.find((specialist) => specialist.country?.code?.toLowerCase() === langToCompare)

			if (currentLngCountry?.id) {
				await dispatch(getSpecialistContact(currentLngCountry?.id))
				setView('default')
				return
			}

			dispatch(getSpecialistContact())
			setView('not_found')
		}

		fetchData()
	}, [dispatch, specialistContact.data])

	const handleCountryChange = async (item: any) => {
		await dispatch(getSpecialistContact(item.value))
		setView('default')
	}

	const specialistContent = () => {
		if (view === 'empty') {
			return (
				<div className={'w-full justify-center px-4'}>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('loc:Ľutujeme, momentálne nie sú k dispozící žiadni špecialisti.')} />
				</div>
			)
		}

		return (
			<section className={'noti-specialist-contact-wrapper'}>
				<label htmlFor={'noti-specialist-select'} className={'block'}>
					{t('loc:Zvoľte si krajinu')}
				</label>
				<Select
					id={'noti-specialist-select'}
					onChange={handleCountryChange}
					value={specialistContact?.data?.id}
					style={{ zIndex: 999 }}
					className={'noti-select-input w-full'}
					size={'large'}
					labelInValue
					dropdownClassName={'noti-select-dropdown dropdown-match-select-width'}
					getPopupContainer={() => document.querySelector('.noti-specialist-contact-wrapper') as HTMLElement}
				>
					{specialistContacts?.options?.map((option: any) => (
						<Option value={option.value} key={option.key}>
							{optionRenderWithImage(option, <GlobeIcon />)}
						</Option>
					))}
				</Select>
				{(() => {
					if (view === 'not_found') {
						return <p className={'my-5 text-center not-found-msg'}>{t('loc:Ľutujeme, pre zvolenú krajinu moménalne neexistuje žiadny špecialista')}</p>
					}
					if (view === 'default') {
						return (
							<div>
								<ul className={'noti-contact-list mb-0 mt-4'}>
									{contactPhonePrefix && specialistContact?.data?.phone && (
										<li className={'phone-list-item'}>{`${contactPhonePrefix} ${specialistContact.data.phone}`}</li>
									)}
									{<li className={'email-list-item'}>{specialistContact?.data?.email || <i>{t('loc:Email nie je k dispozícii')}</i>}</li>}
								</ul>
							</div>
						)
					}
					return null
				})()}
			</section>
		)
	}

	return (
		<Modal key={'noti-specialist'} visible={visible} footer={null} closable={false} className={'noti-specialist-modal'} width={450} centered onCancel={onCancel}>
			<div className={'noti-specialist-modal-content'}>
				<header>
					<button type={'button'} onClick={onCancel}>
						<CloseIcon />
					</button>
					<h1>{t('loc:Notino Špecialista')}</h1>
				</header>
				<Spin spinning={isLoading}>
					<main>
						<p>{t('loc:Neviete vyplniť svoj profil salónu? Nedarí sa vám spraviť pekné fotky?')}</p>
						<p>
							<strong>{t('loc:Nevadí, radi vám s tým pomôžeme. Ak využijete naše služby, získate')}</strong>
						</p>
						<ul className={'what-you-get-list'}>
							<li>{t('loc:profesionálne vyplnené údaje o salóne,')}</li>
							<li>{t('loc:zabezpečíme fotografa, ktorý spraví profi fotografie vašich priestorov a tímu,')}</li>
							<li>{t('loc:nami vyplnený profil salónu automaticky schválime')}</li>
						</ul>
						<p>
							{t('loc:Cena')}: {t('loc:zdarma')}
						</p>
						<div>
							<h2>{t('loc:Kontaktovať Špecialistu')}</h2>
							<div className={'ant-form-item mb-0'}>{specialistContent()}</div>
						</div>
					</main>
				</Spin>
			</div>
		</Modal>
	)
}

export default SpecialistModal
