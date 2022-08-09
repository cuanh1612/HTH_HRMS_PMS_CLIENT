import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'

export default class Document extends NextDocument {
	render() {
		return (
			<Html>
				<Head>
					<link rel='manifest' href='/manifest.json'/>
					<link rel='apple-touch-icon' href='/assets/logo1.svg'/>
					<meta name='theme-color' content='#fff'/>
					{/* font-family: 'Montserrat', sans-serif; */}
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
						rel="stylesheet"
					/>

					{/* font-family: 'Hind Madurai', sans-serif; */}
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Hind+Madurai:wght@300;400;500;600;700&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					{/* Make Color mode to persists when you refresh the page. */}
					<ColorModeScript />
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
