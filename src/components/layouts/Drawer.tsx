import {
    Button,
    Drawer as DrawerChakra,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure
} from '@chakra-ui/react'
import DrawerItem from 'components/DrawerItem'
import DrawerListItem from 'components/DrawerListItem'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'

export interface IDrawerProps {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

export default function Drawer({isOpen, onOpen, onClose} : IDrawerProps) {
	// const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<div>
			<Button colorScheme="blue" onClick={onOpen}>
				open
			</Button>
			<DrawerChakra size={'sm'} placement={'left'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">HUPROM SYSTEM</DrawerHeader>
					<DrawerBody>
						<DrawerListItem
							title="HRM"
							listLink={[
								{
									title: 'Employees',
									url: '/employees',
								},
							]}
                            Icon={AiOutlineUsergroupAdd}
						/>

						<DrawerItem title="Chat room" url="/messager" Icon={AiOutlineUsergroupAdd}/>
					</DrawerBody>
				</DrawerContent>
			</DrawerChakra>
		</div>
	)
}
