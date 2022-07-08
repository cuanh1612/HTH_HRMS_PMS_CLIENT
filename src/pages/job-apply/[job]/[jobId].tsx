import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Head from 'next/head'
import React, { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'

const Apply: NextLayout = () => {
	const { handleLoading } = useContext(AuthContext)
	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<>
			<Head>
				<title>Huprom - Job apply</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
		</>
	)
}

Apply.getLayout = RecruitLayout
export default Apply
