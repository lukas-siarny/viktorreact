import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { indexOf, some, isEmpty, partition } from 'lodash'
import { Button, Modal, notification, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line import/no-cycle
import { RootState } from '../reducers'
import { PERMISSION, ADMIN_PERMISSIONS } from './enums'
import { isEnumValue } from './helper'
import { _Permissions } from '../types/interfaces'

export const checkPermissions = (authUserPermissions: _Permissions = [], allowed: _Permissions = [], except: _Permissions = []) => {
	if (except.length > 0 && some(except, (elem: any) => indexOf(authUserPermissions, elem) > -1)) {
		return false
	}
	if (allowed.length > 0) {
		if (some(allowed, (elem: any) => indexOf(authUserPermissions, elem) > -1)) {
			return true
		}
		return false
	}
	return true
}

export const withPermissions =
	(allowed: _Permissions = [], except: _Permissions = []) =>
	(WrappedComponent: any) => {
		const WithPermissions = (props: any) => {
			const [visible, setVisible] = useState(false)
			const navigate = useNavigate()
			const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
			useEffect(() => {
				if (!checkPermissions(authUserPermissions, allowed, except)) {
					setVisible(false)
					navigate('/403')
				} else {
					setVisible(true)
				}
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
	allowed?: _Permissions
	except?: _Permissions
}

export const isAdmin = (authUserPermissions: _Permissions = []): boolean => checkPermissions(authUserPermissions, ADMIN_PERMISSIONS)

export const permitted = (userPermissions: _Permissions = [], salonsPermissions: _Permissions = [], allowed: _Permissions = [], except: _Permissions = []): boolean => {
	// split into SYSTEM (index 0) and SALON (index 1) permissions
	const allowedPermissions = partition(allowed, (permission) => isEnumValue(permission, PERMISSION)) as _Permissions[]
	const exceptedPermissions = partition(except, (permission) => isEnumValue(permission, PERMISSION)) as _Permissions[]

	const hasSystemPermissions = checkPermissions(userPermissions, allowedPermissions[0], exceptedPermissions[0])

	if (isEmpty(allowedPermissions[1]) && isEmpty(exceptedPermissions[1])) {
		return hasSystemPermissions
	}

	const hasSalonPermissions = checkPermissions(salonsPermissions, allowedPermissions[1], exceptedPermissions[1])

	// For system permissions SUPER_ADMIN and ADMIN are salons permissions ignored
	return (hasSalonPermissions || isAdmin(userPermissions)) && hasSystemPermissions
}

export const ForbiddenModal: FC<{ visible: boolean; onCancel: () => void; item?: any }> = (props) => {
	const [t] = useTranslation()

	const { visible, onCancel, item } = props

	return (
		<>
			<Modal title={t('loc:Upozornenie')} open={visible} getContainer={() => document.body} onCancel={onCancel} footer={null}>
				<Result
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

	const hasPermissions = permitted(authUserPermissions, selectedSalon?.uniqPermissions, allowed, except)

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
			checkPermissions: (allowedPermissions: _Permissions) => checkPermissions(authUserPermissions, allowedPermissions)
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
