import {
	Avatar,
	Box,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack,
} from '@chakra-ui/react'
import { AiOutlineComment } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import { projectDiscussionRoomType } from 'type/basicTypes'
import { ProjectDiscussionRoomMutationResponse } from 'type/mutationResponses'
import moment from 'moment'

export interface IProjectDiscussionItemProps {
	discussionRoom: projectDiscussionRoomType
	onClick: (discussionRoomId: number) => void
	onDelete: (input: {
		ProjectDiscussionRoomId: number
	}) => Promise<ProjectDiscussionRoomMutationResponse | undefined>
	isOnChange?: boolean
}

export default function ProjectDiscussionItem({
	discussionRoom,
	onClick,
	onDelete,
	isOnChange = true,
}: IProjectDiscussionItemProps) {
	return (
		<HStack
			w={'100%'}
			border={'1px'}
			borderColor={'gray.300'}
			p={4}
			borderRadius={5}
			justify={'space-between'}
		>
			<HStack spacing={5}>
				<Avatar
					size="md"
					borderRadius={'10%'}
					name={discussionRoom?.assigner.name}
					src={discussionRoom?.assigner.avatar?.url}
				/>
				<VStack align={'start'}>
					<Text
						fontWeight={'semibold'}
						cursor={'pointer'}
						onClick={() => onClick(discussionRoom.id)}
					>
						{discussionRoom.title}
					</Text>
					<Text fontSize={12}>{discussionRoom.assigner.name}</Text>
					<Text fontSize={12} color={'gray.400'}>
						posted on {moment(discussionRoom.createdAt).fromNow()}
					</Text>
				</VStack>
			</HStack>

			<VStack align={'end'}>
				<HStack>
					<Box w={3} h={3} borderRadius={'50%'} bgColor={'red'}></Box>
					<Text>{discussionRoom.project_discussion_category.name}</Text>
				</HStack>
				<HStack>
					<AiOutlineComment />
					<Text>{discussionRoom.project_discussion_replies.length || 0}</Text>
				</HStack>

				{isOnChange && (
					<Menu isLazy>
						<MenuButton>
							<BsThreeDots />
						</MenuButton>
						<MenuList>
							<MenuItem
								onClick={() =>
									onDelete({ ProjectDiscussionRoomId: discussionRoom.id })
								}
							>
								Delete
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</VStack>
		</HStack>
	)
}
