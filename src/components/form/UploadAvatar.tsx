// ui component
import {
	Avatar,
	Box,
	Button,
	useDisclosure,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Modal,
} from '@chakra-ui/react'
import {ButtonIcon} from 'components/common'

import { useEffect, useRef, useState } from 'react'

// icon
import { MdOutlineFileUpload } from 'react-icons/md'

// use this library to crop image
import {
	CircleStencil,
	Cropper,
	CropperImage,
	CropperPreview,
	CropperState,
	CropperTransitions,
} from 'react-advanced-cropper'

import { HandleImg } from 'type/fileType'

let timeOutImg: NodeJS.Timeout
export const UploadAvatar = ({ setInfoImg, oldImg }: { setInfoImg: HandleImg, oldImg?: string })=> {
	const [file, setFile] = useState<FileList | null>(null)
	const [preImg, setImg] = useState<any>(null)

	// get crop image
	const [state, setState] = useState<CropperState | null>(null)
	const [image, setImage] = useState<CropperImage | null>(null)
	const [transitions, setTransitions] = useState<CropperTransitions>()
	const [infoCrop, setInfoCrop] = useState<any>()

	const refInput = useRef<any>()

	const { isOpen, onOpen, onClose } = useDisclosure()

	// give you information of image
	const onSave = () => {
		if (file) {
			const files = Object.values(file)
			setInfoImg({
				files,
				options: {
					width: infoCrop.width,
					height: infoCrop.height,
					x: infoCrop.left,
					y: infoCrop.top,
				},
			})
		}
	}

	// remove old image
	const onRemove = () => {
		setInfoImg(undefined)
		setImg(null)
		setFile(null)
		refInput.current.value = ''
	}

	// set pre image and save files to state
	useEffect(() => {
		if (file && file.length != 0) {
			setImg(URL.createObjectURL(file[0]))
			onOpen()
		}
	}, [file])

	return (
		<>
			<Box pos={'relative'} w="max-content">
				<Box
					borderRadius="full"
					_hover={{
						borderColor: 'hu-Pink.normal',
					}}
				>
					{preImg ? (
						<CropperPreview
							className="preview"
							image={image}
							state={state}
							transitions={transitions}
						/>
					) : (
						<Avatar size={'xl'} src={oldImg} />
					)}
				</Box>
				<Box bottom={'0'} right={'-10px'} pos={'absolute'} display="block">
					<input
						ref={refInput}
						accept="image/*"
						type={'file'}
						onChange={(event) => setFile(event.target.files)}
						id="upload"
						style={{
							display: 'none',
						}}
					/>
					<ButtonIcon
						htmlFor="upload"
						as={'label'}
						handle={() => {}}
						icon={<MdOutlineFileUpload />}
						activeBg={'hu-Lam.normal'}
						bg={'white'}
						ariaLabel={'upload'}
						hoverBg={'hu-Lam.lightA'}
						hoverColor={'hu-Lam.darkA'}
						activeColor={'hu-Lam.darker'}
						radius
					/>
				</Box>
			</Box>

			<Modal
				onEsc={() => {
					onRemove()
				}}
				onOverlayClick={() => {
					onRemove()
				}}
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Crop image</ModalHeader>
					<ModalCloseButton
						onClick={() => {
							onClose()
							onRemove()
						}}
					/>
					<ModalBody>
						<Box borderRadius={10} overflow="hidden">
							<Cropper
								onChange={(data) => {
									if (data) {
										setTimeout(() => {
											clearTimeout(timeOutImg)
											timeOutImg = setTimeout(() => {
												setState(data.getState())
												setImage(data.getImage())
												setTransitions(data.getTransitions())
												setInfoCrop(data.getCoordinates())
											}, 300)
										}, 500)
									}
								}}
								src={preImg}
								stencilComponent={CircleStencil}
							/>
						</Box>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="red"
                            variant="ghost"
							mr={3}
							onClick={() => {
								onClose()
								onRemove()
							}}
						>
							Close
						</Button>
						<Button
                        colorScheme={'teal'}
							onClick={() => {
								onClose()
								onSave()
							}}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
