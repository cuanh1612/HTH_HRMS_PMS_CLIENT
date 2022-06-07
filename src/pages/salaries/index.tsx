import { Button, useDisclosure } from '@chakra-ui/react'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allSalariesQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import HistorySalary from './history'
import UpdateSalary from './update'



export default function Salaries() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [employeeIdShow] = useState<string | number | null>(6)

	//Modal -------------------------------------------------------------
	// set open modal to show salary history
	const {
		isOpen: isOpenHistory,
		onOpen: onOpenHistory,
		onClose: onCloseHistory,
	} = useDisclosure()

	// set open modal to show update salary
	const {
		isOpen: isOpenUpdateSalary,
		onOpen: onOpenUpdateSalary,
		onClose: onCloseUpdateSalary,
	} = useDisclosure()

	//Query -------------------------------------------------------------
	const { data: dataSalaries } = allSalariesQuery(isAuthenticated)
	console.log(dataSalaries)

	//Useeffect ---------------------------------------------------------
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
			<Button onClick={onOpenHistory}>Show history</Button>
			{/* Modal project category and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenHistory}
				onOpen={onOpenHistory}
				onClose={onCloseHistory}
				title="History Salary"
			>
				<HistorySalary employeeId={employeeIdShow} />
			</Modal>
			<Button onClick={onOpenUpdateSalary}>update history</Button>
			{/* Modal project category and designation */}
			<Modal
				size="3xl"
				isOpen={isOpenUpdateSalary}
				onOpen={onOpenUpdateSalary}
				onClose={onCloseUpdateSalary}
				title="Update Salary"
			>
				<UpdateSalary employeeId={employeeIdShow} />
			</Modal>
		</>
	)
}
