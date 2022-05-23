import {
	Avatar,
	Box,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { employeeType, taskCommentType } from 'type/basicTypes'
import { updateTaskCommentForm } from 'type/form/basicFormType'
import Modal from './modal/Modal'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IDiscussionProps {
	taskComment: taskCommentType
	currentUser: employeeType
	onDeleteTaskComment: (taskCommentId: number | string) => void
	onUpdateTaskComment: ({ content, taskCommentId }: updateTaskCommentForm) => void
}

export default function TaskCommentItem({
	taskComment,
	currentUser,
	onDeleteTaskComment,
	onUpdateTaskComment,
}: IDiscussionProps) {
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
		<HStack key={taskComment.id} w={'full'} align={'start'} justify={'space-between'}>
			<HStack align={'start'}>
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
						<MenuList>
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
				</Box>
			</Modal>
		</HStack>
	)
}
