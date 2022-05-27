import {
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tab,
	TabList,
	Tabs,
	Text,
	useBreakpoint,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BsArrowDown } from 'react-icons/bs'
import { IoEyeOutline } from 'react-icons/io5'
import { RiPencilLine } from 'react-icons/ri'
import { ITab } from 'type/element/commom'

export const TabsMenu = ({ tabs }: { tabs: ITab[] }) => {
	const breakpoint = useBreakpoint()
	console.log(breakpoint)
	return (
		<HStack alignItems={'start'} spacing={'0px'}>
			<Tabs defaultIndex={1} w={'full'} isFitted variant="enclosed">
				<TabList mb="2em">
					{tabs.map((tab, key) => (
						<Tab
							_selected={{
								border: 'none',
								borderBottom: '3px solid',
								borderColor: 'hu-Pink.lightA',
								color: 'hu-Pink.normal',
								fontWeight: 'bold',
								ring: 'none',
							}}
							key={key}
						>
							<Link href={tab.link} passHref>
								<Text w={'full'} h={'full'}>
									{tab.title}
								</Text>
							</Link>
						</Tab>
					))}
				</TabList>
			</Tabs>

			<Menu>
				<MenuButton >
					<HStack  padding={'9px 16px 9px'} borderBottom={'1px solid'} borderColor={'gray.200'} spacing={2}>
						<Text>More</Text>
						<BsArrowDown />
					</HStack>
				</MenuButton>
				<MenuList>
					<MenuItem color={'gray'} icon={<IoEyeOutline fontSize={'15px'} />}>
						View
					</MenuItem>
					<MenuItem color={'gray'} icon={<RiPencilLine fontSize={'15px'} />}>
						Edit
					</MenuItem>
				</MenuList>
			</Menu>
		</HStack>
	)
}
