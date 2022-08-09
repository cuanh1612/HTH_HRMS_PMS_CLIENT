import NextHead from 'next/head'
import { companyInfoQuery } from 'queries/companyInfo'

export const Head = ({ title = '' }: { title?: string }) => {
	const { data: infoSystem } = companyInfoQuery()

	return (
		<NextHead>
			<title>{title}</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			{/* set icon */}
			{infoSystem?.companyInfo ? <link rel="icon" href={infoSystem.companyInfo.logo_url} sizes="16x16"></link> : <link rel="icon" href="/assets/logo1.svg" sizes="16x16"></link>}
		</NextHead>
	)
}
