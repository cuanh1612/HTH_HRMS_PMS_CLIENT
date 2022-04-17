import { Box, HStack, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { BsDash } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { IoAirplaneOutline } from 'react-icons/io5'
import { leaveDate } from 'type/basicTypes'
import { ICheckAttendace } from 'type/element/commom'

interface ICheckAttendance {
	count: number
	attendances?: ICheckAttendace[]
	leaveDates: leaveDate[]
}

export default function CheckAttendance({ count, attendances, leaveDates}: ICheckAttendance) {
	const [dates, setDates] = useState<number[]>([])
	const [now, setNow] = useState<number>(new Date().getDate())

	useEffect(() => {
		if (count) {
			const data = []
			for (let index = 1; index <= count; index++) {
				data.push(index)
			}
			setDates(data)
		}
	}, [count])

	if (!attendances || attendances.length == 0) {
		return (
			<>
				{dates.map((date) => {
					if (date <= now) {
						return (
							<IconButton
								key={date}
								h={'30px'}
								minW={'30px'}
								bg={'gray.200'}
								color={'gray.500'}
								icon={<IoMdClose />}
								aria-label="Search database"
							/>
						)
					}
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
	return (
		<>
			{dates.map((date) => {
				const checkAttendance = attendances.find((attendance) => {
					if (attendance.date == date) return attendance
				}) as ICheckAttendace

				const checkLeave = leaveDates.some( function (value){
					return date == value.date 
				})

				if (checkLeave) {
					return (
						<HStack
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

				if (checkAttendance) {
					return (
						<IconButton
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
				if (date <= now)
					return (
						<IconButton
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
