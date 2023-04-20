import React, { FC, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { initialize, submit } from 'redux-form'
import { isEmpty } from 'lodash'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

// components
import SalonForm from './components/forms/SalonForm'
import { scrollToTopFn } from '../../components/ScrollToTop'
import SalonSuggestionsModal from './components/modals/SalonSuggestionsModal'
import SpecialistModal from './components/modals/SpecialistModal'
import { getSalonDataForSubmission, initEmptySalonFormData, initSalonFormData, SalonInitType } from './components/salonUtils'

// enums
import { FILTER_ENTITY, FORM, PERMISSION, STRINGS, SUBMIT_BUTTON_ID } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getBasicSalon, getSuggestedSalons } from '../../reducers/salons/salonsActions'
import { getCurrentUser } from '../../reducers/users/userActions'

// types
import { CategoriesPatch, ISalonForm, SalonPageProps } from '../../types/interfaces'

// utils
import { patchReq, postReq } from '../../utils/request'
import Permissions, { checkPermissions } from '../../utils/Permissions'
import searchWrapper from '../../utils/filters'
import { formFieldID } from '../../utils/helper'

// assets
import { ReactComponent as SpecialistIcon } from '../../assets/icons/specialist-24-icon.svg'
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'

const permissions: PERMISSION[] = [PERMISSION.NOTINO, PERMISSION.PARTNER]

const CreateSalonPage: FC<SalonPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { phonePrefixCountryCode, authUser, phonePrefixes } = props

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [suggestionsModalVisible, setSuggestionsModalVisible] = useState(false)
	const [specialistModalVisible, setSpecialistModalVisible] = useState(false)

	const basicSalon = useSelector((state: RootState) => state.salons.basicSalon)

	const isLoading = phonePrefixes?.isLoading || authUser?.isLoading || basicSalon.isLoading

	// show salons searchbox with basic salon suggestions only for Partner users
	const showBasicSalonsSuggestions = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER], [PERMISSION.NOTINO]), [authUser])

	useEffect(() => {
		if (showBasicSalonsSuggestions) {
			;(async () => {
				const { data } = await dispatch(getSuggestedSalons())
				if ((data?.salons?.length || 0) > 0) {
					setSuggestionsModalVisible(true)
				}
			})()
		}
	}, [dispatch, showBasicSalonsSuggestions])

	// init form on mount
	useEffect(() => {
		dispatch(initialize(FORM.SALON, initEmptySalonFormData(phonePrefixCountryCode, showBasicSalonsSuggestions)))
	}, [dispatch, showBasicSalonsSuggestions, phonePrefixCountryCode])

	const handleSubmit = async (data: ISalonForm) => {
		try {
			setSubmitting(true)

			const result = await postReq('/api/b2b/admin/salons/', undefined, getSalonDataForSubmission(data) as any)

			// save categories in case of salon data were loaded from basic salon data and has categories assigned
			if (showBasicSalonsSuggestions) {
				if (data?.categoryIDs && !isEmpty(data?.categoryIDs) && data.categoryIDs.length < 100) {
					await patchReq(
						'/api/b2b/admin/salons/{salonID}/categories',
						{ salonID: result.data.salon.id },
						{
							categoryIDs: data?.categoryIDs as unknown as CategoriesPatch['categoryIDs']
						}
					)
				}
			}

			if (result?.data?.salon?.id) {
				// load new salon for current user
				await dispatch(getCurrentUser())
				// select new salon
				navigate(t('paths:salons/{{salonID}}', { salonID: result.data.salon.id }))
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
			scrollToTopFn()
		}
	}

	const searchSalons = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.BASIC_SALON)
		},
		[dispatch]
	)

	const loadBasicSalon = useCallback(
		async (id: string) => {
			const { data } = await dispatch(getBasicSalon(id))
			dispatch(initialize(FORM.SALON, initSalonFormData(data?.salon as SalonInitType, phonePrefixCountryCode, true)))
		},
		[dispatch, phonePrefixCountryCode]
	)

	const clearSalonForm = useCallback(() => {
		dispatch(initialize(FORM.SALON, initEmptySalonFormData(phonePrefixCountryCode, true)))
	}, [dispatch, phonePrefixCountryCode])

	return (
		<>
			<div className='content-body'>
				<Spin spinning={isLoading}>
					<SalonForm
						onSubmit={handleSubmit}
						showBasicSalonsSuggestions={showBasicSalonsSuggestions}
						loadBasicSalon={loadBasicSalon}
						clearSalonForm={clearSalonForm}
						searchSalons={searchSalons}
					/>
					<div className={'content-footer'}>
						<Row className={'w-full'} justify={'center'}>
							<Permissions
								allowed={permissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										id={formFieldID(FORM.SALON, SUBMIT_BUTTON_ID)}
										type={'primary'}
										size={'middle'}
										className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
										htmlType={'submit'}
										icon={<CreateIcon />}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.SALON))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting}
										loading={submitting}
									>
										{STRINGS(t).createRecord(t('loc:salón'))}
									</Button>
								)}
							/>
						</Row>
					</div>
				</Spin>
			</div>
			<SalonSuggestionsModal visible={suggestionsModalVisible} setVisible={setSuggestionsModalVisible} />
			{specialistModalVisible && <SpecialistModal visible onCancel={() => setSpecialistModalVisible(false)} />}
			<button type={'button'} className={cx('noti-specialist-button', { 'is-active': specialistModalVisible })} onClick={() => setSpecialistModalVisible(true)}>
				<SpecialistIcon />
				<span>{t('loc:Notino Špecialista')}</span>
			</button>
		</>
	)
}

export default CreateSalonPage