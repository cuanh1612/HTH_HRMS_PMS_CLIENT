import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect } from 'react'

export default function _offline() {
    const {handleLoading} = useContext(AuthContext)
    useEffect(() => {
        handleLoading(false)
    }, [])
  return (
    <div>_offline</div>
  )
}
