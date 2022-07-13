import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Select, Collapse, Spin } from 'antd'

// interfaces
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

type Props = {}

const { Option } = Select
const { Panel } = Collapse

const ContactPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const handleCountryChange = (value: number) => {
		dispatch(getSupportContact(value))
	}

	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	// TODO: remove any when BE is done
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact) as any
	const selectedContact = supportContact?.data?.supportContact
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const currentLng = i18n.language

	useEffect(() => {
		;(async () => {
			// TODO: remove any when BE is done
			const supportContactsData = (await dispatch(getSupportContacts())) as any
			const currentLngCountry = supportContactsData?.data?.supportContacts?.find((support: any) => support.country.code.toLowerCase() === i18n.language?.toLocaleLowerCase())

			if (currentLngCountry?.id) {
				dispatch(getSupportContact(currentLngCountry?.id))
			}
		})()
	}, [dispatch])

	useEffect(() => {
		dispatch(getSupportContactsOptions(currentLng as LANGUAGE, supportContacts?.data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLng, dispatch, supportContacts?.data])

	return (
		<div className='w-full noti-support-contact-wrapper'>
			<Spin spinning={supportContacts?.isLoading}>
				<h3 className={'text-center'}>{t('loc:Pomoc a podpora')}</h3>
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
					>
						{supportContacts?.options?.map((option: any) => (
							<Option value={option.value} key={option.key}>
								<div className='flex items-center'>
									<img className='noti-flag w-6 mr-1 rounded' src={option.flag} alt={option.value} />
									{option.label}
								</div>
							</Option>
						))}
					</Select>
				</div>
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
									{/* TODO: remove any when BE is done */}
									{selectedContact?.emails?.map((email: any, index: number) => (
										<li key={index} className={'email-list-item'}>
											{email}
										</li>
									))}
									{/* TODO: remove any when BE is done */}
									{selectedContact?.phones?.map((phone: any, index: number) => {
										const prefix = getCountryPrefix(countriesData.data, phone.phonePrefixCountryCode)
										if (prefix && phone.phone) {
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
										{getSupportContactCountryName(selectedContact?.country?.nameLocalizations, currentLng as LANGUAGE) || selectedContact?.country.code}
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
							{DAYS.map((day) => {
								// TODO: remove any when BE is done
								const dayFromData = selectedContact?.openingHours.find((hours: any) => hours.day === day)
								return (
									<div className={'day-row'}>
										<span className={'day-name'}>{translateDayName(day)}</span>
										<div className={'day-intervals'}>
											{!dayFromData || isEmpty(dayFromData.timeRanges) ? (
												<span className={'day-interval'}>{t('loc:Zatvorené')}</span>
											) : (
												// TODO: remove any when BE is done
												dayFromData.timeRanges.map((timeRange: any) => (
													<span className={'day-interval'}>{`${timeRange.timeFrom}-${timeRange.timeTo}`}</span>
												))
											)}
										</div>
									</div>
								)
							})}
						</div>
					</Panel>
				</Collapse>
			</Spin>
		</div>
	)
}

export default ContactPage
