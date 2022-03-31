import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddEmployees from './add-employees'
import UpdateEmployees from './update-employees'

export interface IEmployeesProps {}

export default function Employees(props: IEmployeesProps) {
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [employeeIdUpdate, setEmployeeUpdate] = useState<number | null>(null)

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
				open add employee
			</Button>
			<Drawer size="xl" title="Add Employee" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddEmployees onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update employee
			</Button>
			<Drawer size="xl" title="Update Employee" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateEmployees onCloseDrawer={onCloseUpdate} employeeId={employeeIdUpdate} />
			</Drawer>
		</>
	)
}
