import { Box, HStack, IconButton, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { MdOutlineMoreVert } from 'react-icons/md'
import Task from './Task'

interface Column {
	id: string | number
	title: string
	task: Array<{
		id: string
		title: any
	}>
}

export default function Column({ column, index }: { column: Column; index: number }) {
	const { colorMode } = useColorMode()
	return (
		<Draggable draggableId={`${column.id}`} index={index}>
			{(provided, snapShot) => (
				<Box
					marginRight={10}
					bg={colorMode == 'dark' ? '#3a4f781f' : 'white'}
					borderRadius={10}
					w={350}
					minW={350}
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<Box padding={4}>
						<HStack
							borderBottom={'1px solid gray'}
							justifyContent={'space-between'}
							paddingBottom={4}
							spacing={4}
						>
							<HStack spacing={4} alignItems={'start'}>
								<Box mt={'8px'} bg={'red'} minW={'10px'} minH={'10px'} borderRadius={'full'}  />
							<Text {...provided.dragHandleProps}>{column.title}</Text>
							</HStack>
							<IconButton
								variant={'ghost'}
								aria-label="more"
								icon={<MdOutlineMoreVert />}
							/>
						</HStack>
					</Box>

					<Droppable droppableId={`${column.id}`} type={'task'}>
						{(provided, snapShot) => (
							<Box
								padding={4}
								// cho height
								{...provided.droppableProps}
								ref={provided.innerRef}
								paddingTop={4}
							
								bg={snapShot.isDraggingOver ? 'hu-Green.light' : undefined}
							>
								{column.task.map((value, key: number) => {
									return <Task data={value} key={key} index={key} />
								})}
								{provided.placeholder}
							</Box>
						)}
					</Droppable>
				</Box>
			)}
		</Draggable>
	)
}
