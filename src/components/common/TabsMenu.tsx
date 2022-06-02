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
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { BsArrowDown } from 'react-icons/bs'
import { RiPencilLine } from 'react-icons/ri'
import { ITab } from 'type/element/commom'

export const TabsMenu = ({ tabs }: { tabs: ITab[] }) => {
	// please, set tabs.length more than 7
	const { pathname } = useRouter()
	const breakpoint = useBreakpoint()
	const [tabProjects, setTabProjects] = useState<ITab[]>([])
	const [tabMenus, setTabMenus] = useState<ITab[]>([])
	const [tabSl, setTabSl] = useState(-1)
	const [menuSl, setMenuSl] = useState(-1)

	useEffect(() => {
		setTabProjects(tabs.slice(0, 7))
		setTabMenus(tabs.slice(7, tabs.length))
	}, [tabs])

	useEffect(() => {
			tabProjects.map((item, key) => {
				if (pathname.includes(item.link.split('/')[item.link.split('/').length - 1])) {
					setTabSl(key)
					setMenuSl(-1)
				}
			})
	
	}, [tabProjects, pathname])
	useEffect(() => {
		tabMenus.map((item, key) => {
			if (pathname.includes(item.link.split('/')[item.link.split('/').length - 1])) {
				setMenuSl(key)
				setTabSl(-1)
			}
		})
	}, [tabMenus, pathname])

	useEffect(() => {
		switch (breakpoint) {
			case '2xl':
				setTabProjects(tabs.slice(0, 7))
				setTabMenus(tabs.slice(7, tabs.length))

				break
			case 'xl':
				setTabProjects(tabs.slice(0, 6))
				setTabMenus(tabs.slice(6, tabs.length))

				break
			case 'lg':
				setTabProjects(tabs.slice(0, 5))
				setTabMenus(tabs.slice(5, tabs.length))

				break
			case 'md':
				setTabProjects(tabs.slice(0, 4))
				setTabMenus(tabs.slice(4, tabs.length))

				break
			case 'sm':
				setTabProjects(tabs.slice(0, 3))
				setTabMenus(tabs.slice(3, tabs.length))

				break
			case 'base':
				setTabProjects(tabs.slice(0, 2))
				setTabMenus(tabs.slice(2, tabs.length))

				break
		}
	}, [breakpoint])

	// set style tab
	const tabStyle= useMemo(()=> ({
		border: 'none',
		borderBottom: '3px solid',
		borderColor: 'hu-Pink.lightA',
		color: 'hu-Pink.normal',
		fontWeight: 'bold',
		ring: 'none',
	}), [])

	return (
		<HStack alignItems={'start'} spacing={'0px'}>
			<Tabs defaultIndex={tabSl} index={tabSl} w={'full'} isFitted variant="enclosed">
				<TabList mb="2em">
					{tabProjects.map((tab, key) => (
						<Tab
							_focus={tabStyle}
							_selected={tabStyle}
							style={key == tabSl ? tabStyle : {
								border: 'none',
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
				<MenuButton>
					<HStack
						padding={'9px 16px 9px'}
						borderBottom={'1px solid'}
						borderColor={'gray.200'}
						spacing={2}
					>
						<Text>More</Text>
						<BsArrowDown />
					</HStack>
				</MenuButton>
				<MenuList>
					{tabMenus.map((item, key) => (
						<Link key={item.link} href={item.link} passHref>
							<MenuItem
								color={key == menuSl ? 'hu-Pink.normalH' : 'gray'}
								icon={item.icon}
							>
								{item.title}
							</MenuItem>
						</Link>
					))}
				</MenuList>
			</Menu>
		</HStack>
	)
}
