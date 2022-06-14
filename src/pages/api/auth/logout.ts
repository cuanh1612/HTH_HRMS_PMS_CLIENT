// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from 'cookies'
import httpProxy, { ProxyResCallback } from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

//Config body parser let pass to server api by proxy server
export const config = {
	api: {
		bodyParser: false,
	},
}

//Create server proxy
const proxy = httpProxy.createProxyServer()

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
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
		// /api/students => http://localhost:3000/api/students
		proxy.web(req, res, {
			target: process.env.API_URL,
			changeOrigin: true,
			selfHandleResponse: true,
		})

		const handleLogoutResponse: ProxyResCallback = (proxyRes, _, res) => {
			let body = ''
			proxyRes.on('data', function (chunk) {
				body += chunk
			})

			proxyRes.on('end', function () {
				try {
					const { code, success, message } = JSON.parse(body)

					//Remove cookie
					if (status) {
						cookies.set('jwt-auth-cookie')
					}

					;(res as NextApiResponse).status(code).json({
						code,
						success,
						message,
					})
				} catch (error) {
					;(res as NextApiResponse).status(500).json({
						message: 'Something went wrong.',
						code: 500,
						success: true,
					})
				}

				resolve(true)
			})
		}

		proxy.once('proxyRes', handleLogoutResponse)
	})
}
