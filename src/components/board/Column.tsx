import {
	Box,
	Button,
	HStack,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorMode,
	Menu,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoIosAdd } from 'react-icons/io'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { statusType } from 'type/basicTypes'
import { Task } from './Task'

export const Column = ({
	column,
	index,
	setEditForm,
	setIdColumnToDl,
	isDragDisabled = false,
	addTaskByStatus,
}: {
	column: statusType
	index: number
	setEditForm: ({ title, color, id }: { title: string; color: string; id: number }) => void
	setIdColumnToDl: (id: number) => void
	isDragDisabled?: boolean
	addTaskByStatus: (id: number) => void
}) => {
	const { colorMode } = useColorMode()
	const { currentUser } = useContext(AuthContext)

	return (
		<Draggable isDragDisabled={isDragDisabled} draggableId={`${column.id}`} index={index}>
			{(provided) => (
				<Box
					marginRight={10}
					bg={colorMode == 'dark' ? '#3a4f781f' : 'white'}
					border={'1px solid'}
					borderColor={colorMode == 'dark' ? 'transparent' : 'gray.300'}
					borderRadius={10}
					w={350}
					minW={350}
					ref={provided.innerRef}
					{...provided.draggableProps}
				>
					<Box padding={4}>
						<HStack
							borderBottom={'2px solid gray'}
							justifyContent={'space-between'}
							paddingBottom={4}
							spacing={4}
						>
							<HStack spacing={4} alignItems={'start'}>
								<Box
									mt={'8px'}
									bg={column.color}
									minW={'10px'}
									minH={'10px'}
									borderRadius={'full'}
								/>
								<Text {...provided.dragHandleProps}>{column.title}</Text>
							</HStack>
							{!column.root ? (
								<Menu>
									<MenuButton as={Button} paddingInline={3}>
										<MdOutlineMoreVert />
									</MenuButton>
									<MenuList>
										<MenuItem
											onClick={() => {
												setEditForm({
													title: column.title,
													color: column.color,
													id: column.id,
												})
											}}
											icon={<RiPencilLine fontSize={'15px'} />}
										>
											Edit
										</MenuItem>

										<MenuItem
											onClick={() => {
												setIdColumnToDl(column.id)
											}}
											icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
										>
											Delete
										</MenuItem>
									</MenuList>
								</Menu>
							) : (
								<Box w={'40px'} h={'40px'}></Box>
							)}
						</HStack>
					</Box>

					<Droppable droppableId={`${column.id}`} type={'task'}>
						{(provided, snapShot) => (
							<Box
								padding={4}
								// cho height
								{...provided.droppableProps}
								ref={provided.innerRef}
								bg={snapShot.isDraggingOver ? 'hu-Green.light' : undefined}
							>
								{column.tasks &&
									column.tasks.map((value, key: number) => {
										console.log(value)
										return (
											<Task
												isDragDisabled={
													!isDragDisabled ||
													(currentUser?.role === 'Employee' &&
														value.assignBy?.id === currentUser?.id)
														? false
														: true
												}
												data={value}
												key={value.id}
												index={key}
											/>
										)
									})}
								{provided.placeholder}
							</Box>
						)}
					</Droppable>
					<Box
						cursor={'pointer'}
						marginRight={10}
						borderRadius={10}
						paddingInline={4}
						w={350}
						minW={350}
						height={'min-content'}
					>
						<HStack
							onClick={() => {
								addTaskByStatus(column.id)
							}}
							bg={colorMode == 'light' ? 'gray.100' : '#3a4f781f'}
							padding={4}
							borderRadius={10}
							spacing={4}
							marginBottom={4}
						>
							<HStack spacing={4} alignItems={'center'}>
								<IoIosAdd fontSize={'20px'} />
								<Text>Add new task</Text>
							</HStack>
						</HStack>
					</Box>
				</Box>
			)}
		</Draggable>
	)
}
