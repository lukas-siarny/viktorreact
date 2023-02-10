export enum EVENTS {
	EVENTS_LOAD_START = 'EVENTS_LOAD_START',
	EVENTS_LOAD_DONE = 'EVENTS_LOAD_DONE',
	EVENTS_LOAD_FAIL = 'EVENTS_LOAD_FAIL',
	EVENTS_CLEAR = 'EVENTS_CLEAR',
	EVENTS_REFRESH = 'EVENTS_REFRESH'
}

export enum EVENT_DETAIL {
	EVENT_DETAIL_LOAD_START = 'EVENT_DETAIL_LOAD_START',
	EVENT_DETAIL_LOAD_DONE = 'EVENT_DETAIL_LOAD_DONE',
	EVENT_DETAIL_LOAD_FAIL = 'EVENT_DETAIL_LOAD_FAIL'
}

export enum RESERVATIONS {
	RESERVATIONS_LOAD_START = 'RESERVATIONS_LOAD_START',
	RESERVATIONS_LOAD_DONE = 'RESERVATIONS_LOAD_DONE',
	RESERVATIONS_LOAD_FAIL = 'RESERVATIONS_LOAD_FAIL'
}

export const UPDATE_EVENT = 'UPDATE_EVENT'
export const SET_IS_REFRESHING_EVENTS = 'SET_IS_REFRESHING_EVENTS'
export const SET_DAY_DETAIL_DATE = 'SET_DAY_DETAIL_DATE'
export const SET_DAY_EVENTS = 'SET_DAY_EVENTS'
