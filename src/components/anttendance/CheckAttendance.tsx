import { HStack, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { AiTwotoneStar } from 'react-icons/ai'
import { BiCheck } from 'react-icons/bi'
import { BsDash } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoAirplaneOutline } from 'react-icons/io5'
import { holidayType, leaveType } from 'type/basicTypes'
import { IAttendance } from 'type/element/commom'

interface ICheckAttendance {
	// số ngày
	countDate: number
	// ngày attendance
	attendances?: IAttendance[]
	// ngày nghỉ
	leaveDates?: leaveType[]
	// khi tạo ngày nghỉ thì làm gì
	createHandle: any
	// lọc theo tháng, năm
	dateFilter: Date

	holidays?: holidayType[]

	isChange?: boolean
}

export default function CheckAttendance({
	countDate,
	attendances,
	leaveDates,
	createHandle,
	dateFilter,
	holidays,
	isChange = true,
}: ICheckAttendance) {
	const [dates, setDates] = useState<number[]>([])
	const [now] = useState<Date>(new Date())

	useEffect(() => {
		if (countDate) {
			const data = []
			for (let index = 1; index <= countDate; index++) {
				data.push(index)
			}
			setDates(data)
		}
	}, [countDate])

	return (
		<>
			{dates.map((date) => {
				const checkAttendance = attendances?.find((attendance) => {
					return (
						new Date(attendance.date).toLocaleDateString() ==
						new Date(
							new Date().setFullYear(
								dateFilter.getFullYear(),
								dateFilter.getMonth(),
								date
							)
						).toLocaleDateString()
					)
				}) as IAttendance

				const checkLeave =
					leaveDates &&
					leaveDates.some(function (value) {
						const leaveDate = new Date(value.date)
						return (
							date == leaveDate.getDate() &&
							leaveDate.getMonth() == dateFilter.getMonth() &&
							leaveDate.getFullYear() == dateFilter.getFullYear()
						)
					})

				const checkHoliday =
					holidays &&
					holidays.some(function (value) {
						const holydayDate = new Date(value.holiday_date)
						return (
							date == holydayDate.getDate() &&
							holydayDate.getMonth() == dateFilter.getMonth() &&
							holydayDate.getFullYear() == dateFilter.getFullYear()
						)
					})

				// leave
				if (checkLeave) {
					return (
						<HStack
							key={date}
							h={'30px'}
							minW={'30px'}
							bg={'hu-Pink.lightA'}
							userSelect={'all'}
							color={'hu-Pink.normalA'}
							aria-label="Search database"
							borderRadius={'5px'}
							justifyContent={'center'}
						>
							<IoAirplaneOutline />
						</HStack>
					)
				}

				// holiday
				if (checkHoliday) {
					return (
						<HStack
							key={date}
							h={'30px'}
							minW={'30px'}
							bg={'yellow.200'}
							userSelect={'all'}
							color={'yellow.500'}
							aria-label="Search database"
							borderRadius={'5px'}
							justifyContent={'center'}
						>
							<AiTwotoneStar />
						</HStack>
					)
				}

				// users attended
				if (checkAttendance) {
					return (
						<IconButton
							onClick={() => {
								if (isChange) {
									checkAttendance.handle(
										new Date().setFullYear(
											dateFilter.getFullYear(),
											dateFilter.getMonth(),
											date
										)
									)
								}
							}}
							key={date}
							h={'30px'}
							minW={'30px'}
							bg={'hu-Green.lightA'}
							color={'hu-Green.normal'}
							icon={<BiCheck fontSize={20} />}
							aria-label="Search database"
						/>
					)
				}

				// not attendance
				if (
					dateFilter.getFullYear() <= now.getFullYear() &&
					dateFilter.getMonth() < now.getMonth()
				) {
					return (
						<IconButton
							key={date}
							onClick={() => {
								if (isChange) {
									createHandle(
										new Date().setFullYear(
											dateFilter.getFullYear(),
											dateFilter.getMonth(),
											date
										)
									)
								}
							}}
							h={'30px'}
							minW={'30px'}
							bg={'gray.200'}
							color={'gray.500'}
							icon={<IoMdClose />}
							aria-label="Search database"
						/>
					)
				}

				// now
				if (
					(date <= now.getDate() &&
						dateFilter.getFullYear() <= now.getFullYear() &&
						dateFilter.getMonth() <= now.getMonth()) ||
					dateFilter.getFullYear() < now.getFullYear()
				)
					return (
						<IconButton
							key={date}
							onClick={() => {
								if (isChange) {
									createHandle(
										new Date().setFullYear(
											dateFilter.getFullYear(),
											dateFilter.getMonth(),
											date
										)
									)
								}
							}}
							h={'30px'}
							minW={'30px'}
							bg={'gray.200'}
							color={'gray.500'}
							icon={<IoMdClose />}
							aria-label="Search database"
						/>
					)

				return (
					<IconButton
						key={date}
						h={'30px'}
						minW={'30px'}
						variant={'link'}
						icon={<BsDash />}
						aria-label="Search database"
						disabled
					/>
				)
			})}
		</>
	)
}
