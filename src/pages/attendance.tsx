import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react'
import CheckAttendance from 'components/anttendance/CheckAttendance'
import Dates from 'components/anttendance/Dates'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { allAttendancesQuery } from 'queries/attendance'
import { allLeaveQuery } from 'queries/leave'
import { useContext, useEffect, useState } from 'react'
import { leaveDate } from 'type/basicTypes'
import { ICheckAttendace } from 'type/element/commom'
import { NextLayout } from 'type/element/layout'

const attendace: NextLayout = () => {
	const [leaveDates, setLeaveDates] = useState<leaveDate[]>([])
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const { data: allAttendances } = allAttendancesQuery(isAuthenticated)
	const { data: allLeaves } = allLeaveQuery(isAuthenticated)
	const [lastDate, setLastDate] = useState(30)

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	useEffect(() => {
		if(allLeaves) {
			const leaveApproved = allLeaves.leaves?.filter(item => {
				return item.status == 'Approved'
			})

			if(leaveApproved) {
				const data = leaveApproved.map((item): leaveDate=> ({
					id: item.id,
					id_employee: item.employee.id,
					date: new Date(item.date).getDate()
				}))
				console.log(data)
				setLeaveDates(data as leaveDate[])
			}
		}
	}, [allLeaves])

	useEffect(() => {
		var currDate = new Date()
		var currMonth = currDate.getMonth()
		var currYear = currDate.getFullYear()
		var newDate = new Date(currYear, currMonth + 1, 0)
		var lastDayOfMonth = newDate.getDate()
		setLastDate(lastDayOfMonth)
	}, [])

	return (
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
						<Dates count={lastDate} />
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
				const attendances = employee.attendances.map((attendance):ICheckAttendace => ({
					id: attendance.id,
					date: new Date(attendance.date).getDate(),
					handle: ()=> {},
					id_Employee: employee.id
				}))
				return (
					<HStack spacing={10} key={employee.id} alignItems="center" justifyContent={'space-between'}>
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
									count={lastDate}
									attendances={attendances}
									leaveDates={leaveDates}
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
								/30
							</Text>
						</Box>
					</HStack>
				)
			})}
		</VStack>
	)
}

attendace.getLayout = ClientLayout

export default attendace
