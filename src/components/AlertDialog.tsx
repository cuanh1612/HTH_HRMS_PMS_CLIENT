import {
	AlertDialogBody,
	AlertDialog as CAlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogCloseButton,
	AlertDialogFooter,
	Button,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/theme-tools/node_modules/@chakra-ui/utils'
import { useRef } from 'react'

interface IDialog {
	isOpen: boolean
	onClose: () => void
	title: string
	content: string
	handleDelete: () => void
}

export default function AlertDialog({ isOpen, onClose, title, content, handleDelete }: IDialog) {
	const cancelRef = useRef<FocusableElement | null>(null)

	return (
		<CAlertDialog
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />

			<AlertDialogContent>
				<AlertDialogHeader>{title}</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>{content}</AlertDialogBody>
				<AlertDialogFooter>
					<Button onClick={onClose}>No</Button>
					<Button
						onClick={() => {
							handleDelete()
							onClose()
						}}
						colorScheme="red"
						ml={3}
					>
						Yes
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</CAlertDialog>
	)
}
