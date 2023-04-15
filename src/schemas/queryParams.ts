import { z } from 'zod'
import {
	SALONS_TAB_KEYS,
	SALON_CREATE_TYPE,
	SALON_FILTER_OPENING_HOURS,
	SALON_FILTER_RS,
	SALON_FILTER_RS_AVAILABLE_ONLINE,
	SALON_FILTER_STATES,
	SALON_SOURCE_TYPE
} from '../utils/enums'

export const salonsURLParamsSchema = z.object({
	search: z.string().nullish(),
	categoryFirstLevelIDs: z.string().array().nullish(),
	statuses_all: z.boolean().nullish(),
	statuses_published: z.enum([SALON_FILTER_STATES.PUBLISHED, SALON_FILTER_STATES.NOT_PUBLISHED]).nullish(),
	salonState: z.nativeEnum(SALONS_TAB_KEYS).nullish(),
	statuses_changes: z.enum([SALON_FILTER_STATES.PENDING_PUBLICATION, SALON_FILTER_STATES.DECLINED]).nullish(),
	limit: z.number().nullish(),
	page: z.number().nullish(),
	order: z.string().nullish(),
	countryCode: z.string().nullish(),
	createType: z.nativeEnum(SALON_CREATE_TYPE).nullish(),
	lastUpdatedAtFrom: z.string().nullish(),
	lastUpdatedAtTo: z.string().nullish(),
	hasSetOpeningHours: z.nativeEnum(SALON_FILTER_OPENING_HOURS).nullish(),
	sourceType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	assignedUserID: z.string().nullish(),
	premiumSourceUserType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	hasAvailableReservationSystem: z.nativeEnum(SALON_FILTER_RS_AVAILABLE_ONLINE).nullish(),
	enabledReservationsSetting: z.nativeEnum(SALON_FILTER_RS).nullish()
})

export type ISalonURLQueryParams = z.infer<typeof salonsURLParamsSchema>

// export const validationActivationFn = (values: IActivationForm, props: any) => zodErrorsToFormErrors(activationSchema, FORM.ACTIVATION, values, props)
