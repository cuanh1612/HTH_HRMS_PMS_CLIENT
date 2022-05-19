import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { AiOutlineComment } from "react-icons/ai";
import { projectDiscussionRoomType } from "type/basicTypes";

export interface IProjectDiscussionItemProps {
    discussionRoom: projectDiscussionRoomType
    onClick: (discussionRoomId: number) => void
}

export default function ProjectDiscussionItem({discussionRoom, onClick}: IProjectDiscussionItemProps) {
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
						posted on {discussionRoom.createdAt}
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
			</VStack>
		</HStack>
	)
}
