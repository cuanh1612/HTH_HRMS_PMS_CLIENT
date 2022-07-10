import {
	Box,
	Button,
	Grid,
	GridItem,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailInterviewQuery } from 'queries/interview'
import { useContext, useEffect } from 'react'
import InterviewFile from './files'

export interface IDetailInterviewProps {
	onCloseDrawer?: any
	interviewId?: string | number | null
	onUpdate?: any
	onDelete?: any
}

export default function DetailInterview({
	onCloseDrawer,
	interviewId: interviewIdProp,
	onUpdate,
	onDelete,
}: IDetailInterviewProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { interviewId: interviewIdRouter } = router.query

	//State -------------------------------------------------------------------

	//Query -------------------------------------------------------------------
	//Get detail job application
	const { data: dataDetailinterview } = detailInterviewQuery(
		isAuthenticated,
		interviewIdProp || (interviewIdRouter as string)
	)

	//mutation ----------------------------------------------------------------

	//Funcion -----------------------------------------------------------------

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
			<Box pos="relative" p={6} h="auto">
				<Grid templateColumns="repeat(4, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Job:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailinterview?.interview?.candidate.jobs.title || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Candidate Name:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailinterview?.interview?.candidate.name || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Candidate Email:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailinterview?.interview?.candidate.email || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Phone:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailinterview?.interview?.candidate.mobile || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Interview Type:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailinterview?.interview?.type || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Start On Date:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{dataDetailinterview?.interview?.date
							? new Date(dataDetailinterview?.interview?.date).toLocaleDateString(
									'es-CL'
							  )
							: '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Start On Time:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{dataDetailinterview?.interview?.start_time || '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Comment:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{dataDetailinterview?.interview?.comment || '--'}
					</GridItem>
				</Grid>

				<Tabs variant="enclosed" mt={6}>
					<TabList>
						<Tab>Files</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<InterviewFile
								interviewIdProp={interviewIdProp || (interviewIdRouter as string)}
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
			{onUpdate && (
				<Button
					onClick={() => {
						onUpdate()
						onCloseDrawer()
					}}
				>
					Update
				</Button>
			)}
			{onDelete && (
				<Button
					onClick={() => {
						onDelete()
					}}
				>
					Delete
				</Button>
			)}
		</>
	)
}
