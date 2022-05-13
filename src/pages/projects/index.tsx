import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddProject from './add-projects'
import UpdateEvent from './update-projects'

export interface IProjectProps {}

export default function Event({}: IProjectProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [projectIdUpdate, setProjectIdUpdate] = useState<number | null>(1)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//User effect ---------------------------------------------------------------

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

	return (
		<>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				open add project
			</Button>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update project
			</Button>
			<Drawer size="xl" title="Add Project" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddProject onCloseDrawer={onCloseAdd} />
			</Drawer>
			{/* <Drawer size="xl" title="Update Event" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateEvent onCloseDrawer={onCloseUpdate} eventIdUpdate={projectIdUpdate} />
			</Drawer> */}
		</>
	)
}
