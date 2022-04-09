import { Box, Button } from '@chakra-ui/react'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'

export interface IAddHolidayProps {
	onCloseDrawer?: () => void
}

export default function AddHoliday({ onCloseDrawer }: IAddHolidayProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [Holidays, setHolidays] = useState<{ date: Date | undefined; occasion: string }[]>([
		{
			date: undefined,
			occasion: '',
		},
	])

	//Function ------------------------------------------------------------------
	const onAddHoliday = () => {
		setHolidays([
			...Holidays,
			{
				date: undefined,
				occasion: '',
			},
		])
	}

	const onDeleteHoliday = (index: number) => {
		const newHolidays = Holidays
		newHolidays.splice(index, 1)
		setHolidays([...newHolidays])
        console.log(Holidays);
        
	}

	//User effect ---------------------------------------------------------------

	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	return (
		<Box pos="relative" p={6} h="auto">
			{Holidays.map((holiday, index) => (
				<Box key={uuidv4()}>
					<Box>{index}</Box>
					<Button onClick={() => onDeleteHoliday(index)}>x</Button>
				</Box>
			))}

			<Button onClick={onAddHoliday}>add</Button>

			<Button
				color={'white'}
				bg={'hu-Green.normal'}
				transform="auto"
				_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
				_active={{
					bg: 'hu-Green.normalA',
					scale: 1,
				}}
				leftIcon={<AiOutlineCheck />}
				mt={6}
				type="submit"
			>
				Save
			</Button>

			{/* {statusLeave === 'running' && <Loading />} */}
		</Box>
	)
}
