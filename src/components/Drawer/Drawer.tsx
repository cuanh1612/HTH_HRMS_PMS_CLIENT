import {
	DrawerOverlay,
	Drawer as DrawerChakra,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter
} from '@chakra-ui/modal'
import { ReactNode } from 'react'

export interface IDrawerProps {
	isOpen: boolean
	title: string
	children: ReactNode
	onClose: () => void
	size: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'xs' | undefined
	footer?: ReactNode
}

export const Drawer = ({ isOpen, children, title, onClose, size, footer }: IDrawerProps) => {
	return (
		<>
			<DrawerChakra size={size} placement={'right'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>
					<DrawerBody p={0}>{children}</DrawerBody>
					{footer && <DrawerFooter>{footer}</DrawerFooter>}
				</DrawerContent>
			</DrawerChakra>
		</>
	)
}
