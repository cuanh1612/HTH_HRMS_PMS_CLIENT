import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailProjectQuery } from 'queries/project'
import { useContext, useEffect } from 'react'

export interface IOverviewProps {}

export default function Overview(props: IOverviewProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
    const {projectId} = router.query

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
	// get detail project
	const { data: dataDetailProject } = detailProjectQuery(isAuthenticated, projectId as string)

	return (
        <>
        </>
    )
}
