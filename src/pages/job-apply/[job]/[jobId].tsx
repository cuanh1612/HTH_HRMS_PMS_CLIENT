import { Head } from 'components/common'
import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'

const Apply: NextLayout = () => {
	const { handleLoading } = useContext(AuthContext)
	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<>
			<Head title={'Job apply'}/>
		</>
	)
}

Apply.getLayout = RecruitLayout
export default Apply
