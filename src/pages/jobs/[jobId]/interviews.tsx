import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { interviewsByJobQuery } from 'queries/interview'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

export interface ICandidateProps {
	jobIdProp: string | number | null
}

export default function Candidate({ jobIdProp }: ICandidateProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { jobId: jobIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: dataInterviews } = interviewsByJobQuery(
		isAuthenticated,
		jobIdProp || (jobIdRouter as string)
	)

    console.log(dataInterviews);
    

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

	return <></>
}
