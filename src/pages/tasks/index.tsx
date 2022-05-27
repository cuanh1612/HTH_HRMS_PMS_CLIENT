import { Drawer } from 'components/Drawer'
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import AddTask from './add-tasks'
import DetailTask from './[taskId]'
import UpdateTask from './[taskId]/update-task'
import { useRouter } from 'next/router'
import { AuthContext } from 'contexts/AuthContext'

const tasks: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	const [taskId, setTaskId] = useState<string | number>(9)
	const [statusIdShow, setStatusIdShow] = useState<number>(1)

	//Modal -------------------------------------------------------------
	// set open add task
	const {
		isOpen: isOpenAddTask,
		onOpen: onOpenAddTask,
		onClose: onCloseAddTask,
	} = useDisclosure()

	// set open update task
	const {
		isOpen: isOpenUpdateTask,
		onOpen: onOpenUpdateTask,
		onClose: onCloseUpdateTask,
	} = useDisclosure()

	// set open detail task
	const {
		isOpen: isOpenDetailTask,
		onOpen: onOpenDetailTask,
		onClose: onCloseDetailTask,
	} = useDisclosure()

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
		<Box>
			<Button onClick={onOpenAddTask}>Add task Incomplete</Button>
			<Button onClick={onOpenUpdateTask}>Update Task</Button>
			<Button onClick={onOpenDetailTask}>Detail Task</Button>

			<Drawer size="xl" title="Add New Task" onClose={onCloseAddTask} isOpen={isOpenAddTask}>
				<AddTask onCloseDrawer={onCloseAddTask} />
			</Drawer>

			<Drawer
				size="xl"
				title="Update Task"
				onClose={onCloseUpdateTask}
				isOpen={isOpenUpdateTask}
			>
				<UpdateTask taskIdProp={taskId} onCloseDrawer={onCloseUpdateTask} />
			</Drawer>

			<Drawer
				size="xl"
				title={`Task #${taskId}`}
				onClose={onCloseDetailTask}
				isOpen={isOpenDetailTask}
			>
				<DetailTask taskIdProp={taskId} onCloseDrawer={onCloseDetailTask} />
			</Drawer>
		</Box>
	)
}

tasks.getLayout = ClientLayout

export default tasks
