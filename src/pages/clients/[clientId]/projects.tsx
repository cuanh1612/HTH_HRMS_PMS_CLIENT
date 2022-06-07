import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

export default function ProjectsClient() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Query -------------------------------------------------------------------
	// const { data: dataAllProjects } = allProjectsByCurrentUserQuery(isAuthenticated)

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
