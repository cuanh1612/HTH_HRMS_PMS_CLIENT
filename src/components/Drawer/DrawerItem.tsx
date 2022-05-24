import { Box, Button } from '@chakra-ui/react'
import Link from 'next/link'
import { IconType } from 'react-icons/lib'

export interface IDrawerItemProps {
	title: string
	url: string
	Icon: IconType
}

export const DrawerItem = ({ title, Icon, url }: IDrawerItemProps)=> {
	return (
		<Link href={url} passHref>
			<Button
				w={'full'}
				mt={3}
				_hover={{
					bg: 'hu-Green.lightH',
				}}
				_active={{
					bg: 'hu-Green.lightA',
				}}
			>
				<Icon />
				<Box textAlign="left" flex="1" marginLeft={4}>
					<a>{title}</a>
				</Box>
			</Button>
		</Link>
	)
}
