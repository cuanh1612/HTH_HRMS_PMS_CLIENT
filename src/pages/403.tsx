import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect } from 'react'

export default function notAuthorization() {
    const {handleLoading} = useContext(AuthContext)
    useEffect(()=> {
        handleLoading(false)
    }, [])
  return (
    <div>403</div>
  )
}
