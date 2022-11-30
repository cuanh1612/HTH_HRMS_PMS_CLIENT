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
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { discussionType, employeeType } from 'type/basicTypes'
import { updateDiscussionForm } from 'type/form/basicFormType'
import moment from 'moment'
import Modal from 'components/modal/Modal'
import { Editor } from './Editor'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IDiscussionProps {
	discussion: discussionType
	currentUser: employeeType
	onDeleteDiscussion: (discussionId: string) => void
	onUpdateDiscussion: ({ content, discussionId, email_author }: updateDiscussionForm) => void
}

export const Discussion = ({
	discussion,
	currentUser,
	onDeleteDiscussion,
	onUpdateDiscussion,
}: IDiscussionProps) => {
	const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
	const [content, setContent] = useState<string>(discussion.content ? discussion.content : '')

	const onChangeContent = (value: string) => {
		setContent(value)
	}

	//Set again content comment when user open or close modal
	useEffect(() => {
		setContent(discussion.content ? discussion.content : '')
	}, [isOpenEdit])

	//Handle update comment
	const handleUpdate = () => {
		onUpdateDiscussion({
			content,
			discussionId: discussion.id,
			email_author: currentUser.email,
		})
	}

	return (
		<HStack
			color={'black'}
			key={discussion.id}
			w={'full'}
			align={'start'}
			justify={'space-between'}
		>
			<HStack spacing={4} align={'start'}>
				<Avatar
					name={discussion.employee?.name || discussion.client?.name}
					src={discussion.client?.avatar?.url || discussion.employee?.avatar?.url}
				/>

				<VStack align={'start'}>
					<HStack>
						<Text fontWeight={'semibold'}>
							{discussion.client?.name || discussion.employee?.name}
						</Text>
						<Text>{moment(discussion.createdAt).fromNow()}</Text>
					</HStack>
					<div dangerouslySetInnerHTML={{ __html: discussion.content }} />
				</VStack>
			</HStack>

			{(discussion.employee?.email === currentUser?.email ||
				discussion.client?.email === currentUser?.email) && (
				<Box>
					<Menu isLazy>
						<MenuButton>
							<BsThreeDotsVertical />
						</MenuButton>
						<MenuList color={'white'}>
							<MenuItem onClick={onOpenEdit}>Edit</MenuItem>
							<MenuItem onClick={() => onDeleteDiscussion(discussion.id.toString())}>
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
					<Editor note={content} onChangeNote={onChangeContent} />
				</Box>
			</Modal>
		</HStack>
	)
}
