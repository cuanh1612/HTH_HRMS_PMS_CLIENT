import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineMail, AiOutlineProfile } from 'react-icons/ai'
import { BsPerson } from 'react-icons/bs'
import { MdOutlineEvent } from 'react-icons/md'
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
					icon: <AiOutlineProfile fontSize={'15'} />,
					link: `/jobs/${jobId}/profile`,
					title: 'Profile',
				},
				{
					icon: <BsPerson fontSize={'15'} />,
					link: `/jobs/${jobId}/candidate`,
					title: 'Candidates',
				},
				{
					icon: <MdOutlineEvent fontSize={'15'} />,
					link: `/jobs/${jobId}/interview`,
					title: 'Interviews',
				},
				{
					icon: <AiOutlineMail fontSize={'15'} />,
					link: `/jobs/${jobId}/offer-letter`,
					title: 'Offer letters',
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
				<Box pt={'102px'}  w={'full'} h={'auto'} paddingInline={10}>
					<TabsMenu tabs={tabs} />
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
