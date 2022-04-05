import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddLeave from './add-leaves'
import UpdateLeave from './update-leaves'

export interface ILeaveProps {}

export default function Leave(props: ILeaveProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//State ---------------------------------------------------------------------
	const [leaveIdUpdate, setLeaveUpdate] = useState<number | null>(29)

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
				open add leave
			</Button>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update leave
			</Button>
			<Drawer size="xl" title="Add Leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeave onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Leave" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateLeave leaveId={leaveIdUpdate} onCloseDrawer={onCloseUpdate} />
			</Drawer>
		</>
	)
}
