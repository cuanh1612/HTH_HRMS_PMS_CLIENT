import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
	const url = req.url

	if (url.includes('/login')) {
		console.log(req.cookies)
		console.log('Trang login ne')
	}

	return NextResponse.next()
}
