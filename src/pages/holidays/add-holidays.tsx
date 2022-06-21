import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	VStack,
} from '@chakra-ui/react'
import {ButtonIcon, Loading} from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createHolidaysMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allHolidaysQuery } from 'queries'
import { FormEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { createHolidayForm } from 'type/form/basicFormType'
import { v4 as uuidv4 } from 'uuid'

export interface IAddHolidayProps {
	onCloseDrawer?: () => void
}

export default function AddHoliday({ onCloseDrawer }: IAddHolidayProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [holidays, setHolidays] = useState<createHolidayForm[]>([
		{
			holiday_date: undefined,
			occasion: '',
		},
	])

	// get all holidays
	const { mutate: refetchAllHolidays } = allHolidaysQuery({})

	//mutation ------------------------------------------------------------------
	const [mutateCreHolidays, { status: statusCreHolidays, data: dataCreHolidays }] =
		createHolidaysMutation(setToast)

	//Function ------------------------------------------------------------------
	const onAddHoliday = () => {
		setHolidays([
			...holidays,
			{
				holiday_date: undefined,
				occasion: '',
			},
		])
	}

	const onDeleteHoliday = (index: number) => {
		const newHolidays = holidays
		newHolidays.splice(index, 1)
		setHolidays([...newHolidays])
	}

	//Handle change date occation
	const onChangeDate = (date: string, index: number) => {
		let newHolidays = holidays
		newHolidays[index].holiday_date = date
		setHolidays(newHolidays)
	}

	//Handle change occation
	const onChangeOccasion = (occasion: string, index: number) => {
		let newHolidays = holidays
		newHolidays[index].occasion = occasion
		setHolidays(newHolidays)
	}

	//Handle submit create holiday
	const onSubmitCreate: FormEventHandler<HTMLDivElement> & FormEventHandler<HTMLFormElement> = (
		event
	) => {
		event.preventDefault()

		if (holidays.length !== 0) {
			console.log(holidays)

			mutateCreHolidays({
				holidays,
			})
		}
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

	//Note when request success
	useEffect(() => {
		if (statusCreHolidays === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreHolidays?.message as string,
			})

			refetchAllHolidays()
		}
	}, [statusCreHolidays])

	return (
		<Box pos="relative" p={6} h="auto" as={'form'} onSubmit={onSubmitCreate}>
			<VStack pos="relative" align={'start'} spacing={4}>
				{holidays.map((holiday, index) => (
					<Grid w={'full'} key={uuidv4()} templateColumns="repeat(7, 1fr)" gap={7}>
						<GridItem w="100%" colSpan={[7, 3]}>
							<FormControl isRequired>
								<FormLabel fontWeight={'normal'}>Date</FormLabel>
								<Input
									required
									type="date"
									defaultValue={holiday.holiday_date}
									onChange={(e: any) => onChangeDate(e.target.value, index)}
								/>
							</FormControl>
						</GridItem>

						<GridItem w="100%" colSpan={[5, 3]}>
							<FormControl isRequired>
								<FormLabel fontWeight={'normal'}>Occasion</FormLabel>
								<Input
									required
									type="text"
									defaultValue={holiday.occasion}
									placeholder={'Occasion'}
									onChange={(e: any) => onChangeOccasion(e.target.value, index)}
								/>
							</FormControl>
						</GridItem>

						{index !== 0 && (
							<GridItem w="100%" colSpan={[2, 1]}>
								<HStack h="full" align={'end'}>
									<ButtonIcon
										ariaLabel="button-delete"
										handle={() => onDeleteHoliday(index)}
										icon={<MdDeleteOutline />}
									/>
								</HStack>
							</GridItem>
						)}
					</Grid>
				))}
			</VStack>

			<Button onClick={onAddHoliday} marginY={6}>
				add
			</Button>

			<Divider />

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

			{statusCreHolidays === 'running' && <Loading />}
		</Box>
	)
}
