import { NextRequest, NextResponse } from 'next/server'
import jwtDecode, { JwtPayload } from 'jwt-decode'

export function middleware(req: NextRequest) {
	const paths = String(req.page.name).split('/')

	const redirect403 = () => {
		return NextResponse.redirect('http://localhost:3000/403')
	}
	//Get current url and refresh cookie
	const token = req.cookies['jwt-auth-cookie']

	//Get role current user
	const roleCurrentUser = token
		? jwtDecode<JwtPayload & { userId: number; role: string; email: string }>(token).role
		: null
	if (roleCurrentUser) {
		switch (paths[1]) {
			case 'dashboard':
			case 'clients':
			case 'employees':
			case 'config-company-info':
			case 'dashboard-jobs':
			case 'skills':
			case 'jobs':
			case 'job-applications':
			case 'job-offer-letters':
				if (roleCurrentUser != 'Admin') {
					return redirect403()
				}
				break
			case 'leaves':
			case 'attendance':
			case 'holidays':
			case 'messages':
			case 'private-dashboard':
				if (roleCurrentUser == 'Client') {
					return redirect403()
				}
				break
			case 'private-dashboard-client':
				if (roleCurrentUser != 'Client') {
					return redirect403()
				}
				break
			case 'contracts':
				if (roleCurrentUser == 'Employee') {
					return redirect403()
				}
				break
		}
		if (paths.includes('projects')) {
			if (paths.includes('milestones')) {
				if (roleCurrentUser == 'Client') {
					return redirect403()
				}
			}
			if (paths.includes('discussions')) {
				if (roleCurrentUser == 'Client') {
					return redirect403()
				}
			}
		}
	}

	return NextResponse.next()
}
