import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineFileText, AiOutlineProject } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'
import { IoExitOutline } from 'react-icons/io5'
import { VscTasklist } from 'react-icons/vsc'
import { ITab } from 'type/element/commom'

export const EmployeeLayout = ({ children }: { children: JSX.Element }) => {
	const { currentUser } = useContext(AuthContext)
	const {
		query: { employeeId },
	} = useRouter()
	const [tabs, setTabs] = useState<ITab[]>([])
	useEffect(() => {
		if (employeeId) {
			const data = [
				{
					icon: <AiOutlineFileText fontSize={'15'} />,
					link: `/employees/${employeeId}/detail`,
					title: 'Detail',
				},
				{
					icon: <AiOutlineProject fontSize={'15'} />,
					link: `/employees/${employeeId}/project`,
					title: 'Projects',
				},
				{
					icon: <VscTasklist fontSize={'15'} />,
					link: `/employees/${employeeId}/task`,
					title: 'Tasks',
				},
				{
					icon: <BiTimeFive fontSize={15} />,
					link: `/employees/${employeeId}/time-Log`,
					title: 'Time logs',
				},
				{
					icon: <IoExitOutline fontSize={15} />,
					link: `/employees/${employeeId}/leave`,
					title: 'Leave',
				},
			]
			setTabs(data)
		}
	}, [employeeId, currentUser])
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
			<Box w={['full', null, null, 'calc( 100% - 300px )']}>
				<Header />
				<Box w={'full'} h={'auto'} paddingInline={[5, null, null, 10]}>
					<TabsMenu tabs={tabs} />
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
