import {
	Button,
	Modal as ModalChkra,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface IModalProps {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
	children: ReactNode
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full",
    title: string
}

export default function Modal({ isOpen, onClose, children, size, title }: IModalProps) {
	return (
		<>
			<ModalChkra size={size} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}></ModalBody>
					{children}
					<ModalFooter>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</ModalChkra>
		</>
	)
}
