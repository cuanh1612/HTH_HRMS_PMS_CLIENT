import {
	Avatar,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Select,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Drawer } from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { updateStatusProjectMutation } from 'mutations'
import { useRouter } from 'next/router'
import { detailProjectQuery } from 'queries'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { updateStatusProjectForm } from 'type/form/basicFormType'
import { dataProjectStatus } from 'utils/basicData'
import { updateStatusProjectValidate } from 'utils/validate'
import UpdateProject from '../update-projects'
import { NextLayout } from 'type/element/layout'
import { ProjectLayout } from 'components/layouts'

const Overview: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query

	//query ----------------------------------------------------------------------
	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//mutation -------------------------------------------------------------------
	const [
		mutateUpdateStatusProject,
		{ status: statusUpdateStatusProject, data: dataUpdateStatusProject },
	] = updateStatusProjectMutation(setToast)

	// setForm and submit form change status project -------------------------------
	const formSetting = useForm<updateStatusProjectForm>({
		defaultValues: {
			project_status: undefined,
		},
		resolver: yupResolver(updateStatusProjectValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateStatusProjectForm) => {
		if (!projectId) {
			setToast({
				msg: 'Not found project to udate status',
				type: 'error',
			})
		} else {
			values.project = projectId as string
			mutateUpdateStatusProject({
				inputUpdate: values,
				projectId: values.project,
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
		if (statusUpdateStatusProject === 'success') {
			setToast({
				type: 'success',
				msg: dataUpdateStatusProject?.message as string,
			})
		}
	}, [statusUpdateStatusProject])

	return (
		<>
			<Box p={10} bgColor={'#f2f4f7'} minHeight={'100vh'}>
				<VStack
					align={'start'}
					w="full"
					bgColor={'white'}
					p={5}
					borderRadius={5}
					spacing={5}
				>
					<VStack position={'relative'} p={2} w={'full'} align={'start'} spacing={5}>
						<HStack w={'full'} justify={'end'}>
							<Button colorScheme="teal" variant="outline" onClick={onOpenUpdate}>
								Edit Project
							</Button>
							<Box w={200}>
								<Select placeholder="Select option">
									{dataProjectStatus.map((option) => (
										<option value={option.value}>{option.label}</option>
									))}
								</Select>
							</Box>
						</HStack>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
							<GridItem
								colSpan={[2, 1]}
								border={'1px solid'}
								borderColor={'gray.400'}
								borderRadius={5}
								p={6}
							>
								<VStack align={'start'} w={'full'} justify={'space-between'}>
									<Text fontWeight={'bold'}>Project Progress</Text>
									<HStack justify={'space-between'} wrap={'wrap'} w={'full'}>
										<VStack align={'start'}>
											<Text color={'gray.400'}>Start Date</Text>
											<Text>{dataDetailProject?.project?.start_date}</Text>
										</VStack>

										<VStack align={'start'}>
											<Text color={'gray.400'}>Deadline</Text>
											<Text>{dataDetailProject?.project?.deadline}</Text>
										</VStack>
									</HStack>
								</VStack>
							</GridItem>

							<GridItem
								colSpan={[2, 1]}
								border={'1px solid'}
								borderColor={'gray.400'}
								borderRadius={5}
								p={6}
							>
								<VStack align={'start'} w={'full'} justify={'space-between'}>
									<Text fontWeight={'bold'}>Client</Text>
									<HStack wrap={'wrap'} w={'full'}>
										<Avatar
											name={dataDetailProject?.project?.client?.name}
											src={dataDetailProject?.project?.client?.avatar?.url}
											borderRadius={5}
											size={'lg'}
										/>
										<VStack align={'start'}>
											<Text>{dataDetailProject?.project?.client?.name}</Text>
											<Text color={'gray.400'}>
												{dataDetailProject?.project?.client?.email}
											</Text>
										</VStack>
									</HStack>
								</VStack>
							</GridItem>

							<GridItem
								colSpan={[2, 1]}
								border={'1px solid'}
								borderColor={'gray.400'}
								borderRadius={5}
								p={6}
							>
								<VStack align={'start'} w={'full'} justify={'space-between'}>
									<Text fontWeight={'bold'}>Tasks</Text>
								</VStack>
							</GridItem>
							<GridItem
								colSpan={[2, 1]}
								border={'1px solid'}
								borderColor={'gray.400'}
								borderRadius={5}
								p={6}
							>
								huy
							</GridItem>
							<GridItem
								colSpan={[2]}
								border={'1px solid'}
								borderColor={'gray.400'}
								borderRadius={5}
								p={6}
							>
								huy
							</GridItem>
						</Grid>
					</VStack>
				</VStack>
			</Box>

			<Drawer size="xl" title="Update Project" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateProject
					onCloseDrawer={onCloseUpdate}
					projectIdUpdate={Number(projectId as string)}
				/>
			</Drawer>
		</>
	)
}

Overview.getLayout = ProjectLayout

export default Overview
