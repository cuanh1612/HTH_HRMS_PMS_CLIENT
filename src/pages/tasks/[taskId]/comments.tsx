import { Avatar, Box, Button, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Loading, TaskCommentItem } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import {
	createTaskCommentMutation,
	deleteTaskCommentMutation,
	updateTaskCommentMutation,
} from 'mutations/taskComment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { detailTaskQuery } from 'queries'
import { allTaskCommentsQuery } from 'queries/taskComment'
import { useContext, useEffect, useState } from 'react'
import { AiOutlinePlusCircle, AiOutlineSend } from 'react-icons/ai'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { updateTaskCommentForm } from 'type/form/basicFormType'


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface ITaskCommentsProps {
	taskIdProp?: string | number
}

export default function TaskComments({ taskIdProp }: ITaskCommentsProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()
	const { taskId: taskIdRouter } = router.query

	//state ---------------------------------------------------------------------
	const [content, setContent] = useState<string>('')
	const [projectId, setProjectId] = useState<string | number>('')

	//Setup disclosure -----------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//Query ----------------------------------------------------------------------
	const { data: dataAllTaskComments, mutate: refetchAllTaskComments } = allTaskCommentsQuery(
		isAuthenticated,
		Number(taskIdProp || taskIdRouter)
	)

	const { data: dataDetailTask } = detailTaskQuery(
		isAuthenticated,
		taskIdProp || (taskIdRouter as string)
	)

	//mutation -------------------------------------------------------------------
	const [mutateCreTaskComment, { status: statusCreTaskComment, data: dataCreTaskComment }] =
		createTaskCommentMutation(setToast)

	const [
		mutateDeleteTaskComment,
		{ status: statusDeleteTaskComment, data: dataDeleteTaskComment },
	] = deleteTaskCommentMutation(setToast)

	const [mutateUpTaskComment, { status: statusUpTaskComment, data: dataUpTaskComment }] =
		updateTaskCommentMutation(setToast)

	//User effect ---------------------------------------------------------------
	//set project id
	useEffect(() => {
		if (dataDetailTask?.task?.project) {
			setProjectId(dataDetailTask.task.project.id)
		}
	}, [dataDetailTask])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && (taskIdProp || taskIdRouter)) {
			socket.emit('joinRoomTaskComment', taskIdProp || taskIdRouter)

			socket.on('getNewTaskComment', () => {
				refetchAllTaskComments()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && (taskIdProp || taskIdRouter)) {
				socket.emit('leaveRoomTaskComment', taskIdProp || taskIdRouter)
			}
		}

		return leaveRoom
	}, [socket, taskIdProp, taskIdRouter])

	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated == false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Note when request success
	useEffect(() => {
		if (statusCreTaskComment === 'success') {
			setToast({
				type: 'success',
				msg: dataCreTaskComment?.message as string,
			})

			setContent('')

			refetchAllTaskComments()

			//Emit to other user join room
			if (socket && (taskIdProp || taskIdRouter)) {
				socket.emit('newTaskComment', taskIdProp || taskIdRouter)
			}
		}
	}, [statusCreTaskComment])

	//Note when request delete success
	useEffect(() => {
		if (statusDeleteTaskComment === 'success') {
			setToast({
				type: 'success',
				msg: dataDeleteTaskComment?.message as string,
			})

			refetchAllTaskComments()

			//Emit to other user join room
			if (socket && (taskIdProp || taskIdRouter)) {
				socket.emit('newTaskComment', taskIdProp || taskIdRouter)
			}
		}
	}, [statusDeleteTaskComment])

	//Note when request update success
	useEffect(() => {
		if (statusUpTaskComment === 'success') {
			setToast({
				type: 'success',
				msg: dataUpTaskComment?.message as string,
			})

			refetchAllTaskComments()

			//Emit to other user join room
			if (socket && (taskIdProp || taskIdRouter)) {
				socket.emit('newTaskComment', taskIdProp || taskIdRouter)
			}
		}
	}, [statusUpTaskComment])

	//function ------------------------------------------------------------------
	const onChangeContent = (value: string) => {
		setContent(value)
	}

	//Handle create task comment
	const onCreTaskComment = () => {
		if (!currentUser) {
			setToast({
				msg: 'Please login first',
				type: 'warning',
			})
		} else {
			if (!content || !projectId) {
				setToast({
					msg: 'Please enter field content',
					type: 'warning',
				})
			} else {
				mutateCreTaskComment({
					project: Number(projectId as string),
					task: Number(taskIdProp || (taskIdRouter as string)),
					content,
				})
			}
		}
	}

	//Handle delete task comment
	const onDeleteTaskComment = (taskCommentId: number | string) => {
		mutateDeleteTaskComment({ taskCommentId })
	}

	//Handle update task comment
	const onUpdateTaskComment = ({ content, taskCommentId }: updateTaskCommentForm) => {
		if (!content) {
			setToast({
				msg: 'Pleser enter field content',
				type: 'warning',
			})
		} else {
			mutateUpTaskComment({
				content,
				taskCommentId,
			})
		}
	}

	return (
		<VStack align={'start'} w="full" bgColor={'white'} p={5} borderRadius={5} spacing={5}>
			<Text fontSize={18} fontWeight={'semibold'}>
				Discussion
			</Text>

			<Box position={'relative'} p={2} w={'full'}>
				{isOpenAdd ? (
					<VStack w={'full'} spacing={5} position={'relative'}>
						<HStack w={'full'} align={'start'}>
							{currentUser && (
								<Avatar name={currentUser.name} src={currentUser.avatar?.url} />
							)}
							<ReactQuill
								style={{
									width: '100%',
								}}
								placeholder="Enter you text"
								modules={{
									toolbar: [
										['bold', 'italic', 'underline', 'strike'], // toggled buttons
										['blockquote', 'code-block'],

										[{ header: 1 }, { header: 2 }], // custom button values
										[{ list: 'ordered' }, { list: 'bullet' }],
										[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
										[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
										[{ direction: 'rtl' }], // text direction

										[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
										[{ header: [1, 2, 3, 4, 5, 6, false] }],

										[{ color: [] }, { background: [] }], // dropdown with defaults from theme
										[{ font: [] }],
										[{ align: [] }],

										['clean'], // remove formatting button
									],
								}}
								value={content}
								onChange={onChangeContent}
							/>
						</HStack>

						<HStack w={'full'} justify={'end'}>
							<Button onClick={onCloseAdd} variant={'ghost'}>
								Cancel
							</Button>
							<Button
								colorScheme={'teal'}
								rightIcon={<AiOutlineSend />}
								onClick={onCreTaskComment}
							>
								Submit
							</Button>
						</HStack>
					</VStack>
				) : (
					<Button
						leftIcon={<AiOutlinePlusCircle />}
						variant="ghost"
						color={'blue.400'}
						_hover={{
							color: 'black',
						}}
						onClick={onOpenAdd}
					>
						Add Comment
					</Button>
				)}

				{statusCreTaskComment === 'running' && <Loading />}
			</Box>

			<VStack
				paddingX={2}
				paddingY={5}
				align={'start'}
				spacing={5}
				position={'relative'}
				w={'full'}
			>
				{dataAllTaskComments?.taskComments &&
					currentUser &&
					dataAllTaskComments.taskComments.map((taskComment) => (
						<TaskCommentItem
							currentUser={currentUser}
							taskComment={taskComment}
							onDeleteTaskComment={onDeleteTaskComment}
							onUpdateTaskComment={onUpdateTaskComment}
						/>
					))}

				{(statusUpTaskComment === 'running' || statusDeleteTaskComment === 'running') && (
					<Loading />
				)}
			</VStack>
		</VStack>
	)
}