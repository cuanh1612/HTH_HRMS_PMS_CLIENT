import { Box } from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'

const index: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

	// check authenticate to redirect to home page
	useEffect(() => {
		if (isAuthenticated && currentUser) {
			if (currentUser.role.includes('Admin')) router.push('/dashboard')
			if (currentUser.role.includes('Client')) router.push('/private-dashboard-client')
			if (currentUser.role.includes('Employee')) router.push('/private-dashboard')
		} else {
			if (isAuthenticated == false) {
				handleLoading(false)
			}
		}
	}, [isAuthenticated, currentUser])

	return <Box mt={'100px'}></Box>
}
index.getLayout = ClientLayout

export default index
