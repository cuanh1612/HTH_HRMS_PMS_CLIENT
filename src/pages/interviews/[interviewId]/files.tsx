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
import { ItemContractFile, ItemFileUpload, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createInterviewFileMutation, deleteInterviewFileMutation } from 'mutations/interviewFile'
import { useRouter } from 'next/router'
import { allInterviewFilesQuery } from 'queries/interviewFile'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlinePlusCircle, AiOutlineSave } from 'react-icons/ai'
import { ICloudinaryImg } from 'type/fileType'
import { generateImgFile } from 'utils/helper'
import { uploadFile } from 'utils/uploadFile'

export interface IInterviewFileProps {
	interviewIdProp?: string | number
}

export default function InterviewFile({ interviewIdProp }: IInterviewFileProps) {
	const { isAuthenticated, handleLoading, setToast, socket, currentUser } =
		useContext(AuthContext)
	const router = useRouter()
	const { interviewId: interviewIdRouter } = router.query

	//Setup disclosure ----------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//State ---------------------------------------------------------------------
	const [filesUpload, setFilesUpload] = useState<File[]>([])
	const [isLoadUpFiles, setIsLoadUpFiles] = useState<boolean>(false)

	//Query ----------------------------------------------------------------------
	const { data: dataAllInterviewFiles, mutate: refetchAllInterviewFiles } =
		allInterviewFilesQuery(isAuthenticated, Number(interviewIdProp || interviewIdRouter))

	//mutation -------------------------------------------------------------------
	const [mutateCreInterviewFile, { status: statusCreInterviewFile, data: dataCreInterviewFile }] =
		createInterviewFileMutation(setToast)

	const [
		mutateDeleteInterviewFile,
		{ status: statusDeleteInterviewFile, data: dataDeleteInterviewFile },
	] = deleteInterviewFileMutation(setToast)

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

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket && (interviewIdProp || interviewIdRouter)) {
			socket.emit('joinRoomInterviewFile', interviewIdProp || interviewIdRouter)

			socket.on('getNewInterviewFile', () => {
				refetchAllInterviewFiles()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && (interviewIdProp || interviewIdRouter)) {
				socket.emit('leaveRoomInterviewFile', interviewIdProp || interviewIdRouter)
			}
		}

		return leaveRoom
	}, [socket, interviewIdProp, interviewIdRouter])

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
		if (statusCreInterviewFile === 'success') {
			setToast({
				type: statusCreInterviewFile,
				msg: dataCreInterviewFile?.message as string,
			})

			setFilesUpload([])

			refetchAllInterviewFiles()

			// Emit to other user join room
			if (socket && (interviewIdProp || interviewIdRouter)) {
				socket.emit('newInterviewFile', interviewIdProp || interviewIdRouter)
			}
		}
	}, [statusCreInterviewFile])

	//Note when request delete file success
	useEffect(() => {
		if (statusDeleteInterviewFile === 'success') {
			setToast({
				type: statusDeleteInterviewFile,
				msg: dataDeleteInterviewFile?.message as string,
			})

			refetchAllInterviewFiles()

			// Emit to other user join room
			if (socket && (interviewIdProp || interviewIdRouter)) {
				socket.emit('newInterviewFile', interviewIdProp || interviewIdRouter)
			}
		}
	}, [statusDeleteInterviewFile])

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
		if (
			(interviewIdProp || interviewIdRouter) &&
			dataUploadFiles &&
			dataUploadFiles?.length > 0
		) {
			//Create interview file
			mutateCreInterviewFile({
				files: dataUploadFiles,
				interview: Number(interviewIdProp || interviewIdRouter),
			})
		}
	}

	//Handle delete project file
	const onDeleteFile = (interviewFileId: number) => {
		if (!interviewIdProp && !interviewIdRouter) {
			setToast({
				msg: 'Not found interview to delete interview file',
				type: 'error',
			})
		} else {
			mutateDeleteInterviewFile({
				interviewFileId,
				interviewId: Number(interviewIdProp || interviewIdRouter),
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

					{(isLoadUpFiles || statusCreInterviewFile === 'running') && <Loading />}
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
					{dataAllInterviewFiles?.interviewFiles &&
						dataAllInterviewFiles.interviewFiles.map((interviewFile) => (
							<GridItem
								key={interviewFile.id}
								colSpan={[4]}
								border={'1px'}
								borderColor={'gray.300'}
								p={2}
								borderRadius={5}
							>
								<ItemContractFile
									name={interviewFile.name}
									contractFileId={interviewFile.id}
									onDeleteFile={onDeleteFile}
									srcImg={generateImgFile(interviewFile.name)}
									urlFile={interviewFile.url}
									isChange={
										currentUser && currentUser.role === 'Admin'
											? true
											: false
									}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</Box>
	)
}
