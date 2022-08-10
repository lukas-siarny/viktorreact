import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import cx from 'classnames'
import { filter, get } from 'lodash'

// components
import { StringParam, useQueryParams } from 'use-query-params'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import LanguagesForm from './components/LanguagesForm'
import CosmeticsFilter from './components/LanguagesFilter'
import { EMPTY_NAME_LOCALIZATIONS, sortNameLocalizationsWithDefaultLangFirst } from '../../components/LanguagePicker'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS, DEFAULT_LANGUAGE } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getLanguages } from '../../reducers/languages/languagesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ILanguage, ILanguageForm } from '../../types/interfaces'
import { Paths } from '../../types/api'

type Columns = ColumnsType<any>

type LanguagesPatch = Paths.PatchApiB2BAdminEnumsLanguagesLanguageId.RequestBody

const LanguagesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	// 0 - represents new record
	const [languageID, setLanguageID] = useState<number>(0)

	const languages = useSelector((state: RootState) => state.languages.languages)

	const [query, setQuery] = useQueryParams({
		search: StringParam
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam jazykov')
			}
		]
	}

	useEffect(() => {
		dispatch(getLanguages())
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
					image: lang.image?.resizedImages?.thumbnail,
					nameLocalizations: sortNameLocalizationsWithDefaultLangFirst(lang.nameLocalizations)
				})
			)
		} else {
			dispatch(
				initialize(FORM.LANGUAGES, {
					nameLocalizations: EMPTY_NAME_LOCALIZATIONS
				})
			)
		}

		setLanguageID(lang ? lang.id : 0)
		setVisibleForm(true)
	}

	const handleSubmit = async (formData: ILanguageForm) => {
		const body = {
			imageID: get(formData, 'image[0].id') || get(formData, 'image[0].uid'),
			nameLocalizations: filter(formData.nameLocalizations, (item) => !!item.value)
		}
		try {
			if (languageID > 0) {
				await patchReq('/api/b2b/admin/enums/languages/{languageID}', { languageID }, body as LanguagesPatch)
			} else {
				await postReq('/api/b2b/admin/enums/languages/', null, body as LanguagesPatch)
			}
			dispatch(getLanguages())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReq('/api/b2b/admin/enums/languages/{languageID}', { languageID })
			dispatch(getLanguages())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			sorter: {
				compare: (a, b) => {
					const nameA = a.name?.toUpperCase()
					const nameB = b.name?.toUpperCase()

					if (!nameA || !nameB) {
						return 0
					}

					if (nameA < nameB) {
						return -1
					}
					if (nameA > nameB) {
						return 1
					}

					return 0
				},
				multiple: 1
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
						className='languages-flag'
					/>
				) : null
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
							<CosmeticsFilter
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
										<Divider className={'h-full'} type={'vertical'} />
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

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(LanguagesPage)
