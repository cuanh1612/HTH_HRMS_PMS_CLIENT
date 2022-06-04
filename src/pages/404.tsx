import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect } from 'react'

export default function notFind() {
    const {handleLoading} = useContext(AuthContext)
    useEffect(()=> {
        handleLoading(false)
    }, [])
	return <div>404</div>
}
