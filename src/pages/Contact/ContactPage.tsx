import React, { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Select, Collapse, Spin, Result } from 'antd'
import { isEmpty } from 'lodash'

// reducers
import { getSupportContact, getSupportContacts, getSupportContactsOptions } from '../../reducers/supportContacts/supportContactsActions'
import { RootState } from '../../reducers'

// utils
import { getCountryPrefix, getSupportContactCountryName, translateDayName } from '../../utils/helper'
import { DAYS, ENUMERATIONS_KEYS, LANGUAGE } from '../../utils/enums'
import i18n from '../../utils/i18n'

// assets
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone-pink.svg'
import { ReactComponent as TimerIcon } from '../../assets/icons/clock-pink.svg'
import { ReactComponent as QuestionIcon } from '../../assets/icons/question-100.svg'

// components
import BackButton from '../../components/BackButton'

type Props = {}

const { Option } = Select
const { Panel } = Collapse

const ContactPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const location = useLocation() as any

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact)
	const selectedContact = supportContact?.data?.supportContact
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const [view, setView] = useState<'empty' | 'default' | 'not_found'>()

	const currentLng = i18n.language

	const handleCountryChange = async (item: any) => {
		await dispatch(getSupportContact(item.key))
		setView('default')
	}

	useEffect(() => {
		;(async () => {
			const supportContactsData = await dispatch(getSupportContacts())

			if (isEmpty(supportContactsData.data?.supportContacts)) {
				setView('empty')
				return
			}
			const currentLngCountry = supportContactsData?.data?.supportContacts?.find((support) => support.country.code.toLowerCase() === i18n.language?.toLowerCase())

			if (currentLngCountry?.id) {
				dispatch(getSupportContact(currentLngCountry?.id))
				setView('default')
				return
			}

			dispatch(getSupportContact())
			setView('not_found')
		})()
	}, [dispatch])

	useEffect(() => {
		dispatch(getSupportContactsOptions(currentLng as LANGUAGE, supportContacts?.data))
	}, [currentLng, dispatch, supportContacts?.data])

	const renderContent = () => {
		if (view === 'empty') {
			return (
				<Result
					status='500'
					title={<span className={'text-notino-black'}>{t('loc:Zoznam je prázdny')}</span>}
					subTitle={<span className={'text-gray-600'}>{t('loc:Ľutujeme, momentálne nie sú k dispozící žiadne support centrá.')}</span>}
				/>
			)
		}

		return (
			<>
				<div className={'ant-form-item'}>
					<label htmlFor={'noti-country-select'} className={'block font-bold'}>
						{t('loc:Zvoľte si krajinu')}
					</label>
					<Select
						id={'noti-country-select'}
						onChange={handleCountryChange}
						value={selectedContact?.country.code}
						className={'noti-select-input max-w-sm'}
						size={'large'}
						dropdownClassName={'noti-select-dropdown dropdown-match-select-width'}
						labelInValue
					>
						{supportContacts?.options?.map((option) => (
							<Option value={option.value} key={option.key}>
								<div className='flex items-center'>
									<img className='noti-flag w-6 mr-1 rounded' src={option.flag} alt={''} />
									{option.label}
								</div>
							</Option>
						))}
					</Select>
				</div>
				{(() => {
					if (view === 'not_found') {
						return (
							<Result
								icon={<QuestionIcon />}
								title={<span className={'text-notino-black'}>{t('loc:Podpora nebola nájdená')}</span>}
								subTitle={
									<span className={'text-gray-600'}>
										{t(
											'loc:Ľutujeme, pre zvolenú krajinu moménalne neexistuje žiadna podpora. Ak nás chcete kontaktovať, môžete si zvoliť niektorú z krajín zo zoznamu vyššie.'
										)}
									</span>
								}
							/>
						)
					}
					if (view === 'default') {
						return (
							<Collapse className={'noti-support-collapse mt-8'} bordered={false} defaultActiveKey={1} accordion>
								<Panel
									header={
										<h3 className={'flex items-center text-lg my-2'}>
											<PhoneIcon width={20} height={20} className={'mr-2'} />
											{t('loc:Kontaktné údaje')}
										</h3>
									}
									key={1}
								>
									<Row className={'contact-row'}>
										<div className={'contact-col'}>
											<ul className={'noti-support-contact-list'}>
												{selectedContact?.emails?.map((email, index) => (
													<li key={index} className={'email-list-item'}>
														{email}
													</li>
												))}
												{selectedContact?.phones?.map((phone, index) => {
													const prefix = getCountryPrefix(countriesData.data, phone?.phonePrefixCountryCode)
													if (prefix && phone?.phone) {
														return <li key={index} className={'phone-list-item'}>{`${prefix} ${phone.phone}`}</li>
													}
													return null
												})}
											</ul>
										</div>
										<div className={'contact-col'}>
											<ul className={'noti-support-contact-list'}>
												<li className={'address-list-item'}>
													{selectedContact?.address?.street && (
														<>
															{selectedContact.address.street} {selectedContact?.address?.streetNumber}
															<br />
														</>
													)}
													{selectedContact?.address?.zipCode} {selectedContact?.address?.city}
													<br />
													{getSupportContactCountryName(selectedContact?.country?.nameLocalizations, currentLng as LANGUAGE) ||
														selectedContact?.country.code}
												</li>
												{selectedContact?.note && <li className={'note-list-item'}>{selectedContact?.note}</li>}
											</ul>
										</div>
									</Row>
								</Panel>
								<Panel
									header={
										<h3 className={'flex items-center text-lg my-2'}>
											<TimerIcon width={20} height={20} className={'mr-2'} />
											{t('loc:Otváracie hodiny')}
										</h3>
									}
									key={2}
								>
									<div className={'noti-opening-hours-table'}>
										{DAYS.map((day, i) => {
											const dayFromData = selectedContact?.openingHours?.find((hours) => hours.day === day)
											return (
												<div className={'day-row'} key={i}>
													<span className={'day-name'}>{translateDayName(day)}</span>
													<div className={'day-intervals'}>
														{!dayFromData || isEmpty(dayFromData.timeRanges) ? (
															<span className={'day-interval'}>{t('loc:Zatvorené')}</span>
														) : (
															dayFromData.timeRanges.map((timeRange, index) => (
																<span className={'day-interval'} key={index}>{`${timeRange.timeFrom}-${timeRange.timeTo}`}</span>
															))
														)}
													</div>
												</div>
											)
										})}
									</div>
								</Panel>
							</Collapse>
						)
					}
					return null
				})()}
			</>
		)
	}

	return (
		<div className='w-full noti-support-contact-wrapper'>
			<Spin spinning={supportContact?.isLoading || supportContacts?.isLoading}>
				<BackButton path={location?.state?.from || t('paths:index')} showSeparator={false} className={'mb-2 btn-back'} />
				<h3 className={'text-center'}>{t('loc:Pomoc a podpora')}</h3>
				{renderContent()}
			</Spin>
		</div>
	)
}

export default ContactPage
