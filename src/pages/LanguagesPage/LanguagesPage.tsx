import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import cx from 'classnames'
import { filter, get } from 'lodash'
import { SorterResult } from 'antd/lib/table/interface'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import LanguagesForm from './components/LanguagesForm'
import LanguagesFilter from './components/LanguagesFilter'
import { EMPTY_NAME_LOCALIZATIONS } from '../../components/LanguagePicker'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, DEFAULT_LANGUAGE, CREATE_BUTTON_ID } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { normalizeDirectionKeys, normalizeNameLocalizations, setOrder, sortData, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getSalonLanguages } from '../../reducers/languages/languagesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ILanguage, ILanguageForm } from '../../types/interfaces'
import { Paths } from '../../types/api'

// hooks
import useQueryParams, { StringParam } from '../../hooks/useQueryParams'

type Columns = ColumnsType<any>

type LanguagesPatch = Paths.PatchApiB2BAdminEnumsLanguagesLanguageId.RequestBody

const LanguagesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	// undefined - represents new record
	const [languageID, setLanguageID] = useState<string | undefined>(undefined)

	const languages = useSelector((state: RootState) => state.languages.languages)

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		order: StringParam('name:ASC')
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam jazykov v salónoch')
			}
		]
	}

	useEffect(() => {
		dispatch(getSalonLanguages())
	}, [dispatch])

	useEffect(() => {
		dispatch(
			initialize(FORM.LANGUAGES_FILTER, {
				search: query.search
			})
		)
	}, [dispatch, query.search])

	const tableData = useMemo(() => {
		if (!languages || !languages.data) {
			return []
		}

		const source = query?.search
			? languages.data.filter((lang) => {
					const fallbackName = lang.nameLocalizations.find((localization) => localization.language === DEFAULT_LANGUAGE)
					const name = transformToLowerCaseWithoutAccent(lang.name || (fallbackName?.value as string))
					const searchValue = transformToLowerCaseWithoutAccent(query.search || undefined)
					return name.includes(searchValue)
			  })
			: languages.data

		// transform to table data
		return source.map((lang) => {
			const fallbackName = lang.nameLocalizations.find((localization) => localization.language === DEFAULT_LANGUAGE)

			return {
				...lang,
				name: lang.name || fallbackName?.value,
				key: lang.id
			}
		})
	}, [query.search, languages])

	const changeFormVisibility = (show?: boolean, lang?: ILanguage) => {
		if (!show) {
			setVisibleForm(false)
			return
		}

		if (lang) {
			dispatch(
				initialize(FORM.LANGUAGES, {
					image: lang.image?.original ? [{ url: lang.image?.original, uid: lang.image?.id }] : undefined,
					nameLocalizations: normalizeNameLocalizations(lang.nameLocalizations)
				})
			)
		} else {
			dispatch(
				initialize(FORM.LANGUAGES, {
					nameLocalizations: EMPTY_NAME_LOCALIZATIONS
				})
			)
		}

		setLanguageID(lang ? lang.id : undefined)
		setVisibleForm(true)
	}

	const handleSubmit = async (formData: ILanguageForm) => {
		const body = {
			imageID: get(formData, 'image[0].id') || get(formData, 'image[0].uid') || null,
			nameLocalizations: filter(formData.nameLocalizations, (item) => !!item.value)
		}
		try {
			if (languageID) {
				await patchReq('/api/b2b/admin/enums/languages/{languageID}', { languageID }, body as LanguagesPatch)
			} else {
				await postReq('/api/b2b/admin/enums/languages/', null, body as LanguagesPatch)
			}
			dispatch(getSalonLanguages())
			changeFormVisibility()
			// reset search in case of newly created entity
			if (!languageID && query.search) {
				setQuery({ ...query, search: '' })
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		if (languageID) {
			try {
				await deleteReq('/api/b2b/admin/enums/languages/{languageID}', { languageID })
				dispatch(getSalonLanguages())
				changeFormVisibility()
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
			}
		}
	}

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				order
			}
			setQuery(newQuery)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			sortOrder: setOrder(query.order, 'name'),
			sorter: {
				compare: (a, b) => sortData(a.name, b.name)
			}
		},
		{
			title: t('loc:Vlajka'),
			dataIndex: 'image',
			key: 'image',
			ellipsis: true,
			render: (_value, record) =>
				record?.image ? (
					<Image
						key={record.id}
						src={record?.image?.resizedImages.small as string}
						loading='lazy'
						fallback={record?.image?.original}
						alt={record?.name}
						preview={false}
						className='table-preview-image languages-flag'
					/>
				) : (
					<div className={'table-preview-image languages-flag'} />
				)
		}
	]

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={languages?.isLoading}>
							<LanguagesFilter
								total={languages?.data?.length}
								onSubmit={(values: any) => setQuery({ ...query, search: values.search })}
								addButton={
									<Button
										onClick={() => {
											changeFormVisibility(true)
										}}
										type='primary'
										htmlType='button'
										className={'noti-btn'}
										icon={<PlusIcon />}
										id={`${CREATE_BUTTON_ID}-${FORM.LANGUAGES}`}
									>
										{STRINGS(t).addRecord(t('loc:jazyk'))}
									</Button>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>
									<CustomTable
										className='table-fixed'
										columns={columns}
										dataSource={tableData}
										onChange={onChangeTable}
										rowClassName={'clickable-row'}
										twoToneRows
										pagination={false}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full mx-6 xl:mx-9'} type={'vertical'} />
										<LanguagesForm closeForm={changeFormVisibility} languageID={languageID} onSubmit={handleSubmit} onDelete={handleDelete} />
									</div>
								) : undefined}
							</div>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.ENUM_EDIT]))(LanguagesPage)
