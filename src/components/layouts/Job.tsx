import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { ITab } from 'type/element/commom'

export const JobLayout = ({ children }: { children: JSX.Element }) => {
	const { currentUser } = useContext(AuthContext)
	const {
		query: { jobId },
	} = useRouter()
	const [tabs, setTabs] = useState<ITab[]>([])
	useEffect(() => {
		if (jobId) {
			const data = [
				{
					icon: <BsPerson fontSize={'15'} />,
					link: `/jobs/${jobId}/profile`,
					title: 'Profile',
				},
				{
					icon: <BsPerson fontSize={'15'} />,
					link: `/employees/${jobId}/detail`,
					title: 'Detail',
				},
			]
			setTabs(data)
		}
	}, [jobId, currentUser])
	return (
		<HStack
			minHeight={'100vh'}
			height={'100px'}
			alignItems={'start'}
			pos={'relative'}
			spacing={'0px'}
			w={'100%'}
			overflow={'auto'}
		>
			<Navigation />
			<Box  w={'full'}>
				<Header />
				<Box  w={'full'} h={'auto'} paddingInline={10}>
					<TabsMenu tabs={tabs} />
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
