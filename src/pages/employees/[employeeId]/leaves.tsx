import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allLeaveQuery } from 'queries'
import { useContext, useEffect } from 'react'

export default function LeavesEmployee() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { employeeId } = router.query

	//Query -------------------------------------------------------------------
	// get all leaves
	const { data: allLeaves } = allLeaveQuery({
		isAuthenticated,
		employee: employeeId as string,
	})

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
