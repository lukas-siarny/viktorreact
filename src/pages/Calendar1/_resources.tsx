import { uniqueId } from 'lodash'
import Avatar from '../../assets/images/avatar.png'

const EMPLOYEES = [
	{
		id: '1',
		name: 'Tadej Pogacar',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#2EAF00'
	},
	{
		id: '2',
		name: 'Primoz Roglic',
		times: '8:00 - 11:00, 12:00 - 18:00',
		image: Avatar,
		color: '#4656E6'
	},
	{
		id: '3',
		name: 'Egan Bernal',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#DC7C0C'
	},
	{
		id: '4',
		name: 'Remco Evenpoel',
		times: '8:00 - 12:00, 13:00 - 16:00',
		image: Avatar,
		color: '#FF5353'
	},
	{
		id: '5',
		name: 'Alechandro Valverde',
		times: 'Time off',
		image: Avatar,
		color: '#000'
	}
]

const INITIAL_CALENDAR_STATE = {
	events: [
		// normal events
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Janice Runolfsson',
			start: '2022-10-10T09:00:00',
			end: '2022-10-10T11:00:00',
			allDay: false,
			description: 'Woman’s cut + Styling',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Vincent Oberbrunner',
			start: '2022-10-10T12:00:00',
			end: '2022-10-10T13:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Dianna Harris',
			start: '2022-10-10T13:00:00',
			end: '2022-10-10T17:00:00',
			allDay: false,
			description: 'Woman’s cut + Balayage',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-10T08:00:00',
			end: '2022-10-10T09:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Albert Emmerich',
			start: '2022-10-10T09:00:00',
			end: '2022-10-10T10:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Luther Skiles',
			start: '2022-10-10T14:00:00',
			end: '2022-10-10T15:00:00',
			allDay: false,
			description: 'Man’s cut with washing and styling',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-10T15:00:00',
			end: '2022-10-10T16:30:00',
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-10T15:15:00',
			end: '2022-10-10T18:30:00',
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		// backgroundEvents - shifts
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-10T09:00:00',
			end: '2022-10-10T10:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-10T10:00:00',
			end: '2022-10-10T11:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-10T11:00:00',
			end: '2022-10-10T12:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: '2022-10-10T08:00:00',
			end: '2022-10-10T11:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: '2022-10-10T12:00:00',
			end: '2022-10-10T18:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		// backgroundEvents - timeOff
		{
			resourceId: EMPLOYEES[2].id,
			start: '2022-10-10T00:00:00',
			end: '2022-10-10T24:00:00',
			backgroundColor: '#DC0069',
			display: 'background'
		}
	],
	resources: [
		{ id: EMPLOYEES[0].id, employeeData: EMPLOYEES[0] },
		{ id: EMPLOYEES[1].id, employeeData: EMPLOYEES[1] },
		{ id: EMPLOYEES[2].id, employeeData: EMPLOYEES[2] },
		{ id: EMPLOYEES[3].id, employeeData: EMPLOYEES[3] },
		{ id: EMPLOYEES[4].id, employeeData: EMPLOYEES[4] }
	]
}
