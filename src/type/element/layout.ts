import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement } from 'react'

export type NextLayout = NextPage & {
	getLayout?: ({ children }: { children: JSX.Element }) => ReactElement
}

export type AppPropsWithLayout = AppProps & {
	Component: NextLayout
}
