import { Avatar, Badge, Box, Button, Grid, GridItem, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { detailLeaveQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { GrDocumentUpdate } from 'react-icons/gr'
import { leaveMutationResponse } from 'type/mutationResponses'

export interface IDetailLeaveProps {
	leaveId: string | number | null
	onOpenUpdate?: any
	onOpenDl?: any
}

export default function DetailLeave({
	leaveId: leaveIdProp,
	onOpenUpdate,
	onOpenDl,
}: IDetailLeaveProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { leaveId: leaveIdRouter } = router.query

	//Query ---------------------------------------------------------------------
	const { data: dataDetailLeave, error: errorDetailLeave } = detailLeaveQuery(
		(leaveIdRouter as string) || leaveIdProp
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

	//Handle error detail
	useEffect(() => {
		errorDetailLeave && router.push('/leaves')
	}, [errorDetailLeave])

	return (
		<>
			<VStack p={6} align={'start'}>
				<Grid templateColumns="repeat(6, 1fr)" gap={6} w={'full'}>
					<GridItem w="100%" color={'gray.400'} colSpan={[6, 2]}>
						Applicant Name
					</GridItem>

					<GridItem w="100%" colSpan={[6, 4]}>
						<HStack>
							<Avatar
								name={dataDetailLeave?.leave?.employee.name}
								src={dataDetailLeave?.leave?.employee.avatar?.url}
							/>
							<VStack align={'start'}>
								<Text fontWeight={'semibold'}>
									{dataDetailLeave?.leave?.employee.name}
								</Text>
								<Text fontSize={14} color={'gray.400'}>
									{dataDetailLeave?.leave?.employee.role}
								</Text>
							</VStack>
						</HStack>
					</GridItem>

					<GridItem w="100%" color={'gray.400'} colSpan={[6, 2]}>
						Date
					</GridItem>

					<GridItem w="100%" colSpan={[6, 4]}>
						{dataDetailLeave?.leave?.date}
					</GridItem>

					<GridItem w="100%" color={'gray.400'} colSpan={[6, 2]}>
						Leave Type
					</GridItem>

					<GridItem w="100%" colSpan={[6, 4]}>
						<Badge colorScheme={dataDetailLeave?.leave?.leave_type.color_code}>
							{dataDetailLeave?.leave?.leave_type.name}
						</Badge>
					</GridItem>

					<GridItem w="100%" color={'gray.400'} colSpan={[6, 2]}>
						Reason For Absence
					</GridItem>

					<GridItem w="100%" colSpan={[6, 4]}>
						{dataDetailLeave?.leave?.reason}
					</GridItem>

					<GridItem w="100%" color={'gray.400'} colSpan={[6, 2]}>
						Status
					</GridItem>

					<GridItem w="100%" colSpan={[6, 4]}>
						<HStack align={'center'}>
							<Box
								borderRadius={'50%'}
								w={'10px'}
								height={'10px'}
								bgColor={
									dataDetailLeave?.leave?.status === 'Pending'
										? 'yellow'
										: dataDetailLeave?.leave?.status === 'Approved'
										? 'green'
										: dataDetailLeave?.leave?.status === 'Rejected'
										? 'red'
										: undefined
								}
							></Box>
							<Text>{dataDetailLeave?.leave?.status}</Text>
						</HStack>
					</GridItem>
				</Grid>
				<HStack paddingTop={6}>
					{onOpenUpdate && currentUser?.role == 'Admin' && (
						<IconButton aria-label='Update database' icon={<GrDocumentUpdate />} onClick={onOpenUpdate}/>
					)}{' '}
					{onOpenDl && dataDetailLeave?.leave?.status == 'Pending' && (
						<IconButton color={'tomato'} aria-label='Delete database' icon={<AiFillDelete />} onClick={onOpenDl}/>
					)}
				</HStack>
			</VStack>
		</>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
		revalidate: 10,
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res: leaveMutationResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/leaves`
	).then((result) => result.json())

	if (!res || !res.leaves) {
		return { paths: [], fallback: false }
	}

	const leaves = res.leaves

	// Get the paths we want to pre-render based on leave
	const paths = leaves.map((leave: any) => ({
		params: { leaveId: String(leave.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}
