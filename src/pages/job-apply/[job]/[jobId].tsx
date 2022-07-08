import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'

const Apply:NextLayout = ()=> {
    const {handleLoading} = useContext(AuthContext)
    useEffect(()=> {
        handleLoading(false)
    }, [])
  return (
    <div>[jobId]</div>
  )
}

Apply.getLayout = RecruitLayout
export default Apply