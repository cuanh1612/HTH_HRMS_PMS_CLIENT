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
import { ContractLayout } from 'components/layouts/Contract'
import { Loading, ItemContractFile, ItemFileUpload } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createContractFileMutation, deleteContractFileMutation } from 'mutations'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { allContractFilesQuery } from 'queries'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { AiOutlinePlusCircle, AiOutlineSave } from 'react-icons/ai'
import { NextLayout } from 'type/element/layout'
import { ICloudinaryImg } from 'type/fileType'
import { contractMutaionResponse } from 'type/mutationResponses'
import { generateImgFile } from 'utils/helper'
import { uploadFile } from 'utils/uploadFile'

const Files: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, socket, currentUser } =
		useContext(AuthContext)
	const router = useRouter()
	const { contractId } = router.query

	//Setup disclosure ----------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

	//State ---------------------------------------------------------------------
	const [filesUpload, setFilesUpload] = useState<File[]>([])
	const [isLoadUpFiles, setIsLoadUpFiles] = useState<boolean>(false)

	//Query ----------------------------------------------------------------------
	const { data: dataAllContractFiles, mutate: refetchAllContractFiles } = allContractFilesQuery(
		isAuthenticated,
		Number(contractId)
	)
	console.log(dataAllContractFiles)

	//mutation -------------------------------------------------------------------
	const [mutateCreContractFile, { status: statusCreContractFile, data: dataCreContractFile }] =
		createContractFileMutation(setToast)

	const [
		mutateDeleteContractFile,
		{ status: statusDeleteContractFile, data: dataDeleteContractFile },
	] = deleteContractFileMutation(setToast)

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
		if (socket && contractId) {
			socket.emit('joinRoomFileContract', contractId)

			socket.on('getNewFileContract', () => {
				refetchAllContractFiles()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket && contractId) {
				socket.emit('leaveRoomFileContract', contractId)
			}
		}

		return leaveRoom
	}, [socket, contractId])

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
		if (statusCreContractFile === 'success') {
			setToast({
				type: 'success',
				msg: dataCreContractFile?.message as string,
			})

			setFilesUpload([])

			refetchAllContractFiles()

			// Emit to other user join room
			if (socket && contractId) {
				socket.emit('newFile', contractId)
			}
		}
	}, [statusCreContractFile])

	//Note when request delete contract file success
	useEffect(() => {
		if (statusDeleteContractFile === 'success') {
			setToast({
				type: 'success',
				msg: dataDeleteContractFile?.message as string,
			})

			refetchAllContractFiles()

			// Emit to other user join room
			if (socket && contractId) {
				socket.emit('newFile', contractId)
			}
		}
	}, [statusDeleteContractFile])

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
				tags: ['contractFile'],
				raw: true,
				upload_preset: 'contract',
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
		if (contractId && dataUploadFiles && dataUploadFiles?.length > 0) {
			//Create contract file
			mutateCreContractFile({
				files: dataUploadFiles,
				contract: Number(contractId),
			})
		}
	}

	//Handle delete contract file
	const onDeleteFile = (contractFileId: number) => {
		if (!contractId) {
			setToast({
				msg: 'Not found contract to delete contract file',
				type: 'error',
			})
		} else {
			mutateDeleteContractFile({
				contractFileId,
				contractId: Number(contractId),
			})
		}
	}

	return (
		<Box p={10} bgColor={'#f2f4f7'}>
			<VStack align={'start'} w="full" bgColor={'white'} p={5} borderRadius={5} spacing={5}>
				<Text fontSize={18} fontWeight={'semibold'}>
					Files
				</Text>

				{currentUser?.role === 'Admin' && (
					<>
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
											<Text
												fontSize={16}
												fontWeight={'semibold'}
												color={'gray'}
											>
												Drop the files here ...
											</Text>
										) : (
											<Text
												fontSize={16}
												fontWeight={'semibold'}
												color={'gray'}
											>
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

							{(isLoadUpFiles || statusCreContractFile === 'running') && <Loading />}
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
					</>
				)}

				<Grid templateColumns="repeat(4, 1fr)" gap={4} w={'full'} p={2}>
					{dataAllContractFiles?.contractFiles &&
						dataAllContractFiles.contractFiles.map((contractFile) => (
							<GridItem
								key={contractFile.id}
								colSpan={[4, 4, 2, 2, 2, 1]}
								border={'1px'}
								borderColor={'gray.300'}
								p={2}
								borderRadius={5}
							>
								<ItemContractFile
									name={contractFile.name}
									contractFileId={contractFile.id}
									onDeleteFile={onDeleteFile}
									srcImg={generateImgFile(contractFile.name)}
									urlFile={contractFile.url}
									isChange={currentUser?.role === "Admin"}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</Box>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res: contractMutaionResponse = await fetch('http://localhost:4000/api/contracts').then(
		(result) => result.json()
	).catch(() => undefined)
	
	if (!res || !res.contracts) {
		return { paths: [], fallback: false }
	}

	const contracts = res.contracts

	// Get the paths we want to pre-render based on leave
	const paths = contracts.map((contract: any) => ({
		params: { contractId: String(contract.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}

Files.getLayout = ContractLayout

export default Files
