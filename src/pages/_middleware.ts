import { NextRequest, NextResponse } from 'next/server'
import jwtDecode, { JwtPayload } from 'jwt-decode'

export function middleware(req: NextRequest) {
	//Get cureent url and refresh cookie
	const url = req.url
	const token = req.cookies['jwt-auth-cookie']

	//Get role current user
	const roleCurrentUser = token
		? jwtDecode<JwtPayload & { userId: number; role: string; email: string }>(token).role
		: null
	console.log(roleCurrentUser)

	//Check authorization
	if (url.includes('/login')) {
		console.log('Trang login ne')
	}

	return NextResponse.next()
}
