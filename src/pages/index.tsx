import { Box } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import redirectPage from 'utils/redirect'

const index = () => {
	const { isAuthenticated, currentUser } = useContext(AuthContext)
	const router = useRouter()

	// check authenticate to redirect to home page
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			router.push(redirectPage(currentUser))
		} else {
			router.push('/login')
		}
	}, [isAuthenticated, currentUser])

	return <Box mt={'100px'}></Box>
}

export default index
