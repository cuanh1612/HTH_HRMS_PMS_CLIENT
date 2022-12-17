import {
	Avatar,
	Box,
	Grid,
	GridItem,
	HStack,
	IconButton,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailTimeLogQuery } from 'queries/timeLog'
import { useContext, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { RiPencilLine } from 'react-icons/ri'
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
	const { colorMode } = useColorMode()

	//Query -------------------------------------------------------------
	const { data: detailTimeLog } = detailTimeLogQuery(
		isAuthenticated,
		timeLogIdProp || (timeLogIdRouter as string)
	)

	//User effect ---------------------------------------------------------------
	//Handle check logged in
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
						<Text color={colorMode == 'dark'? 'red.300': 'red.500'}>
							{Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
								useGrouping: false,
							}).format(Number(detailTimeLog?.timeLog?.earnings || 0))}
						</Text>
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
						<HStack spacing={4}>
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
				<HStack spacing={4} paddingTop={6}>
					{currentUser?.role === 'Admin' && onOpenUpdate && (
						<IconButton
							aria-label="Update database"
							icon={<RiPencilLine />}
							onClick={onOpenUpdate}
						/>
					)}{' '}
					{currentUser?.role === 'Admin' && onOpenDl && (
						<IconButton
							aria-label="Delete database"
							icon={<FiTrash2 />}
							onClick={onOpenDl}
						/>
					)}
				</HStack>
			</Box>
		</>
	)
}
