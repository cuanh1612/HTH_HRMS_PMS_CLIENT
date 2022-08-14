import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineDashboard,
	AiOutlineFileAdd,
	AiOutlineProject,
	AiOutlineUsergroupAdd,
} from 'react-icons/ai'
import { BiTime } from 'react-icons/bi'
import { FaRegStickyNote } from 'react-icons/fa'
import { VscCommentDiscussion, VscMilestone, VscTasklist } from 'react-icons/vsc'
import { ITab } from 'type/element/commom'
export const ProjectLayout = ({ children }: { children: JSX.Element }) => {
	const { currentUser } = useContext(AuthContext)
	const {
		query: { projectId },
	} = useRouter()
	const [tabs, setTabs] = useState<ITab[]>([])
	useEffect(() => {
		if (projectId) {
			const data = [
				{
					icon: <AiOutlineDashboard fontSize={'15'} />,
					link: `/projects/${projectId}/overview`,
					title: 'Overview',
				},
				{
					icon: <AiOutlineUsergroupAdd fontSize={'15'} />,
					link: `/projects/${projectId}/members`,
					title: 'Members',
				},
				{
					icon: <AiOutlineFileAdd fontSize={'15'} />,
					link: `/projects/${projectId}/files`,
					title: 'Files',
				},
				{
					icon: <VscTasklist fontSize={15} />,
					link: `/projects/${projectId}/tasks-table`,
					title: 'Tasks',
				},
				{
					icon: <AiOutlineProject fontSize={15} />,
					link: `/projects/${projectId}/task-board`,
					title: 'Task Board',
				},
				{
					icon: <BiTime fontSize={15} />,
					link: `/projects/${projectId}/time-logs-table`,
					title: 'Time Logs',
				},

				{
					icon: <FaRegStickyNote fontSize={15} />,
					link: `/projects/${projectId}/notes`,
					title: 'Notes',
				},
				{
					icon: <VscMilestone fontSize={'15'} />,
					link: `/projects/${projectId}/milestones`,
					title: 'Milestones',
				}
			]

			if (currentUser?.role != 'Client') {
				data.push({
					icon: <VscCommentDiscussion fontSize={15} />,
					link: `/projects/${projectId}/discussions`,
					title: 'Discussion',
				})
			}

			setTabs(data)
		}
	}, [projectId, currentUser])
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
