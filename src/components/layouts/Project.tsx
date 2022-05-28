import { Box, HStack } from '@chakra-ui/react'
import { TabsMenu } from 'components/common'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ITab } from 'type/element/commom'
export const ProjectLayout = ({ children }: { children: JSX.Element }) => {
    const {query: {projectId}} = useRouter()
    const [tabs, setTabs] = useState<ITab[]>([])
    useEffect(()=> {
        if(projectId) {
            setTabs([
                {
                    icon: '',
                    link: `/projects/${projectId}/overview`,
                    title: 'Overview'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/members`,
                    title: 'Members'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/files`,
                    title: 'Files'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/milestones`,
                    title: 'Milestones'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/tasks-table`,
                    title: 'Tasks'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/task-board`,
                    title: 'Task Board'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/time-logs-table`,
                    title: 'Time Logs'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/discussions`,
                    title: 'Discussion'
                },
                {
                    icon: '',
                    link: `/projects/${projectId}/notes`,
                    title: 'Notes'
                },
            ])
        }
    }, [projectId])
	return (
		<HStack
			minHeight={'100vh'}
			overflow={'auto'}
			height={'100px'}
			alignItems={'start'}
			pos={'relative'}
			spacing={'0px'}
		>
			<Navigation />
			<Box w={'full'}>
				<Header />
				<Box paddingInline={10}>
					<TabsMenu
						tabs={tabs}
					/>
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
