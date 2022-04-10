import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

import { Calendar, EventInput } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box, Button, ButtonGroup, HStack, useDisclosure } from '@chakra-ui/react'

import { allLeaveQuery } from 'queries/leave'

import { NextLayout } from 'type/element/layout'
// use layout
import { ClientLayout } from 'components/layouts'
import ButtonIcon from 'components/ButtonIcon'
import { MdOutlineArrowBack, MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import Drawer from 'components/Drawer'
import UpdateLeaves from './update-leaves'
import AddLeaves from './add-leaves'

const calendar: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])

	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const [leaveIdUpdate, setLeaveIdUpdate] = useState<number | null>(30)

	useEffect(() => {
		if (isAuthenticated) {
			if (calendar) {
				calendar.render()
			}
			handleLoading(false)
		}
	}, [isAuthenticated])

	const { data: allLeaves, mutate: refetchAllLeaves } = allLeaveQuery(isAuthenticated)

	useEffect(() => {
		if (allLeaves) {
			const newData = allLeaves.leaves?.map((item): EventInput => {
				return {
					title: item.employee.name,
					id: `${item.id}`,
					backgroundColor: `${item.leave_type.color_code}30`,
					textColor: item.leave_type.color_code,
					date: item.date,
					borderColor: `${item.leave_type.color_code}`,
				}
			})
			setData(newData || [])
		}
	}, [allLeaves])

	useEffect(() => {
		setCalendar(
			new Calendar(document.getElementById('calendar') as HTMLElement, {
				plugins: [interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin],
				events: data,
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
				setLeaveIdUpdate(Number(info.event.id))
				onOpenUpdate()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar])

	return (
		<Box>
			<HStack paddingBlock={'5'} justifyContent={'space-between'}>
				<ButtonGroup spacing={4}>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => onOpenAdd()}
					>
						Add leave
					</Button>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.changeView('timeGridDay')}
					>
						Day
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
						onClick={() => calendar?.changeView('dayGridMonth')}
					>
						Month
					</Button>
				</ButtonGroup>

				<ButtonGroup spacing={4}>
					<ButtonIcon
						handle={() => calendar?.prev()}
						ariaLabel={'first page'}
						icon={<MdOutlineNavigateBefore />}
					/>
					<Button
						color={'white'}
						bg={'hu-Green.normal'}
						onClick={() => calendar?.today()}
					>
						today
					</Button>
					<ButtonIcon
						handle={() => calendar?.next()}
						ariaLabel={'next page'}
						icon={<MdOutlineNavigateNext />}
					/>
				</ButtonGroup>
			</HStack>
			<Box id={'calendar'} />
			{/* drawer to update leave */}
			<Drawer size="xl" title="Update leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeaves onCloseDrawer={onCloseUpdate} leaveId={leaveIdUpdate} />
			</Drawer>

			{/* drawer to add leave */}
			<Drawer size="xl" title="Add leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeaves onCloseDrawer={onCloseAdd} />
			</Drawer>
		</Box>
	)
}

calendar.getLayout = ClientLayout

export default calendar
