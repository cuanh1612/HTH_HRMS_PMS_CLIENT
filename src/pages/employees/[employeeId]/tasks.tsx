import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allTasksByEmployeeQuery } from 'queries'
import { useContext, useEffect } from 'react'

export default function TasksEmployee() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	//Query -------------------------------------------------------------------
	const { data: allTasks } = allTasksByEmployeeQuery(isAuthenticated, employeeId as string)

	//Funcion -----------------------------------------------------------------

	//User effect --------------------------------------------------------------

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
			<Box></Box>
		</>
	)
}
