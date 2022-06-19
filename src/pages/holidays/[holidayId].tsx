import { Box, Button, Grid, GridItem } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { detailHolidayQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { holidayMutaionResponse } from 'type/mutationResponses'

export interface IDetailHolidayProps {
	holidayIdProp: number | null
	onOpenUpdate?: any
	onOpenDl?: any
}
var isUseLayout = false
export default function DetailHoliday({ holidayIdProp, onOpenUpdate, onOpenDl}: IDetailHolidayProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { holidayId: holidayIdRouter } = router.query

	useEffect(() => {
		isUseLayout = true
	}, [holidayIdRouter])

	//Query ---------------------------------------------------------------------
	const { data: dataDetailHoliday } = detailHolidayQuery(
		holidayIdProp || (holidayIdRouter as string)
	)

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
		<>
			<Box pos="relative" p={6} as={'form'} h="auto">
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
				{
					onOpenUpdate && <Button onClick={onOpenUpdate}>Update</Button>
				}
								{
					onOpenDl && <Button onClick={onOpenDl}>delete</Button>
				}
			</Box>
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
	const res: holidayMutaionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/holidays`).then(
		(result) => result.json()
	)

	if (!res || !res.holidays) {
		return { paths: [], fallback: false }
	}

	const holidays = res.holidays


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
