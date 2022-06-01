import { Box, Button, Divider, Grid, GridItem, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { deleteHolidayMutation } from 'mutations'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { detailHolidayQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { holidayMutaionResponse } from 'type/mutationResponses'
import UpdateHoliday from './update-holidays'

export interface IDetailHolidayProps {
	onCloseDrawer?: () => void
	holidayIdProp: number | null
}
var isUseLayout = false
export default function DetailHoliday({ onCloseDrawer, holidayIdProp }: IDetailHolidayProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { holidayId: holidayIdRouter } = router.query

	useEffect(() => {
		isUseLayout = true
	}, [holidayIdRouter])

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate } = useDisclosure()

	//Query ---------------------------------------------------------------------
	const { data: dataDetailHoliday } = detailHolidayQuery(
		holidayIdProp || (holidayIdRouter as string)
	)

	//mutation ------------------------------------------------------------------
	const [mutateDelHolidays, { status: statusDelHolidays, data: dataDelHolidays }] =
		deleteHolidayMutation(setToast)

	//Function ------------------------------------------------------------------
	//handle open update drawer
	const handleOpenUpdate = () => {
		if (onCloseDrawer) {
			onCloseDrawer()
		}

		onOpenUpdate()
	}

	//handle delete holiday
	const onDeleteHoliday = () => {
		if (!holidayIdProp && !holidayIdRouter) {
			setToast({
				msg: 'Not found holiday to delete',
				type: 'warning',
			})
		}
		mutateDelHolidays(holidayIdProp || (holidayIdRouter as string))
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
		if (statusDelHolidays === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			} else {
				//If not use drawer will redirect to /holidays route
				router.push('/holidays')
			}

			setToast({
				type: 'success',
				msg: dataDelHolidays?.message as string,
			})
		}
	}, [statusDelHolidays])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto">
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<GridItem w="100%" colSpan={2}>
								<HStack w={'full'} justify={'space-between'}>
									<Text fontSize={16} fontWeight={'semibold'}>
										Holiday Details
									</Text>
									<HStack>
										<Button
											colorScheme="teal"
											variant="ghost"
											onClick={onOpenUpdate}
										>
											Edit
										</Button>
										<Button
											colorScheme="teal"
											variant="ghost"
											onClick={onDeleteHoliday}
										>
											Delete
										</Button>
									</HStack>
								</HStack>
							</GridItem>
							<GridItem w="100%" colSpan={2}>
								<Divider />
							</GridItem>
						</>
					)}
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'} fontWeight={'normal'}>
						Date:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{dataDetailHoliday?.holiday?.holiday_date}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'} fontWeight={'normal'}>
						Occasion:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{dataDetailHoliday?.holiday?.occasion}
					</GridItem>
				</Grid>

				{statusDelHolidays === 'running' && <Loading />}
			</Box>

			<Drawer
				size="xl"
				title="Update Holiday"
				onClose={handleOpenUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateHoliday
					onCloseDrawer={onOpenUpdate}
					holidayId={holidayIdProp || (holidayIdRouter as string)}
				/>
			</Drawer>
		</>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res: holidayMutaionResponse = await fetch('http://localhost:4000/api/holidays').then(
		(result) => result.json()
	)
	const holidays = res.holidays

	if (!holidays) {
		return { paths: [], fallback: false }
	}

	// Get the paths we want to pre-render based on leave
	const paths = holidays.map((holiday) => ({
		params: { holidayId: String(holiday.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}

if (isUseLayout) {
}
