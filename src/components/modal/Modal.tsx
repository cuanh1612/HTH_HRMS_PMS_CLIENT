import {
	Button,
	Divider,
	HStack,
	Modal as ModalChkra,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'

export interface IModalProps {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
	children: ReactNode
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full'
	title: string
	onOk?: () => void
	form?: string
}

export default function Modal({ isOpen, onClose, children, size, title, onOk, form}: IModalProps) {
	return (
		<>
			<ModalChkra size={size} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />

					<Divider />
					<br />
					{children}
					<br />
					<Divider />

					<ModalFooter>
						<HStack>
							<Button onClick={onClose}>Cancel</Button>
							{onOk && (
								<Button
									onClick={() => {
										if(!form) {
											onClose()
											onOk()
										}
								
									}}
									form={form}
									type={!form ? 'button' : 'submit'}
									colorScheme={'teal'}
									leftIcon={<AiOutlineCheck />}
								>
									Save
								</Button>
							)}
						</HStack>
					</ModalFooter>
				</ModalContent>
			</ModalChkra>
		</>
	)
}
