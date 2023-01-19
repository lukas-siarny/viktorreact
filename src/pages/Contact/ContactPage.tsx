import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Select, Collapse, Spin, Result, Popover, Divider, Button } from 'antd'
import { isEmpty } from 'lodash'

// reducers
import { getSupportContact, getSupportContacts, getSupportContactsOptions } from '../../reducers/supportContacts/supportContactsActions'
import { RootState } from '../../reducers'

// utils
import { getCountryPrefix, getCountryNameFromNameLocalizations, optionRenderWithImage, translateDayName } from '../../utils/helper'
import { DAYS, DEFAULT_LANGUAGE, ENUMERATIONS_KEYS, LANGUAGE } from '../../utils/enums'
import i18n from '../../utils/i18n'
import { LOCALES } from '../../components/LanguagePicker'

// assets
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone-pink.svg'
import { ReactComponent as TimerIcon } from '../../assets/icons/clock-pink.svg'
import { ReactComponent as QuestionIcon } from '../../assets/icons/question-100.svg'
import { ReactComponent as GlobeIcon } from '../../assets/icons/globe-24.svg'
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil-icon-16.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

const NOTE_MAX_LENGTH = 60

type Props = {}

const { Option } = Select
const { Panel } = Collapse

const ContactPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact)
	const selectedContact = supportContact?.data?.supportContact
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const [view, setView] = useState<'empty' | 'default' | 'not_found'>()
	const [isNoteOpen, setIsNoteOpen] = useState(false)

	const currentLng = i18n.language

	const notePopoverRef = useRef<any | null>(null)

	useEffect(() => {
		const listener = (event: Event) => {
			const popupEl = notePopoverRef.current?.popupRef?.current?.getElement()
			const triggerEl = notePopoverRef.current?.triggerRef?.current
			if (!popupEl || !triggerEl || popupEl.contains((event?.target as Node) || null) || triggerEl.contains((event?.target as Node) || null)) {
				return
			}

			setIsNoteOpen(false)
		}
		document.addEventListener('mousedown', listener)
		document.addEventListener('touchstart', listener)

		return () => {
			document.removeEventListener('mousedown', listener)
			document.removeEventListener('touchstart', listener)
		}
	}, [])

	const handleCountryChange = async (item: any) => {
		await dispatch(getSupportContact(item.key))
		setView('default')
	}

	useEffect(() => {
		const fetchData = async () => {
			const supportContactsData = await dispatch(getSupportContacts())

			if (isEmpty(supportContactsData.data?.supportContacts)) {
				setView('empty')
				return
			}

			if (selectedContact) {
				setView('default')
				return
			}

			const lng = (i18n.language || DEFAULT_LANGUAGE) as LANGUAGE
			const langToCompare = LOCALES[lng]?.countryCode?.toLowerCase()
			const currentLngCountry = supportContactsData?.data?.supportContacts?.find((support) => support.country?.code?.toLowerCase() === langToCompare)

			if (currentLngCountry?.id) {
				await dispatch(getSupportContact(currentLngCountry?.id))
				setView('default')
				return
			}

			dispatch(getSupportContact())
			setView('not_found')
		}

		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						value={{ value: selectedContact?.id }}
						className={'noti-select-input w-full'}
						size={'large'}
						popupClassName={'noti-select-dropdown dropdown-match-select-width'}
						labelInValue
					>
						{supportContacts?.options?.map((option) => (
							<Option value={option.value} key={option.key}>
								{optionRenderWithImage(option, <GlobeIcon />)}
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
							<Collapse className={'noti-collapse noti-support-collapse mt-0'} bordered={false} defaultActiveKey={1} accordion expandIconPosition={'end'}>
								<Panel
									header={
										<h3 className={'flex items-center text-lg my-2'}>
											<PhoneIcon width={20} height={20} className={'mr-2'} />
											{t('loc:Kontaktné údaje')}
										</h3>
									}
									key={1}
								>
									<div className={'contact-row'}>
										<div className={'contact-col pr-2'}>
											<ul className={'noti-contact-list'}>
												{selectedContact?.emails?.map((email, index) => (
													<li key={index} className={'email-list-item break-all'}>
														<a href={`mailto:${email}`}>{email}</a>
													</li>
												))}
												{selectedContact?.phones?.map((phone, index) => {
													const prefix = getCountryPrefix(countriesData.data, phone?.phonePrefixCountryCode)
													if (prefix && phone?.phone) {
														return (
															<li key={index} className={'phone-list-item'}>
																<a href={`tel:${prefix}${phone.phone}`}>{`${prefix} ${phone.phone}`}</a>
															</li>
														)
													}
													return null
												})}
											</ul>
										</div>
										<div className={'contact-col'}>
											<ul className={'noti-contact-list'}>
												<li className={'address-list-item'}>
													<div className={'flex flex-col'}>
														{selectedContact?.address?.street && (
															<div>
																<span className={'break-all mr-1'}>{selectedContact.address.street.trim()}</span>
																{selectedContact?.address?.streetNumber?.trim()}
															</div>
														)}
														<div>
															{selectedContact?.address?.zipCode && <span className={'mr-1'}>{selectedContact?.address?.zipCode?.trim()}</span>}
															<span className={'break-all'}>{selectedContact?.address?.city?.trim()}</span>
														</div>
														{getCountryNameFromNameLocalizations(selectedContact?.country?.nameLocalizations, currentLng as LANGUAGE) ||
															selectedContact?.country.code}
													</div>
												</li>
												{selectedContact?.note && (
													<li className={'note-list-item'}>
														<p className={'m-0 break-all'}>
															{selectedContact.note.length > NOTE_MAX_LENGTH ? (
																<>
																	{`${selectedContact.note.slice(0, NOTE_MAX_LENGTH)}… `}
																	<Popover
																		overlayClassName={'w-full sm:max-w-md p-2'}
																		ref={notePopoverRef}
																		open={isNoteOpen}
																		content={
																			<>
																				<Row align={'middle'} justify={'space-between'}>
																					<Row align={'middle'} className={'gap-1'}>
																						<PencilIcon />
																						<h4 className={'m-0'}>{t('loc:Poznámka')}</h4>
																					</Row>
																					<Button className={'p-0 border-none shadow-none'} onClick={() => setIsNoteOpen(false)}>
																						<CloseIcon style={{ width: 16, height: 16 }} />
																					</Button>
																				</Row>
																				<Divider className={'my-1'} />
																				<p className={'whitespace-pre-wrap break-all m-0'}>{selectedContact?.note}</p>
																			</>
																		}
																		trigger='click'
																		arrowPointAtCenter
																		overlayInnerStyle={{ borderRadius: 10 }}
																	>
																		<button
																			type={'button'}
																			className={
																				'underline cursor-pointer break-normal outline-none border-none bg-transparent p-0 noti-show-more-button'
																			}
																			onClick={() => setIsNoteOpen(true)}
																		>
																			{t('loc:zobraziť viac')}
																		</button>
																	</Popover>
																</>
															) : (
																selectedContact.note
															)}
														</p>
													</li>
												)}
											</ul>
										</div>
									</div>
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
															dayFromData.timeRanges?.map((timeRange, index) => (
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
				<h3 className={'text-center'}>{t('loc:Pomoc a podpora')}</h3>
				{renderContent()}
			</Spin>
		</div>
	)
}

export default ContactPage
