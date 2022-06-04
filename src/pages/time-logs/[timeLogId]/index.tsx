import { Avatar, Box, Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailTimeLogQuery } from 'queries/timeLog'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

export interface IDetailTimeLogProps {
	timeLogIdProp?: string | number
	onOpenDl?: any
	onOpenUpdate?: any
}

export default function DetailTimeLog({
	timeLogIdProp,
	onOpenDl,
	onOpenUpdate,
}: IDetailTimeLogProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { timeLogId: timeLogIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: detailTimeLog } = detailTimeLogQuery(
		isAuthenticated,
		timeLogIdProp || (timeLogIdRouter as string)
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
			<Box pos="relative" p={6}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Start Time:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.starts_on_date}{' '}
						{detailTimeLog?.timeLog?.starts_on_time}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						End Time:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.ends_on_date}{' '}
						{detailTimeLog?.timeLog?.ends_on_time}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Total Hours:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.total_hours || '0'} hrs
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Earnings:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
							useGrouping: false,
						}).format(Number(detailTimeLog?.timeLog?.earnings || 0))}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Memo:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.memo}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Project:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.project.name}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Task:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailTimeLog?.timeLog?.task?.name}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Employee:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<Avatar
								size={'sm'}
								src={detailTimeLog?.timeLog?.employee?.avatar?.url}
								name={detailTimeLog?.timeLog?.employee?.name}
							/>
							<VStack align={'start'}>
								<Text>{detailTimeLog?.timeLog?.employee?.name}</Text>
								<Text fontSize={14} color={'gray.400'}>
									{detailTimeLog?.timeLog?.employee?.designation?.name ||
										detailTimeLog?.timeLog?.employee?.email}
								</Text>
							</VStack>
						</HStack>
					</GridItem>
				</Grid>
				{currentUser?.role === 'Admin' && onOpenDl && (
					<Button onClick={onOpenDl}>delete</Button>
				)}

				{currentUser?.role === 'Admin' && onOpenUpdate && (
					<Button onClick={onOpenUpdate}>update</Button>
				)}
			</Box>
		</>
	)
}
