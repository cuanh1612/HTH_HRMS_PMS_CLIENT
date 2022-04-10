import { Box, Button, Grid, GridItem } from '@chakra-ui/react'
import { Input } from 'components/form/Input'
import Loading from 'components/Loading'
import { AuthContext } from 'contexts/AuthContext'
import { updateHolidayMutation } from 'mutations/holiday'
import { useRouter } from 'next/router'
import { detailHolidayQuery } from 'queries/holiday'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineHolidayVillage } from 'react-icons/md'
import { updateHolidayForm } from 'type/form/basicFormType'

export interface IUpdateHolidayProps {
	onCloseDrawer?: () => void
	holidayId: number | null
}

export default function UpdateHoliday({ onCloseDrawer, holidayId }: IUpdateHolidayProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Query ---------------------------------------------------------------------
	const { data: dataDetailHoliday, error: errorDetailHoliday } = detailHolidayQuery(holidayId)

	//mutation ------------------------------------------------------------------
	const [mutateUpHoliday, { status: statusUpHoliday, data: dataUpHoliday }] =
		updateHolidayMutation(setToast)

	// setForm and submit form update holiday -----------------------------------
	const formSetting = useForm<updateHolidayForm>({
		defaultValues: {
			holiday_date: undefined,
			occasion: '',
		},
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: updateHolidayForm) => {
		if (!holidayId) {
			setToast({
				type: 'error',
				msg: 'Not found holiday to update',
			})
		} else {
			mutateUpHoliday({
				inputUpdate: values,
				holidayId,
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

	//Setting form when have data detail leave
	useEffect(() => {
		if (dataDetailHoliday?.holiday) {
			//Set data form
			formSetting.reset({
				holiday_date: dataDetailHoliday.holiday.holiday_date.toString() || undefined,
				occasion: dataDetailHoliday.holiday.occasion || '',
			})
		}
	}, [dataDetailHoliday])

	//Note when request success
	useEffect(() => {
		if (statusUpHoliday === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataUpHoliday?.message as string,
			})
		}
	}, [statusUpHoliday])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="holiday_date"
							label="Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select Date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="occasion"
							label="Occasion"
							icon={
								<MdOutlineHolidayVillage
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter Occasion"
							type="text"
							required
						/>
					</GridItem>
				</Grid>

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

				{statusUpHoliday === 'running' && <Loading />}
			</Box>
		</>
	)
}
