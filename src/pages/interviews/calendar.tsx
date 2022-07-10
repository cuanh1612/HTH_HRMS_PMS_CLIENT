import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	HStack,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { EventInput } from '@fullcalendar/common'
import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allInterviewsNewQuery, allInterviewsQuery, IOptionInterview } from 'queries/interview'
import React, { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { IFilter } from 'type/tableTypes'
import Head from 'next/head'
import { AlertDialog, ButtonIcon } from 'components/common'
import { MdOutlineMoreVert, MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { IoEyeOutline } from 'react-icons/io5'
import { Drawer } from 'components/Drawer'
import UpdateInterview from './[interviewId]/update'
import DetailInterview from './[interviewId]'
import AddInterviews from './add-interviews'
import { deleteInterviewMutation } from 'mutations/interview'
import { DateRange, Select, SelectCustom } from 'components/filter'
import { dataInterviewStatus } from 'utils/basicData'
import { IOption } from 'type/basicTypes'
import { allEmployeesNormalQuery } from 'queries'

const calendar: NextLayout = () => {
	const { currentUser, setToast, isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()
	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])
	// set filter
	const [filter, setFilter] = useState<IOptionInterview>({
		date: new Date(),
	})
	// get employee to select to filter
	const [employeesFilter, setEmployeesFilter] = useState<IOption[]>([])

	const [interviewId, setInterviewId] = useState<number | null>(null)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// query
	const { data: allInterviewSchedule, mutate: refetchAllInterview } = allInterviewsQuery(
		isAuthenticated,
		filter
	)
	const { data: allInterviewScheduleNew, mutate: refetchAllInterviewNew } =
		allInterviewsNewQuery(isAuthenticated)
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// mutate
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteInterviewMutation(setToast)

	//User effect ---------------------------------------------------------------
	// check authenticate in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// check is successfully delete one
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				msg: dataDlOne.message,
				type: statusDlOne,
			})
			refetchAllInterview()
			refetchAllInterviewNew()
			onCloseDetail()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (allInterviewSchedule) {
			const newData = allInterviewSchedule.interviews?.map((item): EventInput => {
				return {
					title: item.candidate.name,
					id: `${item.id}`,
					backgroundColor: `#B0E4DD`,
					textColor: '#008774',
					date: item.date,
					borderColor: `#008774`,
				}
			})
			setData(newData || [])
		}
	}, [allInterviewSchedule, colorMode])

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
				dayHeaderClassNames: dayHeader,
				moreLinkClassNames: 'moreLink',
				noEventsClassNames: 'noEvent',
				slotLaneClassNames: 'slotLane',
				slotLabelClassNames: 'slotLabel',
				weekNumberClassNames: 'weekNumber',
				nowIndicatorClassNames: 'nowIndicator',
			})
		)
	}, [data, colorMode])

	useEffect(() => {
		if (calendar) {
			calendar.render()
			if(filter.date) {
				calendar?.gotoDate(filter.date)
			}
			calendar.on('dateClick', function (info) {
				console.log(info)
			})

			calendar.on('select', function (info) {
				console.log(info)
			})

			calendar.on('eventClick', (info) => {
				setInterviewId(Number(info.event.id))
				onOpenDetail()
			})

			calendar.on('eventDragStop', (info) => {
				console.log(info)
			})
		}
	}, [calendar, filter])


	// set employee to filter
	useEffect(() => {
		if (allEmployees?.employees) {
			const valuesFilter = allEmployees.employees.map(
				(employee): IOption => ({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text color={colorMode == 'dark' ? 'white' : 'black'}>
									{employee.name}
								</Text>
							</HStack>
						</>
					),
					value: String(employee.id),
				})
			)
			setEmployeesFilter(valuesFilter)
		}
	}, [allEmployees, colorMode])

	return (
		<Box pb={8}>
			<Head>
				<title>Huprom - Interview schedule calendar</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<HStack alignItems={'flex-start'} spacing={5} w={'full'}>
				<Box paddingBlock={'5'} maxW={'300px'} minW={'300px'}>
					<Text mb={'35px'} fontSize={'20px'} fontWeight={'semibold'}>
						Interview Schedule
					</Text>
					<VStack
						h={'calc( 100vh - 200px )'}
						overflow={'auto'}
						spacing={5}
						justifyContent={'start'}
						w={'full'}
						pr={'10px'}
					>
						{allInterviewScheduleNew?.interviews &&
							allInterviewScheduleNew.interviews.map((interview, key) => (
								<HStack
									key={key}
									borderRadius={5}
									bg={'gray.100'}
									p={4}
									w={'full'}
									alignItems={'flex-start'}
									spacing={4}
								>
									<Avatar
										size={'sm'}
										src={`${interview.candidate.picture?.url || '/'}`}
										name={interview.candidate.name}
									/>
									<VStack
										overflow={'hidden'}
										w={'full'}
										alignItems={'flex-start'}
										spacing={3}
									>
										<Text
											onClick={() => {
												setInterviewId(interview.id)
												onOpenDetail()
											}}
											_hover={{
												textDecoration: 'underline',
												cursor: 'pointer',
											}}
											isTruncated
											fontWeight={'semibold'}
										>
											{interview.candidate.name}
										</Text>
										<Text fontSize={'14px'} color={'gray'}>
											{`${new Date(interview.date).toLocaleDateString(
												'es-CL'
											)}, ${interview.start_time}`}
										</Text>
										<Text>{interview.candidate.jobs.title}</Text>
									</VStack>
								</HStack>
							))}
					</VStack>
				</Box>
				<Box flex={1}>
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
							<Button
								color={'white'}
								bg={'hu-Green.normal'}
								onClick={() => {
									onOpenFilter()
								}}
							>
								filter
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
					<Drawer size="xl" title="Add Interview" onClose={onCloseAdd} isOpen={isOpenAdd}>
						<AddInterviews onCloseDrawer={onCloseAdd} />
					</Drawer>
					<Drawer
						size="xl"
						title="Update Interview"
						onClose={onCloseUpdate}
						isOpen={isOpenUpdate}
					>
						<UpdateInterview onCloseDrawer={onCloseUpdate} interviewId={interviewId} />
					</Drawer>
					<Drawer
						size="xl"
						title="Detail Interview"
						onClose={onCloseDetail}
						isOpen={isOpenDetail}
					>
						<DetailInterview
							onUpdate={onOpenUpdate}
							onDelete={onOpenDl}
							onCloseDrawer={onCloseDetail}
							interviewId={interviewId}
						/>
					</Drawer>
					{/* alert dialog when delete one */}
					<AlertDialog
						handleDelete={() => {
							deleteOne(interviewId)
						}}
						title="Are you sure?"
						content="You will not be able to recover the deleted record!"
						isOpen={isOpenDialogDl}
						onClose={onCloseDl}
					/>

					<Drawer
						size="xs"
						title="Filter"
						onClose={onCloseFilter}
						isOpen={isOpenFilter}
						footer={
							<Button
								onClick={() => {
									setFilter({
										date: new Date(),
										status: undefined,
										interviewer: undefined
									})
								}}
							>
								reset
							</Button>
						}
					>
						<VStack p={6} spacing={5}>
							<Select
								options={dataInterviewStatus}
								handleSearch={(data: IFilter) => {
									setFilter((state) => ({
										...state,
										status: data.filterValue,
									}))
								}}
								columnId={'status'}
								label="Status"
								placeholder="Select status"
								required={false}
							/>

							<Select
								options={[
									{
										label: 'January',
										value: 1,
									},
									{
										label: 'February',
										value: 2,
									},
									{
										label: 'March',
										value: 3,
									},
									{
										label: 'April',
										value: 4,
									},
									{
										label: 'May',
										value: 5,
									},
									{
										label: 'June',
										value: 6,
									},
									{
										label: 'July',
										value: 7,
									},
									{
										label: 'August',
										value: 8,
									},
									{
										label: 'September',
										value: 9,
									},
									{
										label: 'October',
										value: 10,
									},
									{
										label: 'November',
										value: 11,
									},
									{
										label: 'December',
										value: 12,
									},
								]}
								handleSearch={(data: IFilter) => {
									setFilter((state) => ({
										...state,
										date: state.date
											? new Date(state.date.setMonth(data.filterValue - 1))
											: new Date(new Date().setMonth(data.filterValue - 1)),
									}))
								}}
								columnId={'day'}
								label="Month"
								placeholder="Select month"
							/>

							<Select
								options={[
									{
										label: `${new Date().getFullYear()}`,
										value: `${new Date().getFullYear()}`,
									},
									{
										label: `${new Date().getFullYear() - 1}`,
										value: `${new Date().getFullYear() - 1}`,
									},
									{
										label: `${new Date().getFullYear() - 2}`,
										value: `${new Date().getFullYear() - 2}`,
									},
									{
										label: `${new Date().getFullYear() - 3}`,
										value: `${new Date().getFullYear() - 3}`,
									},
									{
										label: `${new Date().getFullYear() - 4}`,
										value: `${new Date().getFullYear() - 4}`,
									},
								]}
								handleSearch={(data: IFilter) => {
									setFilter((state) => ({
										...state,
										date: state.date
											? new Date(state.date.setFullYear(data.filterValue))
											: new Date(new Date().setFullYear(data.filterValue)),
									}))
								}}
								columnId={'holiday_date'}
								label="Year"
								placeholder="Select year"
							/>

							{employeesFilter && (
								<SelectCustom
									handleSearch={(field: any) => {
										setFilter((state) => ({
											...state,
											interviewer: field.value,
										}))
									}}
									label={'Interviewers'}
									name={'interviewer'}
									options={[
										{
											label: (
												<Text
													color={colorMode == 'light' ? 'black' : 'white'}
												>
													all
												</Text>
											),
											value: '',
										},

										...employeesFilter,
									]}
									required={false}
								/>
							)}
						</VStack>
					</Drawer>
				</Box>
			</HStack>
		</Box>
	)
}

calendar.getLayout = ClientLayout
export default calendar
