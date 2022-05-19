import {
	Avatar,
	Box,
	Container,
	Grid,
	GridItem,
	HStack,
	Image,
	Text,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { detailProjectQuery } from 'queries/project'
import { useContext, useEffect } from 'react'
import { projectMutaionResponse } from 'type/mutationResponses'

export interface IOverviewProps {}

export default function Overview(props: IOverviewProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

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

	//query ----------------------------------------------------------------------
	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	return (
		<>
			<Box bgColor={'#f2f4f7'} minHeight={'100vh'} p={10}>
				<Container maxW="container" borderRadius={5} p={5}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
						<GridItem colSpan={[2, 1]} border={'1px solid red'}></GridItem>
						<GridItem colSpan={[2, 1]} p={4} bgColor={'white'} borderRadius={5}>
							<VStack align={'start'}>
								<Text fontSize={20} fontWeight={'semibold'}>
									Client
								</Text>
								{dataDetailProject?.project?.client ? (
									<HStack wrap={'wrap'}>
										<Avatar
											boxSize={'75px'}
											src={dataDetailProject.project.client.avatar?.url}
											name={dataDetailProject.project.client.name}
											borderRadius={5}
										/>
										<VStack align={'start'} justify={'start'}>
											<Text>{dataDetailProject.project.client.name}</Text>
											{dataDetailProject.project.client.company_name ? (
												<>
													<Text color={'gray.400'} fontSize={14}>
														{
															dataDetailProject.project.client
																.company_name
														}
													</Text>
												</>
											) : (
												<Text color={'red'} fontSize={14}>
													None have company
												</Text>
											)}
										</VStack>
									</HStack>
								) : (
									<Text color={'red'}>None have client</Text>
								)}
							</VStack>
						</GridItem>
					</Grid>
				</Container>
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
	const res: projectMutaionResponse = await fetch('http://localhost:4000/api/projects').then(
		(result) => result.json()
	)
	const projects = res.projects

	if (!projects) {
		return { paths: [], fallback: false }
	}

	// Get the paths we want to pre-render based on leave
	const paths = projects.map((project: any) => ({
		params: { projectId: String(project.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}
