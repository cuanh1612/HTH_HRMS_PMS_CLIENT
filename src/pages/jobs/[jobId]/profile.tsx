import { Avatar, Box, Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { JobLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { detailJobQuery } from 'queries/job'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { NextLayout } from 'type/element/layout'

export interface IDetailJobProps {
	jobIdProp: string | number | null
	onOpenDl?: any
	onOpenUpdate?: any
}

const DetailJob: NextLayout | any = ({ jobIdProp, onOpenDl, onOpenUpdate }: IDetailJobProps) => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: detailJob } = detailJobQuery(jobIdProp || (jobIdRouter as string))

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
		<Box pb={8}>
			<Head>
				<title>Huprom - Job profile</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Box pos="relative" p={6}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={2}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={2}>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Department:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.department?.name
									? detailJob?.job?.department?.name
									: '--'}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Total Openings:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.total_openings
									? detailJob?.job?.total_openings
									: '--'}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Start Date:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.starts_on_date
									? detailJob?.job?.starts_on_date
									: '--'}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								End Date:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.ends_on_date
									? new Date(detailJob?.job?.ends_on_date).toLocaleDateString(
											'en-GB'
									  )
									: '--'}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Status:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.status ? (
									<>
										<HStack>
											<Box
												width={5}
												height={5}
												bgColor={'green'}
												borderRadius={'100%'}
											></Box>
											<Text>Open</Text>
										</HStack>
									</>
								) : (
									<>
										<HStack>
											<Box
												width={5}
												height={5}
												bgColor={'red'}
												borderRadius={'100%'}
											></Box>
											<Text>Close</Text>
										</HStack>
									</>
								)}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Job Type:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.job_type ? detailJob?.job?.job_type.name : '--'}
							</GridItem>
						</Grid>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={2}>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Recruiter:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								<HStack spacing={5} justify={'start'}>
									<Avatar
										size="md"
										name={detailJob?.job?.recruiter.name}
										src={detailJob?.job?.recruiter?.avatar?.url}
									/>
									<VStack align={'start'}>
										<Text fontWeight={'semibold'}>
											{detailJob?.job?.recruiter.name}
										</Text>
										<Text fontSize={'14px'} color={'gray'}>
											{detailJob?.job?.recruiter.department?.name || '--'}
										</Text>
									</VStack>
								</HStack>
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Work Experience:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.work_experience.name}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Starting Salary Amount:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.starting_salary_amount}
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
								Rate:
							</GridItem>
							<GridItem w="100%" colSpan={[2, 1]}>
								{detailJob?.job?.rate}
							</GridItem>
						</Grid>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Grid templateColumns="repeat(4, 1fr)" gap={6} mt={2}>
							<GridItem w="100%" colSpan={[1]} color={'gray.400'}>
								Description:
							</GridItem>
							<GridItem w="100%" colSpan={[4, 3]}>
								<div
									dangerouslySetInnerHTML={{
										__html: detailJob?.job?.job_description
											? detailJob?.job?.job_description
											: '',
									}}
								/>
							</GridItem>
						</Grid>
					</GridItem>
				</Grid>

				{currentUser?.role === 'Admin' && onOpenDl && (
					<Button onClick={onOpenDl}>delete</Button>
				)}

				{currentUser?.role === 'Admin' && onOpenUpdate && (
					<Button onClick={onOpenUpdate}>update</Button>
				)}
			</Box>
		</Box>
	)
}

DetailJob.getLayout = JobLayout

export default DetailJob
