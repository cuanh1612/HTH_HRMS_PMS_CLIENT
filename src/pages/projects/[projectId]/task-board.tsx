import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { Box } from '@chakra-ui/react'
import Column from 'components/board/Column'

interface Column {
	id: string | number
	title: string
	task: Array<{
		id: string
		title: any
	}>
}

const taskBoard: NextLayout = () => {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const [columns, setColumns] = useState<Column[]>([])

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	useEffect(() => {
		setColumns([
			{
				id: 'column-1',
				title: 'Create database with posgres sql',
				task: [
					{
						id: 'task-1',
						title: 'task-1 ',
					},
					{
						id: 'task-2',
						title: 'task-2',
					},
					{
						id: 'task-3',
						title: 'task-3',
					},
				],
			},
			{
				id: 'column-2',
				title: 'column-2',
				task: [],
			},
			{
				id: 'column-4',
				title: 'column-4',
				task: [],
			},
			{
				id: 'column-5',
				title: 'column-5',
				task: [],
			},
			{
				id: 'column-3',
				title: 'Create database with posgres sql',
				task: [
					{
						id: 'task-4',
						title: 'task-4',
					},
					{
						id: 'task-5',
						title: 'task-5',
					},
					{
						id: 'task-6',
						title: 'task-6',
					},
				],
			},
		])
	}, [])

	const onDragEnd = (result: DropResult) => {
		console.log(result)
	}
	return (
		<div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable  droppableId="ALL-COLUMNS" direction="horizontal" type="column">
					{(provided, snapshot) => (
						<Box display={'flex'} paddingBottom={'10'} overflow={'auto'} {...provided.droppableProps} ref={provided.innerRef}>
							{columns.map((column, key: number) => (
								<Column key={key} column={column} index={key} />
							))}
							{provided.placeholder}
						</Box>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}

taskBoard.getLayout = ClientLayout

export default taskBoard
