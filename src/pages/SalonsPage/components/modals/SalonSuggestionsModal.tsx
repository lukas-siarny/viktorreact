import React, { useState } from 'react'
import { Button, Modal, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon-modal.svg'

// reducers
import { RootState } from '../../../../reducers'
import { getCurrentUser } from '../../../../reducers/users/userActions'
import { getSuggestedSalons } from '../../../../reducers/salons/salonsActions'
import { selectSalon } from '../../../../reducers/selectedSalon/selectedSalonActions'

// utils
import { getCountryPrefix } from '../../../../utils/helper'
import { patchReq } from '../../../../utils/request'
import { ENUMERATIONS_KEYS, NOTIFICATION_TYPE } from '../../../../utils/enums'

type Props = {
	visible: boolean
	setVisible: (visible: boolean) => void
}

const SalonSuggestionsModal = (props: Props) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
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
				navigate(t('paths:salons/{{salonID}}', { salonID }))
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
			open={visible}
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
							const { address, email, phones } = salon
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
													{address?.street && (
														<>
															{address.street} {address.streetNumber}
															<br />
														</>
													)}
													{address?.zipCode} {address?.city}
													<br />
													{address?.countryCode}
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
											htmlType='button'
											disabled={isSubmitting}
										>
											{t('loc:Áno, toto je môj salón')}
										</Button>
										<Button
											className={'noti-btn m-regular'}
											onClick={() => handleSalonSuggestion(salon.id, salon.suggestionHash, false)}
											block
											size={'middle'}
											type={'dashed'}
											htmlType='button'
											disabled={isSubmitting}
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
