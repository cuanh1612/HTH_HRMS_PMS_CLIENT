import {
    Box
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allProjectsByCurrentUserQuery, clientTotalEarningQuery, clientTotalProejctsQuery, detailClientQuery } from 'queries'
import { useContext, useEffect } from 'react'

export default function DetailClient() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { clientId } = router.query

	//Query -------------------------------------------------------------------
	const { data: dataDetailClient } = detailClientQuery(isAuthenticated, clientId as string)
    const { data: dataTotalProjects } = clientTotalProejctsQuery(isAuthenticated, clientId as string)
    const { data: dataTotalEarnings } = clientTotalEarningQuery(isAuthenticated, clientId as string)
    const { data: dataAllProjects } = allProjectsByCurrentUserQuery(isAuthenticated)
    
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
			<Box>
				
			</Box>
		</>
	)
}
