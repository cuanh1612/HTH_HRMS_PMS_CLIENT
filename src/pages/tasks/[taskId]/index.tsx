import {
	Avatar,
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	Tooltip,
	useDisclosure,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailTaskQuery } from 'queries'
import { useContext, useEffect } from 'react'
import TaskCategory from 'src/pages/task-categories'
import TaskComments from './comments'
import TaskFiles from './files'

export interface IDetailTaskProps {
	onCloseDrawer?: () => void
	taskIdProp?: string | number
	onOpenDl?: any
	onOpenUpdate?: any
}

export default function DetailTask({
	taskIdProp,
	onOpenDl,
	onOpenUpdate,
}: IDetailTaskProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { taskId: taskIdRouter } = router.query

	//state -------------------------------------------------------------

	//Setup modal -------------------------------------------------------
	const {
		isOpen: isOpenTaskCategory,
		onOpen: onOpenTaskCategory,
		onClose: onCloseTaskCategory,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataDetailTask } = detailTaskQuery(
		isAuthenticated,
		taskIdProp || (taskIdRouter as string)
	)

	//mutation -----------------------------------------------------------

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
		<Box pos="relative" p={6}>
			<Grid templateColumns="repeat(2, 1fr)" gap={6}>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Project:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					{dataDetailTask?.task?.project.name}
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Priority:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					<HStack>
						<Box
							width={3}
							height={3}
							borderRadius={'50%'}
							bgColor={
								dataDetailTask?.task?.priority === 'Hight'
									? 'red'
									: dataDetailTask?.task?.priority === 'Low'
									? 'orange'
									: 'green'
							}
						></Box>
						<Text>{dataDetailTask?.task?.priority}</Text>
					</HStack>
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Assign To:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					<Wrap>
						{dataDetailTask?.task?.employees &&
							dataDetailTask.task.employees.map((employee) => (
								<WrapItem key={employee.id}>
									<Tooltip label={employee.email}>
										<Avatar
											name={employee.name}
											src={employee.avatar?.url}
											size={'xs'}
										/>
									</Tooltip>
								</WrapItem>
							))}
					</Wrap>
				</GridItem>

				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Assign By:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					{dataDetailTask?.task?.assignBy ? (
						<Tooltip label={dataDetailTask.task.assignBy.email}>
							<Avatar
								name={dataDetailTask.task.assignBy.name}
								src={dataDetailTask.task.assignBy.avatar?.url}
								size={'xs'}
							/>
						</Tooltip>
					) : (
						'--'
					)}
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Task Category:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					{dataDetailTask?.task?.task_category?.name || '--'}
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Description:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					<div
						dangerouslySetInnerHTML={{
							__html: dataDetailTask?.task?.description
								? dataDetailTask?.task?.description
								: '',
						}}
					/>
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Start Date:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					{dataDetailTask?.task?.start_date}
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Due Date:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					{dataDetailTask?.task?.deadline}
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
					Hours Logged:
				</GridItem>
				<GridItem w="100%" colSpan={[2, 1]}>
					0 hrs
				</GridItem>
			</Grid>

			<Tabs variant="enclosed" mt={6}>
				<TabList>
					<Tab>Files</Tab>
					<Tab>Comments</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<TaskFiles taskIdProp={taskIdProp || (taskIdRouter as string)} />
					</TabPanel>
					<TabPanel>
						<TaskComments taskIdProp={taskIdProp || (taskIdRouter as string)} />
					</TabPanel>
				</TabPanels>
			</Tabs>

			{/* Modal department and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenTaskCategory}
				onOpen={onOpenTaskCategory}
				onClose={onCloseTaskCategory}
				title="Task Category"
			>
				<TaskCategory />
			</Modal>
			{((onOpenDl && currentUser?.role === 'Admin') ||
				dataDetailTask?.task?.assignBy.id === currentUser?.id) && (
				<>
					<Button onClick={onOpenDl}>delete</Button>
				</>
			)}

			{((onOpenUpdate && currentUser?.role === 'Admin') ||
				dataDetailTask?.task?.assignBy.id === currentUser?.id) && (
				<>
					<Button onClick={onOpenDl}>delete</Button>
				</>
			)}
		</Box>
	)
}
