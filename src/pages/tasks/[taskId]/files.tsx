import {
	Box,
	Button,
	Grid,
	GridItem,
	HStack,
	Img,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import {ItemContractFile, ItemFileUpload, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createTaskFileMutation, deleteTaskFileMutation } from 'mutations/taskFile'
import { useRouter } from 'next/router'
import { allTaskFilesQuery, detailTaskQuery } from 'queries'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlinePlusCircle, AiOutlineSave } from 'react-icons/ai'
import { ICloudinaryImg } from 'type/fileType'
import { generateImgFile } from 'utils/helper'
import { uploadFile } from 'utils/uploadFile'

export interface ITaskFilesProps {
	taskIdProp?:  string | number
}

export default function TaskFiles({taskIdProp}: ITaskFilesProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()
	const { taskId: taskIdRouter } = router.query

	//Setup disclosure ----------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//State ---------------------------------------------------------------------
	const [filesUpload, setFilesUpload] = useState<File[]>([])
	const [isLoadUpFiles, setIsLoadUpFiles] = useState<boolean>(false)
	const [projectId, setProjectId] = useState<string | number>()

	//Query ----------------------------------------------------------------------
	const { data: dataAllTaskFiles, mutate: refetchAllTaskFiles } = allTaskFilesQuery(
		isAuthenticated,
		Number(taskIdProp || taskIdRouter)
	)

	const { data: dataDetailTask } = detailTaskQuery(
		isAuthenticated,
		taskIdProp || (taskIdRouter as string)
	)

	//mutation -------------------------------------------------------------------
	const [mutateCreTaskFile, { status: statusCreTaskFile, data: dataCreTaskFile }] =
		createTaskFileMutation(setToast)

	const [mutateDeleteTaskFile, { status: statusDeleteTaskFile, data: dataDeleteTaskFile }] =
		deleteTaskFileMutation(setToast)

	//Setting data file submit --------------------------------------------------
	const onDrop = useCallback((acceptedFiles: File[]) => {
		//Check size
		let isValidSize = true
		acceptedFiles.forEach((file) => {
			if (file.size >= 10485760) {
				isValidSize = false
			}
		})

		if (isValidSize) {
			setFilesUpload(acceptedFiles)
		} else {
			setToast({
				msg: 'Each file should be less than 10MB in size.',
				type: 'warning',
			})
		}
	}, [])

	//Setting files uploads -----------------------------------------------------
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	//User effect ---------------------------------------------------------------
	//set project id
	useEffect(() => {
		if(dataDetailTask?.task?.project){
			setProjectId(dataDetailTask.task.project.id)
		}
	}, [dataDetailTask])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && (taskIdProp || taskIdRouter)) {
			socket.emit('joinRoomTaskFile', taskIdProp || taskIdRouter)

			socket.on('getNewTaskFile', () => {
				refetchAllTaskFiles()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && (taskIdProp || taskIdRouter)) {
				socket.emit('leaveRoomTaskFile', taskIdProp || taskIdRouter)
			}
		}

		return leaveRoom
	}, [socket, taskIdProp, taskIdRouter])

	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Note when request success
	useEffect(() => {
		if (statusCreTaskFile === 'success') {
			setToast({
				type: 'success',
				msg: dataCreTaskFile?.message as string,
			})

			setFilesUpload([])

			refetchAllTaskFiles()

			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newTaskFile', taskIdProp || taskIdRouter)
			}
		}
	}, [statusCreTaskFile])

	//Note when request delete project file success
	useEffect(() => {
		if (statusDeleteTaskFile === 'success') {
			setToast({
				type: 'success',
				msg: dataDeleteTaskFile?.message as string,
			})

			refetchAllTaskFiles()

			// Emit to other user join room
			if (socket && projectId) {
				socket.emit('newTaskFile', taskIdProp || taskIdRouter)
			}
		}
	}, [statusDeleteTaskFile])

	//Function --------------------------------------------

	//Remove file upload
	const onRemoveFile = (index: number) => {
		const newFilesUpload = filesUpload.filter((_, indexFile) => indexFile !== index)
		setFilesUpload(newFilesUpload)
	}

	//Handle cancel upload files
	const handleCancel = () => {
		setFilesUpload([])
		onCloseAdd()
	}

	//Handle upload fies
	const handleUploadFiles = async () => {
		if (filesUpload.length > 0) {
			//Set is load upload file
			setIsLoadUpFiles(true)

			const dataUploadFiles: Array<ICloudinaryImg> = await uploadFile({
				files: filesUpload,
				tags: ['projectFile'],
				raw: true,
				upload_preset: 'project-file',
			})

			//Set is load upload file
			setIsLoadUpFiles(false)

			return dataUploadFiles
		}

		return null
	}

	//Handle upload files
	const onUploadFiles = async () => {
		//Upload contract files
		const dataUploadFiles: ICloudinaryImg[] | null = await handleUploadFiles()
		
		//Check upload files success
		if ((taskIdProp || taskIdRouter) && dataUploadFiles && dataUploadFiles?.length > 0) {

			//Create task file
			mutateCreTaskFile({
				files: dataUploadFiles,
				task: Number(taskIdProp || taskIdRouter),
			})
		}
	}

	//Handle delete project file
	const onDeleteFile = (taskFileId: number) => {
		if (!taskIdRouter && !taskIdProp) {
			setToast({
				msg: 'Not found task file to delete contract file',
				type: 'error',
			})
		} else {
			mutateDeleteTaskFile({
				taskFileId,
				taskId: Number(taskIdRouter || taskIdProp),
			})
		}
	}

	return (
		<Box>
			<VStack align={'start'} w="full" bgColor={'white'} p={5} borderRadius={5} spacing={5}>
				<Box position={'relative'} p={2} w={'full'}>
					{isOpenAdd ? (
						<VStack w={'full'} spacing={5} position={'relative'}>
							<VStack
								align={'center'}
								w={'full'}
								border={'4px dotted #009F9D30'}
								p={10}
								spacing={10}
								borderRadius={20}
								{...getRootProps()}
							>
								<Img
									width={150}
									height={100}
									alt="upload_file"
									src="/assets/uploadFiles.svg"
								/>
								<input {...getInputProps()} />
								{isDragActive ? (
									<Text fontSize={16} fontWeight={'semibold'} color={'gray'}>
										Drop the files here ...
									</Text>
								) : (
									<Text fontSize={16} fontWeight={'semibold'} color={'gray'}>
										Drag your documents, photos, or videos here to start
										uploading
									</Text>
								)}
							</VStack>

							<HStack w={'full'} justify={'end'}>
								<Button onClick={handleCancel} variant={'ghost'}>
									Cancel
								</Button>
								<Button
									colorScheme={'teal'}
									leftIcon={<AiOutlineSave />}
									disabled={filesUpload.length === 0}
									onClick={onUploadFiles}
								>
									Save
								</Button>
							</HStack>
						</VStack>
					) : (
						<Button
							leftIcon={<AiOutlinePlusCircle />}
							variant="ghost"
							color={'blue.400'}
							_hover={{
								color: 'black',
							}}
							onClick={onOpenAdd}
						>
							Add Files
						</Button>
					)}

					{(isLoadUpFiles || statusCreTaskFile === 'running') && <Loading />}
				</Box>

				{filesUpload.length > 0 && (
					<VStack w={'full'} px={2}>
						{filesUpload.map((file, index) => (
							<ItemFileUpload
								key={index}
								src={generateImgFile(file.name)}
								fileName={file.name}
								index={index}
								onRemoveFile={onRemoveFile}
							/>
						))}
					</VStack>
				)}

				<Grid templateColumns="repeat(4, 1fr)" gap={4} w={'full'} p={2}>
					{dataAllTaskFiles?.taskFiles &&
						dataAllTaskFiles.taskFiles.map((taskFile) => (
							<GridItem
								key={taskFile.id}
								colSpan={[4]}
								border={'1px'}
								borderColor={'gray.300'}
								p={2}
								borderRadius={5}
							>
								<ItemContractFile
									name={taskFile.name}
									contractFileId={taskFile.id}
									onDeleteFile={onDeleteFile}
									srcImg={generateImgFile(taskFile.name)}
									urlFile={taskFile.url}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</Box>
	)
}