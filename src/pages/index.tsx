import {
	Box,
} from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'

const index:NextLayout = ()=> {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const { push } = useRouter()



	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				push('/login')
			}
		}
	}, [isAuthenticated])


	return (
		<Box mt={'100px'}>
	
		</Box>
	)
}
index.getLayout = ClientLayout

export default index
