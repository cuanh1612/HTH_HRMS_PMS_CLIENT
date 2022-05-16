import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

export default function Overview() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//User effect ---------------------------------------------------------------
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

    //query ----------------------------------------------------------------------

	return (
        <>
        </>
    )
}
