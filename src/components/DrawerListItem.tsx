import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { IconType } from 'react-icons'

export interface IDrawerListItemProps {
	title: string
	listLink: {
		title: string
		url: string
	}[]
	Icon: IconType
}

export default function DrawerListItem({ title, listLink, Icon }: IDrawerListItemProps) {
	return (
		<Accordion allowToggle mt="15px" borderColor={'white'}>
			<AccordionItem isFocusable borderWidth="0">
				<AccordionButton
					as={Button}
					_hover={{
						bg: 'hu-Green.lightH',
					}}
					_active={{
						bg: 'hu-Green.lightA',
					}}
				>
					<Icon />
					<Box textAlign="left" flex="1" marginLeft={4}>
						{title}
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel p="0">
					<VStack mt="4">
						{listLink.map((itemDrawer) => (
							<Link href={itemDrawer.url} passHref>
								<Box w={'full'} paddingLeft={4} key={itemDrawer.title}>
									<Box
										w={'full'}
										borderLeft={'2px'}
										borderColor={'gray.400'}
										paddingLeft={4}
									>
										<Box
											transition={'0.2s linear'}
											cursor={'pointer'}
											borderRadius={5}
											paddingInline={5}
											paddingY={2}
											_hover={{
												bg: 'hu-Green.lightH',
												fontWeight: 'semibold',
											}}
											_active={{
												bg: 'hu-Green.lightA',
											}}
										>
											<a>{itemDrawer.title}</a>
										</Box>
									</Box>
								</Box>
							</Link>
						))}
					</VStack>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	)
}
