import i18next from 'i18next'
import { isNil } from 'lodash'
import { FormErrors } from 'redux-form'
import { IReviewsFilter } from '../../../types/interfaces'

const validateReviewsFilterForm = (values?: IReviewsFilter) => {
	const errors: FormErrors<IReviewsFilter> = {}

	if (!isNil(values?.toxicityScoreFrom) && !isNil(values?.toxicityScoreTo) && (values?.toxicityScoreFrom || 0) > (values?.toxicityScoreTo || 0)) {
		errors.toxicityScoreFrom = i18next.t('loc:Toxicita OD musí byť menšia alebo rovnaká ako toxicita DO')
		errors.toxicityScoreTo = true as any
	}

	return errors
}

export default validateReviewsFilterForm