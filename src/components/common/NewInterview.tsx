import { Avatar, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { interviewType } from 'type/basicTypes'

export const NewInterview = ({ interview, handle }: { interview: interviewType; handle: any }) => {
	return (
		<HStack
			borderRadius={'10px'}
			bg={'gray.100'}
			p={4}
			w={'full'}
			alignItems={'flex-start'}
			spacing={4}
		>
			<Avatar
				size={'sm'}
				src={`${interview.candidate.picture?.url || '/'}`}
				name={interview.candidate.name}
			/>
			<VStack overflow={'hidden'} w={'full'} alignItems={'flex-start'} spacing={3}>
				<Text
					onClick={handle}
					_hover={{
						textDecoration: 'underline',
						cursor: 'pointer',
					}}
					isTruncated
					fontWeight={'semibold'}
				>
					{interview.candidate.name}
				</Text>
				<Text fontSize={'14px'} color={'gray'}>
					{`${new Date(interview.date).toLocaleDateString('es-CL')}, ${
						interview.start_time
					}`}
				</Text>
				<Text>{interview.candidate.jobs.title}</Text>
			</VStack>
		</HStack>
	)
}
