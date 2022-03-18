import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataNode } from 'antd/lib/tree'
import { Button, Popover, Tree } from 'antd'
import { useTranslation } from 'react-i18next'
import { get, map } from 'lodash'
import cx from 'classnames'

// assets
import { initialize } from 'redux-form'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// redux
import { getCategories } from '../../../reducers/categories/categoriesActions'
import { RootState } from '../../../reducers'

// utils
import { history } from '../../../utils/history'
import { encodeBackDataQuery } from '../../../utils/helper'
import { deleteReq } from '../../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// components
import DeleteButton from '../../../components/DeleteButton'
import CategoryForm, { ICategoryForm } from './CategoryForm'

type TreeDestinations = {
	title: ReactElement
	icon?: ReactElement
	key: number
	children: any[] | null
}

const editPermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_EDIT]
const browsePermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_BROWSING]

const CategoriesTree = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const backUrl = btoa(`${window.location.pathname}${window.location.search}`)

	const nestedDestinations = useSelector((state: RootState) => state.categories.categories)

	useEffect(() => {
		console.log('nestedDestinations: ', nestedDestinations)
	}, [nestedDestinations])

	const createDestinationHandler = useCallback(
		(parentId: number, parentTitle: string) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { parentId, parentTitle }))
		},
		[dispatch]
	)

	const updateDestinationHandler = useCallback(
		(id: number, title: string) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { id, name: title }))
		},
		[dispatch]
	)

	const deleteDestinationHandler = useCallback(
		async (id: number) => {
			if (isRemoving) {
				return
			}
			try {
				setIsRemoving(true)
				await deleteReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: id }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
				await dispatch(getCategories())
				setIsRemoving(false)
			} catch (e) {
				setIsRemoving(false)
			}
		},
		[dispatch, isRemoving]
	)

	const titleBuilder = (title: string, id: number) => (
		<Popover
			placement='right'
			trigger='click'
			content={
				<div className={'flex'}>
					<Permissions
						allowed={editPermissions}
						render={(hasPermission, { openForbiddenModal }) => (
							<>
								<Button
									type='link'
									className={'noti-btn'}
									onClick={hasPermission ? () => createDestinationHandler(id, title) : openForbiddenModal}
									icon={<PlusIcon />}
								/>
								<Button
									type='link'
									className={'noti-btn'}
									onClick={
										hasPermission
											? () => {
													updateDestinationHandler(id, title)
											  }
											: openForbiddenModal
									}
									icon={<EditIcon />}
								/>
								<DeleteButton onConfirm={hasPermission ? () => deleteDestinationHandler(id) : openForbiddenModal} onlyIcon entityName={t('loc:destináciu')} />
							</>
						)}
					/>
				</div>
			}
		>
			<span>{title}</span>
		</Popover>
	)

	const childrenRecursive = (children: any[]) => {
		const childs: any[] & any = children
		const items: any = map(childs, (child) => ({
			title: titleBuilder(get(child, 'name'), get(child, 'id')),
			key: get(child, 'id'),
			children: get(child, 'children') ? childrenRecursive(get(child, 'children')) : null
		}))
		return items as any[] & TreeDestinations[]
	}

	const treeData = () => {
		const hanbledData: TreeDestinations[] = []
		console.log('nestedDestinations: ', nestedDestinations)
		map(nestedDestinations?.data, (destination) => {
			hanbledData.push({
				title: titleBuilder(get(destination, 'name'), get(destination, 'id')),
				key: get(destination, 'id'),
				children: get(destination, 'children') ? childrenRecursive(get(destination, 'children') as any[]) : null
			})
		})
		console.log(hanbledData)
		return hanbledData as TreeDestinations[] & DataNode[]
	}

	const onDrop = (data: any) => {
		console.log('droppedData: ', data)
	}

	const handleSubmit = (data: ICategoryForm) => {
		console.log('droppedData: ', data)
	}

	const formClass = cx({
		'w-6/12': showForm
	})

	return (
		<div className={'w-full flex'}>
			<div className={formClass}>
				<Tree className={'destinations-tree'} treeData={treeData()} onDrop={onDrop} showIcon showLine draggable />
			</div>
			{showForm ? (
				<div className={'w-6/12'}>
					<CategoryForm onSubmit={handleSubmit} />
				</div>
			) : undefined}
		</div>
	)
}

export default CategoriesTree
