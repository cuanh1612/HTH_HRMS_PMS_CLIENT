import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/sidebar/Index'
import { Header } from 'components/partials'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineFileAdd, AiOutlineFileText } from 'react-icons/ai'
import { VscCommentDiscussion } from 'react-icons/vsc'
import { ITab } from 'type/element/commom'

export const ContractLayout = ({ children }: { children: JSX.Element }) => {
	const { currentUser } = useContext(AuthContext)
	const {
		query: { contractId },
	} = useRouter()
	const [tabs, setTabs] = useState<ITab[]>([])
	useEffect(() => {
		if (contractId) {
			const data = [
				{
					icon: <AiOutlineFileText fontSize={'15'} />,
					link: `/contracts/${contractId}/detail`,
					title: 'Detail',
				},
				{
					icon: <VscCommentDiscussion fontSize={'15'} />,
					link: `/contracts/${contractId}/discussions`,
					title: 'Discussions',
				},
				{
					icon: <AiOutlineFileAdd fontSize={'15'} />,
					link: `/contracts/${contractId}/files`,
					title: 'Files',
				},
			]
			setTabs(data)
		}
	}, [contractId, currentUser])
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
			<Box w={'full'}>
				<Header />
				<Box pt={'102px'} w={'full'} h={'auto'} paddingInline={10}>
					<TabsMenu tabs={tabs} />
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
