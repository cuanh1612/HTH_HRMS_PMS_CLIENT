import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd'

const Task = ({ data, index }: any) => {
	return (
		<Draggable draggableId={data.id} index={Number(index)}>
			{(provided, snapshot) => {
				return (
					<div
						{...provided.draggableProps}
						ref={provided.innerRef}
						style={{
							border: snapshot.isDragging ? '1px solid white' : '1px solid red',
							padding: 8,
							marginBottom: 8,
							display: 'flex',
							...provided.draggableProps.style,
						}}
					>
						<div
							{...provided.dragHandleProps}
							style={{ width: 30, height: 30, background: 'white' }}
						></div>
						{data.content}
					</div>
				)
			}}
		</Draggable>
	)
}

const Column = ({ data, index }: any) => {
	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided) => (
				<div
        {
          ...provided.draggableProps
        }
        style={{
          margin: '8px',
          border: '1px solid red',
          borderRadius: '2px',
          width: 300,
          minWidth: 300,
          ...provided.draggableProps.style
        }}
        ref={provided.innerRef}
				>
					<h3
						style={{
							padding: 8,
						}}
            {...provided.dragHandleProps}
					>
						{data.title}
					</h3>
					<Droppable droppableId={data.id}>
						{(provided, snapshot) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={{
									padding: 8,
									border: snapshot.isDraggingOver
										? '1px solid white'
										: '1px solid red',
									height: 200,
									overflow: 'auto',
								}}
							>
								{data.task.map((item: any, key: number) => {
									return <Task key={item.id} data={item} index={key} />
								})}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	)
}

export default function index() {
	const [columns, setColumns] = useState<Array<any>>()
	const onDragEnd = (result: DropResult) => {
		if (result.destination) {
      const destination = result.destination
			const source = result.source
      if(destination.droppableId == 'ALL-COLUMNS') {
        if(columns) {
          const column = columns[source.index]
          const data = [...columns]
          data?.splice(source.index, 1)
          data?.splice(destination.index, 0, column)
          setColumns(data)
        }
        return
      }
			if (
				destination.droppableId == source.droppableId &&
				destination.index == source.index
			) {
				return
			}

			if (destination.droppableId == source.droppableId) {
				const column = columns?.find((value: any) => {
					return value.id == source.droppableId
				})

				const getTask1 = column.task[source.index]
				column.task.splice(source.index, 1)
				column.task.splice(destination.index, 0, getTask1)

				const data = columns?.map((e) => {
					if (e.id == column.id) {
						return column
					}
					return e
				})
				setColumns(data)
			}

			const column1 = columns?.find((value: any) => {
				return value.id == source.droppableId
			})

			const column2 = columns?.find((value: any) => {
				return value.id == destination.droppableId
			})

			const getTask1 = column1.task[source.index]
			column1.task.splice(source.index, 1)
			column2.task.splice(destination.index, 0, getTask1)

			const data = columns?.map((e) => {
				if (e.id == column1.id) {
					return column1
				}
				if (e.id == column2.id) {
					return column2
				}
				return e
			})

			setColumns(data)
		}

		return
	}

	useEffect(() => {
		setTimeout(() => {
			setColumns([
				{
					id: 'column-1',
					index: 1,
					title: 'column 1',
					task: [
						{
							id: 'task-1',
							content: 'task-1',
							description: 'hello everyone, to day i fell very good'
						},
						{
							id: 'task-2',
							content: 'task-2',
							description: 'hello everyone, to day i fell very good'
						},
						{
							id: 'task-3',
							content: 'task-3',
							description: 'hello everyone, to day i fell very good'
						},
						{
							id: 'task-4',
							content: 'task-4',
							description: 'hello everyone, to day i fell very good'
						},
						{
							id: 'task-6',
							content: 'task-6',
							description: 'hello everyone, to day i fell very good'
						},
						{
							id: 'task-7',
							content: 'task-7',
							description: 'hello everyone, to day i fell very good'
						},
					],
				},
				{
					id: 'column-2',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-8',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-7',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-6',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-5',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-4',
					index: 2,
					title: 'column 2',
					task: [],
				},
        {
					id: 'column-3',
					index: 2,
					title: 'column 2',
					task: [],
				},
			])
		})
	}, [])
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const { push } = useRouter()
	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				push('/login')
			}
		}
	}, [isAuthenticated])
	return (
		<div
			style={{
				display: 'flex',
			}}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable isCombineEnabled={true} droppableId="ALL-COLUMNS" direction="horizontal" type="task">
					{(provided) => (
						<div {...provided.droppableProps} style={{display: 'flex', overflow: 'auto'}} ref={provided.innerRef}>
							{columns &&
								columns.map((e: any, key: number) => {
									return <Column key={e.id} data={e} index={key}/>
								})}

							{provided.placeholder}

						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}
