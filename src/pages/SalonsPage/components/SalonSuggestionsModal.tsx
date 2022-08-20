import React, { useState } from 'react'
import { Button, Modal, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// reducers
import { RootState } from '../../../reducers'
import { patchReq } from '../../../utils/request'
import { ENUMERATIONS_KEYS, NOTIFICATION_TYPE } from '../../../utils/enums'
import { getCurrentUser } from '../../../reducers/users/userActions'
import { getSuggestedSalons } from '../../../reducers/salons/salonsActions'
import { history } from '../../../utils/history'
import { getCountryPrefix } from '../../../utils/helper'
import { selectSalon } from '../../../reducers/selectedSalon/selectedSalonActions'

type Props = {
	visible: boolean
	setVisible: (visible: boolean) => void
}

const mocupData = {
	data: {
		salons: [
			{
				id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
				suggestionHash: 'string',
				name: 'Salon 4',
				email: 'test.confirmed_partneruser@goodrequest.com',
				phones: [
					{
						phonePrefixCountryCode: 'SK',
						phone: '900 222 555'
					}
				],
				address: {
					countryCode: 'SK',
					zipCode: '101 00',
					city: 'Žilina',
					street: 'Framborská',
					streetNumber: '58'
				}
			},
			{
				id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
				suggestionHash: 'string',
				name: 'Salon 3 s nejakym dlhsim nazvom, ktory moze ist aj na dva riadky',
				email: 'lukas.siarny@goodrequest.com',
				phones: [
					{
						phonePrefixCountryCode: 'SK',
						phone: '900 222 555'
					},
					{
						phonePrefixCountryCode: 'SK',
						phone: '900 222 555'
					}
				],
				address: {
					countryCode: 'SK',
					zipCode: '101 00',
					city: 'Žilina',
					street: 'Framborská',
					streetNumber: '58'
				}
			},
			{
				id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
				suggestionHash: 'string',
				name: 'Salon 5 strende dlhy nazov',
				email: 'lukas.siarny@goodrequest.com',
				phones: [
					{
						phonePrefixCountryCode: 'SK',
						phone: '900 222 555'
					},
					{
						phonePrefixCountryCode: 'SK',
						phone: '900 222 555'
					}
				],
				address: {
					countryCode: 'SK',
					zipCode: '101 00',
					city: 'Žilina',
					street: 'Framborská',
					streetNumber: '58'
				}
			}
		]
	}
}

const SalonSuggestionsModal = (props: Props) => {
	const [t] = useTranslation()
	const salonSuggestions = useSelector((state: RootState) => state.salons.suggestedSalons) /* mocupData */
	const { visible, setVisible } = props
	const [isSubmitting, setIsSubmitting] = useState(false)
	const dispatch = useDispatch()
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const suggestedSalons = useSelector((state: RootState) => state.salons.suggestedSalons)

	const isLoading = suggestedSalons.isLoading || isSubmitting

	const handleSalonSuggestion = async (salonID: string, suggestionHash: string, accept: boolean) => {
		if (isSubmitting) {
			return
		}
		try {
			setIsSubmitting(true)
			await patchReq('/api/b2b/admin/salons/{salonID}/basic-suggestion', { salonID }, { suggestionHash, accept }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			if (accept) {
				await dispatch(getCurrentUser())
				await dispatch(selectSalon(salonID))
				history.push(t('paths:salons/{{salonID}}', { salonID }))
			} else {
				const { data } = await dispatch(getSuggestedSalons())
				if ((data?.salons?.length || 0) < 1) {
					setVisible(false)
				}
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Modal
			maskClosable={false}
			keyboard={false}
			className='rounded-fields'
			title={t('loc:Navrhované salóny')}
			centered
			visible={visible}
			footer={null}
			onCancel={() => setVisible(false)}
			closeIcon={<CloseIcon />}
			wrapClassName={'suggested-salons-modal'}
			width={'fit-content'}
		>
			<Spin spinning={isLoading}>
				<div className={'suggested-salons-modal-content'}>
					<p className={'description'}>{t('loc:Na základe vašich kontantkých informácií sme v našej datábaze našli sálony, ktoré by mohli patriť vám')}</p>
					<div className={'cards-wrapper'}>
						{salonSuggestions.data?.salons.map((salon) => {
							const {
								address: { street, streetNumber, zipCode, city, countryCode },
								email,
								phones
							} = salon
							const country = countryCode
							return (
								<div className={'card'} key={salon.id}>
									<div className={'card-content'}>
										<h3 className={'title'}>{salon.name}</h3>
										<ul className={'salon-info-list'}>
											{email && <li className={'email-list-item'}>{email}</li>}

											{!isEmpty(phones) && (
												<li className={'phone-list-item'}>
													<div>
														{phones?.map((phone, index) => {
															const prefix = getCountryPrefix(countriesData.data, phone?.phonePrefixCountryCode)
															if (prefix && phone?.phone) {
																return <span key={index} className={'block'}>{`${prefix} ${phone.phone}`}</span>
															}
															return null
														})}
													</div>
												</li>
											)}

											{!isEmpty(salon.address) && (
												<li className={'address-list-item'}>
													{street && (
														<>
															{street} {streetNumber}
															<br />
														</>
													)}
													{zipCode} {city}
													<br />
													{country}
												</li>
											)}
										</ul>
									</div>
									<div className={'card-buttons'}>
										<p>{t('loc:Ste majiteľom alebo prevádzkovateľom tohoto salónu?')}</p>
										<Button
											className={'noti-btn mb-2'}
											onClick={() => handleSalonSuggestion(salon.id, salon.suggestionHash, true)}
											block
											size='middle'
											type='primary'
											htmlType='submit'
											disabled={isSubmitting}
											loading={isSubmitting}
										>
											{t('loc:Áno, toto je môj salón')}
										</Button>
										<Button
											className={'noti-btn m-regular'}
											onClick={() => handleSalonSuggestion(salon.id, salon.suggestionHash, false)}
											block
											size={'middle'}
											type={'dashed'}
											htmlType='submit'
											disabled={isSubmitting}
											loading={isSubmitting}
										>
											{t('loc:Nie, toto je nedorozumenie')}
										</Button>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</Spin>
		</Modal>
	)
}

export default SalonSuggestionsModal
