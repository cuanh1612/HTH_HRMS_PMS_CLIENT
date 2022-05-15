import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box, Button, ButtonGroup } from '@chakra-ui/react'

export default function date() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const [calendar, setCalendar] = useState<Calendar>()
	const [data] = useState([
		{
			title: 'dd dsfs fsd dsfds sd d sd dsf sdf sd sdsd sd',
			start: '2022-04-08',
			backgroundColor: '#FFAAA720',
			borderColor: 'white',
			textColor: '#FFAAA7',
			id: 'hoanf',
		},
		{
			title: 'dd',
			start: '2022-04-08',
			backgroundColor: '#FFAAA7',
			borderColor: 'white',
			textColor: 'black',
			id: 'hoandf',
		},
		{
			title: 'dd',
			start: '2022-04-08',
			backgroundColor: '#FFAAA7',
			borderColor: 'white',
			textColor: 'black',
			id: 'hodasanf',
		},
		{
			title: 'dd',
			start: '2022-04-08',
			backgroundColor: '#FFAAA7',
			borderColor: 'white',
			textColor: 'black',
			id: 'hossanf',
		},
	])

	useEffect(() => {
		if (isAuthenticated) {
			if (calendar) {
				calendar.render()
			}
			handleLoading(false)
		}
	}, [isAuthenticated])

	useEffect(() => {
		setCalendar(
			new Calendar(document.getElementById('fff') as HTMLElement, {
				plugins: [interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin],
				events: [
					...data,
					{
						title: 'ddfff',
						start: new Date().toLocaleDateString(),
						backgroundColor: 'red',
						id: '111',
					},
					{
						id: '999',
						title: 'Repeating Event',
						start: '2022-4- 09',
						backgroundColor: 'yellow'
					},  
				],
				editable: false,
				selectable: true,
				headerToolbar: {
					center: undefined,
					right: undefined,
					left: 'title',
				},
				dayCellClassNames: 'dayCell',
				viewClassNames: 'view',
				eventClassNames: 'event',
				allDayClassNames: 'allDay',
				dayHeaderClassNames: 'dayHeader',
				moreLinkClassNames: 'moreLink',
				noEventsClassNames: 'noEvent',
				slotLaneClassNames: 'slotLane',
				slotLabelClassNames: 'slotLabel',
				weekNumberClassNames: 'weekNumber',
				nowIndicatorClassNames: 'nowIndicator',
			})
		)
	}, [data])

	useEffect(() => {
		if (calendar) {
			calendar.render()
			calendar.on('dateClick', function (info) {
				console.log(info)
			})

			calendar.on('select', function (info) {
				console.log(info)
			})

			calendar.on('eventClick', (info) => {
				console.log(info)
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar])

	return (
		<div>
			<ButtonGroup bg={'hu-Green.lightA'} p={'10px 10px'} spacing={4} borderRadius={10}>
				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					onClick={() => calendar?.changeView('dayGridMonth')}
				>
					Month
				</Button>
				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					onClick={() => calendar?.changeView('timeGridWeek')}
				>
					Week
				</Button>

				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					onClick={() => calendar?.changeView('listWeek')}
				>
					listWeek
				</Button>
				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					onClick={() => calendar?.changeView('timeGridDay')}
				>
					Day
				</Button>
			</ButtonGroup>

			<ButtonGroup bg={'hu-Green.lightA'} p={'10px 10px'} spacing={4} borderRadius={10}>
				<Button color={'white'} bg={'hu-Green.normal'} onClick={() => calendar?.prev()}>
					Prev
				</Button>
				<Button color={'white'} bg={'hu-Green.normal'} onClick={() => calendar?.next()}>
					next
				</Button>
				<Button color={'white'} bg={'hu-Green.normal'} onClick={() => calendar?.today()}>
					today
				</Button>
				<Button color={'white'} bg={'hu-Green.normal'} onClick={() => calendar?.prevYear()}>
					Prev year
				</Button>
				<Button color={'white'} bg={'hu-Green.normal'} onClick={() => calendar?.nextYear()}>
					next year
				</Button>
			</ButtonGroup>

			<Box padding={'10'} id={'fff'} />
		</div>
	)
}
