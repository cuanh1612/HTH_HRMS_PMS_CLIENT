import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Collapse,
	Grid,
	HStack,
	StackDivider,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventInput } from '@fullcalendar/common'
import { Donut } from 'components/charts'
import { AlertDialog, ButtonIcon, Card, Empty, Head, ItemDashboard } from 'components/common'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'

import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	applicationSourcesQuery,
	applicationStatusQuery,
	newInterviewQuery,
	openJobsQuery,
	todayInterviewCalendarQuery,
	todayInterviewQuery,
	totalApplicationsQuery,
	totalHiredQuery,
	totalOpeningsQuery,
	totalRejectedQuery,
} from 'queries/dashboardJobs'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { RiSuitcaseLine } from 'react-icons/ri'
import { interviewType, jobType } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { Drawer } from 'components/Drawer'
import DetailInterview from './interviews/[interviewId]'
import UpdateInterview from './interviews/[interviewId]/update'
import { deleteInterviewMutation } from 'mutations/interview'

const dashboard: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { colorMode } = useColorMode()

	// style
	const dayHeader = useColorModeValue('dayHeader', 'dayHeader--dark')

	const [calendar, setCalendar] = useState<Calendar>()
	const [data, setData] = useState<EventInput[]>([])
	const [interviewId, setInterviewId] = useState<number | null>(null)

	const { onToggle: onToggleCards, isOpen: isOpenCards } = useDisclosure({
		defaultIsOpen: true,
	})
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	const { data: dataApplicationSources } = applicationSourcesQuery(isAuthenticated)
	const { data: dataApplicationStatus } = applicationStatusQuery(isAuthenticated)
	const { data: dataNewInterview, mutate: refetchNewInterview } =
		newInterviewQuery(isAuthenticated)
	const { data: dataTodayInterview, mutate: refetchTodayInterview } =
		todayInterviewQuery(isAuthenticated)
	const { data: dataTodayInterviewCalendar, mutate: refetchTodayInterviewCalendar } =
		todayInterviewCalendarQuery(isAuthenticated)
	const { data: dataOpenJobs } = openJobsQuery(isAuthenticated)
	const { data: dataTotalApplications } = totalApplicationsQuery(isAuthenticated)
	const { data: dataTotalHired } = totalHiredQuery(isAuthenticated)
	const { data: dataTotalOpenings } = totalOpeningsQuery(isAuthenticated)
	const { data: dataTotalRejected } = totalRejectedQuery(isAuthenticated)

	// mutate
	const [deleteOne, { data: dataDlOne, status: statusDlOne }] = deleteInterviewMutation(setToast)

	//User effect ---------------------------------------------------------------
	//Handle check login
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
			refetchTodayInterviewCalendar()
			refetchNewInterview()
			refetchTodayInterview()
			onCloseDetail()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (dataTodayInterviewCalendar) {
			const newData = dataTodayInterviewCalendar.todayInterview?.map(
				(item: interviewType): EventInput => {
					return {
						title: item.candidate.name,
						id: `${item.id}`,
						backgroundColor: `#B0E4DD`,
						textColor: '#008774',
						date: item.date,
						borderColor: `#008774`,
					}
				}
			)
			setData(newData || [])
		}
	}, [dataTodayInterviewCalendar, colorMode])

	// set calendar
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
			calendar.on('dateClick', function (info) {})

			calendar.on('select', function (info) {})

			calendar.on('eventClick', (info) => {
				setInterviewId(Number(info.event.id))
				onOpenDetail()
			})

			calendar.on('eventDragStop', (info) => {})
		}
	}, [calendar])

	return (
		<Box w={'100%'} pb={8} pos={'relative'}>
			<Head title="Dashboards" />
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggleCards}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
				mb={4}
			>
				<Text fontWeight={'semibold'}>Information</Text>
				{isOpenCards ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpenCards} animateOpacity>
				<Grid
					overflow={'hidden'}
					templateColumns={[
						'repeat(1, 1fr)',
						'repeat(2, 1fr)',
						'repeat(3, 1fr)',
						null,
						'repeat(4, 1fr)',
					]}
					gap={6}
					mb={'30px'}
				>
					<Card
						link={'/jobs'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={'Total openings'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataTotalOpenings?.totalOpenings || 0}
					/>
					<Card
						link={'/job-applications'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={'Total applications'}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataTotalApplications?.totalApplications || 0}
					/>
					<Card
						link={'/job-applications'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={'Total hired'}
						bg={'hu-Pink.lightH'}
						borderColor={'hu-Pink.normal'}
						text={dataTotalHired?.totalHired || 0}
					/>
					<Card
						link={'/job-applications'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={'Total rejected'}
						bg={'hu-Lam.lightH'}
						borderColor={'hu-Lam.normal'}
						text={dataTotalRejected?.totalRejected || 0}
					/>
					<Card
						link={'/jobs'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={'New interviews'}
						bg={'hu-Green.lightH'}
						borderColor={'hu-Green.normal'}
						text={dataNewInterview?.newInterview || 0}
					/>
					<Card
						link={'/job-applications'}
						icon={<RiSuitcaseLine fontSize={'20px'} />}
						title={"Today's interviews"}
						bg={'hu-GreenN.lightH'}
						borderColor={'hu-GreenN.normal'}
						text={dataTodayInterview?.todayInterview || 0}
					/>
				</Grid>
			</Collapse>
			<Grid
				w={'full'}
				templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}
				gap={6}
			>
				<ItemDashboard title="Application sources">
					{dataApplicationSources?.applicationSources.length > 0 ? (
						<Donut
							colors={dataApplicationSources.applicationSources.map(
								(item: { count: number; source: string }) => {
									switch (item.source) {
										case 'Linkedin':
											return '#0a66c2'
										case 'Facebook':
											return '#1877f2'
										case 'Instagram':
											return '#e4405f'
										case 'Twitter':
											return '#1da1f2'
										case 'Other':
											return '#f57d00'
										default:
											return ''
									}
								}
							)}
							data={dataApplicationSources.applicationSources.map((item: any) => {
								return Number(item.count)
							})}
							height={300}
							labels={dataApplicationSources.applicationSources.map((item: any) => {
								return item.source
							})}
						/>
					) : (
						<Empty height="220px" />
					)}
				</ItemDashboard>

				<ItemDashboard title="Application status">
					{dataApplicationStatus?.applicationStatus.length > 0 ? (
						<Donut
							colors={dataApplicationStatus.applicationStatus.map(
								(item: { count: number; status: string }) => {
									switch (item.status) {
										case 'Applied':
											return '#000000'
										case 'Phone screen':
											return '#ffff00'
										case 'Interview':
											return '#2f75ff'
										case 'Hired':
											return '#008000'
										case 'Rejected':
											return '#ff0000'
										default:
											return ''
									}
								}
							)}
							data={dataApplicationStatus.applicationStatus.map((item: any) => {
								return Number(item.count)
							})}
							height={300}
							labels={dataApplicationStatus.applicationStatus.map((item: any) => {
								return item.status
							})}
						/>
					) : (
						<Empty height="220px" />
					)}
				</ItemDashboard>

				<ItemDashboard isFull title="Open jobs" overflow={'auto'}>
					{dataOpenJobs?.openJobs.length > 0 ? (
						<VStack
							spacing={5}
							w={'full'}
							divider={<StackDivider />}
							alignItems={'start'}
							justifyContent={'start'}
						>
							{dataOpenJobs.openJobs.map((item: jobType, key: number) => {
									return (
										<HStack
											key={key}
											spacing={5}
											w={'full'}
											pos={'relative'}
											justifyContent={'space-between'}
										>
											<HStack spacing={3}>
												<Avatar
													size={'sm'}
													src={item.recruiter.avatar?.url}
													name={item.recruiter.name}
												/>
												<Box overflow={'hidden'} w={'150px'} minW={'150px'}>
													<Link
														passHref
														href={`/employees/${item.recruiter.id}/detail`}
													>
														<Text
															w={'99%'}
															isTruncated
															_hover={{
																textDecoration: 'underline',
																cursor: 'pointer',
															}}
														>
															{item.recruiter.name}
														</Text>
													</Link>
													<Text fontSize={'14px'} color={'gray'}>
														{item.recruiter.department?.name}
													</Text>
												</Box>
											</HStack>
											<Text fontWeight={'semibold'}>{item.title}</Text>
											<HStack spacing={10}>
												<Text color={'red'}>
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
														useGrouping: false,
													}).format(Number(item.total_openings))}
												</Text>
												<Text color={'gray'}>
													{new Date(item.ends_on_date).toLocaleDateString(
														'es-CL'
													)}
												</Text>
												<Link href={`/jobs/${item.id}/profile`}>
													<Button>View</Button>
												</Link>
											</HStack>
										</HStack>
									)
								})}
						</VStack>
					) : (
						<Empty height="220px" />
					)}
				</ItemDashboard>

				<ItemDashboard heightAuto isFull title="Today's Interview" overflow={'auto'}>
					<HStack paddingBlock={'5'} justifyContent={'space-between'}>
						<ButtonGroup spacing={4}>
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
				</ItemDashboard>
			</Grid>
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
		</Box>
	)
}

dashboard.getLayout = ClientLayout
export default dashboard
