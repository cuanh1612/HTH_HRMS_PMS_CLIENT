import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddLeave from './add-leaves'

export interface ILeaveProps {}

export default function Leave(props: ILeaveProps) {
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [leaveIdUpdate, setLeaveUpdate] = useState<number | null>(null)

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
			<Drawer size="xl" title="Add Leave" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddLeave onCloseDrawer={onCloseAdd} />
			</Drawer>
		</>
	)
}
