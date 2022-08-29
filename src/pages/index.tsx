import { Box } from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import redirectPage from 'utils/redirect'

const index: NextLayout = () => {
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
index.getLayout = ClientLayout

export default index
