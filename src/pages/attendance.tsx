import {
	Avatar,
	Box,
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import CheckAttendance from 'components/anttendance/CheckAttendance'
import Dates from 'components/anttendance/Dates'
import { Input } from 'components/form/Input'
import { Switch } from 'components/form/Switch'
import TimePicker from 'components/form/TimePicker'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allAttendancesQuery } from 'queries/attendance'
import { allLeaveQuery } from 'queries/leave'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IAttendance } from 'type/element/commom'
import { NextLayout } from 'type/element/layout'
import { AttendanceForm } from 'type/form/basicFormType'
import { AttendanceValidate } from 'utils/validate'

const attendance: NextLayout = () => {
	// setForm and submit form ----------------------------------------------------------
	const formSetting = useForm<AttendanceForm>({
		defaultValues: {
			late: false,
			halfDay: false,
			workingFrom: '',
			clockIn: '',
			clockOut: ''
		},
		resolver: yupResolver(AttendanceValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: AttendanceForm) => {
		console.log(values)
	}

	const router = useRouter()

	// get date to filter
	const [dateFilter, setDateFilter] = useState(new Date())
	
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	// get all attendance
	const { data: allAttendances } = allAttendancesQuery(isAuthenticated, dateFilter)
	// get all leaves
	const { data: allLeaves } = allLeaveQuery(isAuthenticated, dateFilter)
	// get last day
	const [lastDate, setLastDate] = useState(0)

	// set open modal to check attendance
	const { isOpen, onOpen, onClose } = useDisclosure()
	
	// get info user to check attendance
	const [user, setUser] = useState<{
		id: number
		name: string
		avatar: string
		designation: string
		date: number
	}>()

	// check authenticate
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
		if (isAuthenticated == false) {
			router.push('/login')
		}
	}, [isAuthenticated])

	// get last date in this month
	useEffect(() => {
		var currMonth = dateFilter.getMonth()
		var currYear = dateFilter.getFullYear()
		var newDate = new Date(currYear, currMonth + 1, 0)
		var lastDayOfMonth = newDate.getDate()
		setLastDate(lastDayOfMonth)
	}, [dateFilter])

	return (
		<>
			<select onChange={(event)=> {
				if(Number(event.target.value) == 0) {
					setDateFilter(new Date())
				} else {
					setDateFilter(date => new Date(date.setMonth(Number(event.target.value) - 1 )))
				}
			}}>
				<option value={0}>now</option>
				<option value={1}>1</option>
				<option value={2}>2</option>
				<option value={3}>3</option>
				<option value={4}>4</option>
				<option value={5}>5</option>
				<option value={6}>6</option>
				<option value={7}>7</option>
				<option value={8}>8</option>
				<option value={9}>9</option>
				<option value={10}>10</option>
				<option value={11}>11</option>
				<option value={12}>12</option>
			</select>
			<VStack paddingBottom={'25px'} spacing={5} alignItems={'start'} overflow={'auto'}>
				<HStack spacing={10} alignItems="center" justifyContent={'space-between'}>
					<HStack spacing={10}>
						<Text
							fontSize={'md'}
							color={'hu-GreenN.darkH'}
							fontFamily={'"Montserrat", sans-serif'}
							fontWeight={'semibold'}
							minW={'200px'}
						>
							Employees
						</Text>
						<HStack spacing={5}>
							<Dates countDate ={lastDate} />
						</HStack>
					</HStack>
					<Text
						minW={'100px'}
						fontSize={'md'}
						color={'hu-GreenN.darkH'}
						fontFamily={'"Montserrat", sans-serif'}
						fontWeight={'semibold'}
					>
						Total
					</Text>
				</HStack>

				{allAttendances?.data.map((employee) => {
					const attendances = employee.attendances.map(
						(attendance): IAttendance => ({
							id: attendance.id,
							date: attendance.date,
							handle: () => {
								alert('nguyen quang hoang')
							},
							id_Employee: employee.id,
						})
					)
					return (
						<HStack
							spacing={10}
							key={employee.id}
							alignItems="center"
							justifyContent={'space-between'}
						>
							<HStack spacing={10}>
								<HStack minW={'200px'} spacing={3}>
									<Avatar
										name={employee.name}
										src={employee.avatar?.url}
										size={'sm'}
									/>
									<Box w={'full'}>
										<Text>{employee.name}</Text>
										{employee.designation && (
											<Text color={'gray'} fontSize={'14px'}>
												{employee.designation.name}
											</Text>
										)}
									</Box>
								</HStack>
								<HStack spacing={5}>
									<CheckAttendance
										createHandle={(date: number) => {
											setUser({
												id: employee.id,
												avatar: employee.avatar?.url as string,
												designation: employee.designation?.name as string,
												name: employee.name,
												date,
											})
											onOpen()
										}}
										countDate={lastDate}
										attendances={attendances}
										leaveDates={allLeaves?.leaves}
										dateFilter={dateFilter}
									/>
								</HStack>
							</HStack>
							<Box minW={'100px'}>
								<Text
									color={'hu-Green.normal'}
									fontWeight={'semibold'}
									fontSize={'20px'}
									as={'span'}
								>
									{attendances.length}
								</Text>
								<Text color={'gray.500'} as={'span'}>
									{' '}
									/{lastDate}
								</Text>
							</Box>
						</HStack>
					)
				})}

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Check attendance</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack
								as={'form'}
								id="attendance"
								onSubmit={handleSubmit(onSubmit)}
								alignItems={'start'}
								spacing={5}
							>
								{user && (
									<>
										<HStack minW={'200px'} spacing={3}>
											<Avatar name={user.name} src={user.avatar} />
											<Box w={'full'}>
												<Text>{user.name}</Text>
												<Text color={'gray'} fontSize={'14px'}>
													{user.designation}
												</Text>
											</Box>
										</HStack>
										<HStack spacing={5}>
											<TimePicker
												form={formSetting}
												label="Clock in"
												name={'clockIn'}
												required={true}
												date={user.date}
											/>
											<TimePicker
												form={formSetting}
												label="Clock out"
												name={'clockOut'}
												required={true}
												date={user.date}
											/>
										</HStack>
									</>
								)}

								<Input
									placeholder="e.g. Office, Home, etc."
									label={'Working from'}
									name={'workingFrom'}
									form={formSetting}
								/>
								<HStack spacing={5}>
									<Switch form={formSetting} name="late" label="Late" />
									<Switch form={formSetting} name="halfDay" label="Half day" />
								</HStack>
							</VStack>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="red" variant={'ghost'} mr={3} onClick={onClose}>
								Close
							</Button>
							<Button form="attendance" type="submit" colorScheme={'green'}>
								Save
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</VStack>
		</>
	)
}

attendance.getLayout = ClientLayout

export default attendance
