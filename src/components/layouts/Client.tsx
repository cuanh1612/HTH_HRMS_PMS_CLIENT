import { Switch, useColorMode } from '@chakra-ui/react'

export const ClientLayout = ({ children }: { children: JSX.Element }) => {
	const { toggleColorMode, colorMode } = useColorMode()
	console.log(colorMode)
	return (
		<div>
			<Switch
				isChecked={colorMode != 'light' ? true : false}
				onChange={() => toggleColorMode()}
				colorScheme={'green'}
			/>
			{children}
		</div>
	)
}
