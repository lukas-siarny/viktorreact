import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { indexOf, some } from 'lodash'
import { Button, Modal, notification, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line import/no-cycle
import { RootState } from '../reducers'
import { PERMISSION, ADMIN_PERMISSIONS, CYPRESS_CLASS_NAMES } from './enums'

/**
 * NOTE: by default are admin permissions allowed (SUPER_ADMIN, ADMIN). In other case use `except=ADMIN_PERMISSIONS`
 * @param userPermissions permissions from users role and salons role
 * @param allowed allowed permissions
 * @param except excepted permissions
 * @returns TRUE/FALSE
 */
export const checkPermissions = (userPermissions: PERMISSION[] = [], allowed: PERMISSION[] = [], except: PERMISSION[] = []) => {
	if (except.length > 0 && some(except, (elem: any) => indexOf(userPermissions, elem) > -1)) {
		return false
	}

	const allowedPermissions = [...ADMIN_PERMISSIONS, ...allowed]

	if (some(allowedPermissions, (elem: any) => indexOf(userPermissions, elem) > -1)) {
		return true
	}
	return false
}

export const withPermissions =
	(allowed: PERMISSION[] = [], except: PERMISSION[] = []) =>
	(WrappedComponent: any) => {
		const WithPermissions = (props: any) => {
			const [visible, setVisible] = useState(false)
			const navigate = useNavigate()
			const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
			const salonPermissions = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.uniqPermissions ?? [])

			useEffect(() => {
				if (!checkPermissions([...authUserPermissions, ...salonPermissions], allowed, except)) {
					setVisible(false)
					navigate('/403')
				} else {
					setVisible(true)
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [])

			if (!visible) {
				return null
			}
			return <WrappedComponent {...props} />
		}
		return WithPermissions
	}

type Props = PropsWithChildren & {
	render?: (hasPermission: boolean, object: any) => React.ReactNode
	allowed?: PERMISSION[]
	except?: PERMISSION[]
}

export const ForbiddenModal: FC<{ visible: boolean; onCancel: () => void; item?: any }> = (props) => {
	const [t] = useTranslation()

	const { visible, onCancel, item } = props

	return (
		<>
			<Modal title={t('loc:Upozornenie')} open={visible} getContainer={() => document.body} onCancel={onCancel} footer={null}>
				<Result
					className={CYPRESS_CLASS_NAMES.FORBIDDEN_MODAL}
					status='warning'
					title={t('loc:Pre túto akciu nemáte dostatočné oprávnenia.')}
					extra={
						<Button className={'noti-btn'} onClick={onCancel} type='primary'>
							{t('loc:Zatvoriť')}
						</Button>
					}
				/>
			</Modal>
			{item}
		</>
	)
}

const Permissions: FC<Props> = (props) => {
	const { render, allowed, except, children } = props
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const salonPermission = selectedSalon?.uniqPermissions ?? []

	const hasPermissions = checkPermissions([...authUserPermissions, ...salonPermission], allowed, except) // permitted(authUserPermissions, selectedSalon?.uniqPermissions, allowed, except)

	const [visibleModal, setVisibleModal] = useState(false)
	const [t] = useTranslation()

	if (render) {
		const item: any = render(hasPermissions, {
			openForbiddenModal: () => {
				setVisibleModal(true)
			},
			openForbiddenNotification: () => {
				notification.warning({
					message: t('loc:Upozornenie'),
					description: t('loc:Pre túto akciu nemáte dostatočné oprávnenia.')
				})
			},
			checkPermissions: (allowedPermissions: PERMISSION[]) => checkPermissions(authUserPermissions, allowedPermissions)
		})
		const modal: any = <ForbiddenModal visible={visibleModal} onCancel={() => setVisibleModal(false)} item={item} />
		return modal
	}

	if (hasPermissions) {
		return children
	}

	return null
}

export default React.memo<FC<Props>>(Permissions)
