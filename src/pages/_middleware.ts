import { NextRequest, NextResponse } from 'next/server'
import jwtDecode, { JwtPayload } from 'jwt-decode'

export function middleware(req: NextRequest) {
	const paths = String(req.page.name).split('/')
	const redirect404 = () => {
		const url = req.nextUrl
		url.pathname = `/404`
		return NextResponse.rewrite(url)
	}

	const redirect403 = () => {
		return NextResponse.redirect('http://localhost:3000/403')
	}
	//Get current url and refresh cookie
	const token = req.cookies['jwt-auth-cookie']

	//Get role current user
	const roleCurrentUser = token
		? jwtDecode<JwtPayload & { userId: number; role: string; email: string }>(token).role
		: null
	switch (paths[1]) {
		case 'clients':
			if (roleCurrentUser == 'Client' || roleCurrentUser == 'Employee') {
				return redirect403()
			}
		case 'leaves':
		case 'employees':
		case 'attendance':
		case 'holidays':
		case 'messages':
			if (roleCurrentUser == 'Client') {
				return redirect403()
			}
		case 'contracts':
			if (roleCurrentUser == 'Employee') {
				return redirect403()
			}
	}
	if (paths.includes('projects')) {
		if (paths.includes('milestones')) {
			if (roleCurrentUser == 'Client' || roleCurrentUser == 'Employee') {
				return redirect403()
			}
		}
		if (paths.includes('discussions')) {
			if (roleCurrentUser == 'Client') {
				return redirect403()
			}
		}
	}

	return NextResponse.next()
}
