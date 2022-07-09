import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Row, Select, Collapse } from 'antd'

// components

// interfaces
import { isEmpty } from 'lodash'

// utils
import { getSupportContact, getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'
import { RootState } from '../../reducers'

// assets
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../assets/icons/clock-icon.svg'
import { getCountryPrefix, translateDayName } from '../../utils/helper'
import { DAYS, ENUMERATIONS_KEYS } from '../../utils/enums'

type Props = {}

const { Option } = Select
const { Panel } = Collapse

const ContactPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const handleCountryChange = (value: number) => {
		dispatch(getSupportContact(value))
	}

	const supportContactsOptions = useSelector((state: RootState) => state.supportContacts.supportContacts.options)
	// TODO: remove any when BE is done
	const { isLoading, data } = useSelector((state: RootState) => state.supportContacts.supportContact) as any
	const selectedContact = data?.supportContact
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	useEffect(() => {
		dispatch(getSupportContacts())
		dispatch(getSupportContact(1))
	}, [dispatch])

	return (
		<div className='w-full noti-support-contact-wrapper'>
			<h3 className={'text-center'}>{t('loc:Pomoc a podpora')}</h3>
			<div className={'ant-form-item'}>
				<label htmlFor={'noti-country-select'} className={'block'}>
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
					{supportContactsOptions?.map((option: any) => (
						<Option value={option.value} key={option.key}>
							<div className='flex items-center'>
								<img className='noti-flag w-6 mr-1 rounded' src={option.flag} alt={option.value} />
								{option.label}
							</div>
						</Option>
					))}
				</Select>
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
										{/* country translations */}
										{selectedContact?.country?.name}
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
										{!dayFromData || isEmpty(dayFromData.timeRanges) ? (
											<span className={'day-interval'}>{t('loc:Zatvorené')}</span>
										) : (
											// TODO: remove any when BE is done
											dayFromData.timeRanges.map((timeRange: any) => <span className={'day-interval'}>{`${timeRange.timeFrom}-${timeRange.timeTo}`}</span>)
										)}
									</div>
								)
							})}
						</div>
					</Panel>
				</Collapse>
			</div>
		</div>
	)
}

export default ContactPage
