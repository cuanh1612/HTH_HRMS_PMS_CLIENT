import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import AddHoliday from './add-holidays'

export interface IHolidayProps {}

export default function Holiday(props: IHolidayProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()

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
			<Drawer size="xl" title="Add Holiday" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddHoliday onCloseDrawer={onCloseAdd} />
			</Drawer>
		</>
	)
}
