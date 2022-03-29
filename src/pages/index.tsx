import { ClientLayout } from 'components/layouts'
import { useContext, useEffect, useState } from 'react'
import jwt from 'utils/jwt'

import { AuthContext } from 'contexts/AuthContext'
import { allUsersQuery } from 'queries/user'
import { NextLayout } from 'type/element/layout'
import { useRouter } from 'next/router'

export interface IHomeProps {}

const Home: NextLayout = () => {
	const [loading, setLoading] = useState(true)
	const { checkAuth, isAuthenticated, handleLoading } = useContext(AuthContext)

	const router = useRouter()
	useEffect(()=> {
		if(isAuthenticated) {
			handleLoading(false)
		}
		if(isAuthenticated == false) {
			router.push('/login')
		}
	}, [isAuthenticated])
	useEffect(() => {
		const authenticate = async () => {
			await checkAuth()
			setLoading(false)
		}

		authenticate()
		console.log(jwt.getToken())
	}, [checkAuth])

	const { data, error } = allUsersQuery(isAuthenticated)

	if (loading) return <h1>Loading ...</h1>

	if (error)
		return (
			<div>
				<div>{jwt.getToken()}</div>
			</div>
		)

	return (
		<>
			<div>Home Page</div>
			<div>{jwt.getToken()}</div>
			<div>{data && JSON.stringify(data?.users)}</div>
		</>
	)
}

Home.getLayout = ClientLayout
export default Home
