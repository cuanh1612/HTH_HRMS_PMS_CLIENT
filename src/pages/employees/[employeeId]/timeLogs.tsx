import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { timeLogsCurrentUserQuery } from 'queries'
import { useContext, useEffect } from 'react'

export default function TimeLogsEmployee() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Query -------------------------------------------------------------------
	const { data: allTimeLogs } = timeLogsCurrentUserQuery(isAuthenticated)

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
