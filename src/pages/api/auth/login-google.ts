import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxy, { ProxyResCallback } from 'http-proxy'
import Cookies from 'cookies'

//Config body parser let pass to server api by proxy server
export const config = {
	api: {
		bodyParser: false,
	},
}

//Create server proxy
const proxy = httpProxy.createProxyServer()

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	//Check method
	if (req.method !== 'POST') {
		return res.status(400).json({
			message: 'Method not valid.',
			code: 400,
			success: false,
		})
	}

	//Return promise
	return new Promise((resolve) => {
		const cookies = new Cookies(req, res)

		//Don't send cookies to API server
		req.headers.cookie = ''

		//Proxy server send req and res to target server
		// /api/students => http://localhost:4000/api/students
		proxy.web(req, res, {
			target: process.env.NEXT_PUBLIC_API_URL,
			changeOrigin: true,
			selfHandleResponse: true,
		})

		//Because selfHandleResponse is true so need to response
		const handleLoginResponse: ProxyResCallback = (proxyRes, _, res) => {
			let body = ''
			proxyRes.on('data', function (chunk) {
				body += chunk
			})

			proxyRes.on('end', function () {
				try {
					const { code, success, message, user, accessToken, refreshToken } =
						JSON.parse(body)

					if (code === 200) {
						//Save refresh token to cookie
						cookies.set('jwt-auth-cookie', refreshToken, {
							httpOnly: true,
							sameSite: 'lax',
							expires: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
						})
						;(res as NextApiResponse).status(code).json({
							code,
							success,
							message,
							user,
							accessToken,
						})
					} else {
						;(res as NextApiResponse).status(400).json(body)
						resolve(true)
					}
				} catch (error) {
					;(res as NextApiResponse).status(500).json({
						message: 'Something went wrong.',
						code: 500,
						success: false,
					})
				}

				resolve(true)
			})
		}
		proxy.once('proxyRes', handleLoginResponse)
	})
}
