import {
	Avatar,
	Box,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import Modal from 'components/modal/Modal'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { employeeType, taskCommentType } from 'type/basicTypes'
import { updateTaskCommentForm } from 'type/form/basicFormType'
import { Editor } from './Editor'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface ITaskComment {
	taskComment: taskCommentType
	currentUser: employeeType
	onDeleteTaskComment: (taskCommentId: number | string) => void
	onUpdateTaskComment: ({ content, taskCommentId }: updateTaskCommentForm) => void
}

export const TaskCommentItem = ({
	taskComment,
	currentUser,
	onDeleteTaskComment,
	onUpdateTaskComment,
}: ITaskComment)=> {
	const {colorMode} = useColorMode()
	const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
	const [content, setContent] = useState<string>(taskComment.content ? taskComment.content : '')

	const onChangeContent = (value: string) => {
		setContent(value)
	}

	//Set again content comment when user open or close modal
	useEffect(() => {
		setContent(taskComment.content ? taskComment.content : '')
	}, [isOpenEdit])

	//Handle update comment
	const handleUpdate = () => {
		onUpdateTaskComment({
			content,
			taskCommentId: taskComment.id,
		})
	}

	return (
		<HStack color={'black'} key={taskComment.id} w={'full'} align={'start'} justify={'space-between'}>
			<HStack spacing={4} align={'start'}>
				<Avatar name={taskComment.employee?.name} src={taskComment.employee?.avatar?.url} />
				<VStack align={'start'}>
					<HStack>
						<Text fontWeight={'semibold'}>
							{taskComment.employee?.name}
						</Text>
						<Text>{moment(taskComment.createdAt).fromNow()}</Text>
					</HStack>
					<div dangerouslySetInnerHTML={{ __html: taskComment.content }} />
				</VStack>
			</HStack>

			{(taskComment.employee?.email === currentUser?.email) && (
				<Box>
					<Menu isLazy>
						<MenuButton>
							<BsThreeDotsVertical />
						</MenuButton>
						<MenuList color={colorMode != 'dark' ? 'black': 'white'}>
							<MenuItem onClick={onOpenEdit}>Edit</MenuItem>
							<MenuItem onClick={() => onDeleteTaskComment(taskComment.id)}>
								Delete
							</MenuItem>
						</MenuList>
					</Menu>
				</Box>
			)}

			<Modal
				isOpen={isOpenEdit}
				onOpen={onOpenEdit}
				onClose={onCloseEdit}
				size={'4xl'}
				title={'Edit comment'}
				onOk={handleUpdate}
			>
				<Box p={6}>
					<Editor note={content} onChangeNote={onChangeContent}/>
				</Box>
			</Modal>
		</HStack>
	)
}
