import { Box, Button, HStack, Tag, TagLabel, Text, VStack } from '@chakra-ui/react'
import { Head } from 'components/common'
import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { allJobsQuery, detailJobQuery } from 'queries/job'
import React, { useContext, useEffect, useState } from 'react'
import { BsArrowRightShort } from 'react-icons/bs'
import { FaRegHandPointRight } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import { RiSuitcaseLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'

const jobOpening: NextLayout = () => {
	const { handleLoading } = useContext(AuthContext)
	const [jobId, setJobId] = useState<number | null>(null)
	const [jobKey, setJobKey] = useState<number>(0)

	const { data: allJob } = allJobsQuery()
	const { data: detailJob, mutate: refetchDetail } = detailJobQuery(jobId)

	useEffect(() => {
		handleLoading(false)
	}, [])

	useEffect(() => {
		if (jobId) {
			refetchDetail()
		}
	}, [jobId])
	useEffect(() => {
		if (allJob?.jobs && allJob.jobs.length > 0) {
			setJobId(allJob.jobs[0].id)
		}
	}, [allJob])
	return (
		<HStack h={'calc( 100vh - 180px )'} w={'full'}>
			<Head title='Job opening'/>
			<VStack
				spacing={5}
				alignItems={'start'}
				h={'full'}
				minW={'300px'}
				w={'300px'}
				maxW={'300px'}
			>
				<VStack spacing={3} pr={'10px'} overflow={'auto'} w={'full'} alignItems={'start'}>
					{allJob?.jobs?.map((job, key) => (
						<HStack
							onClick={() => {
								setJobId(job.id)
								setJobKey(key)
							}}
							key={key}
							justifyContent={'space-between'}
							w={'full'}
							borderRadius={5}
							bg={jobKey == key ? 'hu-Green.lightA' : 'white'}
							color={jobKey == key ? 'hu-Green.normal' : 'black'}
							p={3}
							transition={'0.3s'}
							_hover={{
								cursor: 'pointer',
								background: 'hu-Green.lightA',
								color: 'hu-Green.normal',
							}}
						>
							<HStack isTruncated spacing={5}>
								<Box w={'20px'} minW={'20px'}>
									<FaRegHandPointRight fontSize={'20px'} />
								</Box>
								<Text isTruncated>{job.title}</Text>
							</HStack>
							<Box w={'25px'} minW={'25px'}>
								<BsArrowRightShort fontSize={'25px'} />
							</Box>
						</HStack>
					))}
				</VStack>
			</VStack>
			<Box pl={'20px'} h={'full'} flex={1}>
				{detailJob?.job && (
					<>
						<HStack alignItems={'center'} justify={'space-between'}>
							<Text fontSize={'24px'} fontWeight={'semibold'}>
								{detailJob?.job?.title}
							</Text>
							<Link
								passHref
								href={`/job-apply/${detailJob?.job?.title.replace(
									/ /g,
									'-'
								)}/${jobId}`}
							>
								<Button
									colorScheme={'green'}
									leftIcon={<RiSuitcaseLine fontSize={20} />}
								>
									Apply
								</Button>
							</Link>
						</HStack>
						<VStack mt={10} alignItems={'start'} spacing={6} w={'full'}>
							<VStack alignItems={'start'} spacing={3} w={'full'}>
								<Text
									fontWeight={'semibold'}
									color={'hu-Green.normal'}
									fontSize={'18px'}
								>
									Skill
								</Text>
								<HStack spacing={4}>
									{detailJob.job.skills.map((skill, key) => {
										return (
											<Tag
												size={'md'}
												key={key}
												variant="subtle"
												colorScheme="cyan"
											>
												<TagLabel>{skill.name}</TagLabel>
											</Tag>
										)
									})}
								</HStack>
							</VStack>
							<VStack alignItems={'start'} spacing={3} w={'full'}>
								<Text
									fontWeight={'semibold'}
									color={'hu-Green.normal'}
									fontSize={'18px'}
								>
									Location
								</Text>
								{detailJob.job.locations.map((location, key) => (
									<HStack spacing={3} key={key}>
										<GrLocation fontSize={'15px'} />
										<Text>{location.name}</Text>
									</HStack>
								))}
							</VStack>

							<VStack alignItems={'start'} spacing={3} w={'full'}>
								<Text
									fontSize={'18px'}
									fontWeight={'semibold'}
									color={'hu-Green.normal'}
								>
									Description
								</Text>
								<div
									dangerouslySetInnerHTML={{
										__html: detailJob.job.job_description
											? detailJob.job.job_description
											: '',
									}}
								/>
							</VStack>
						</VStack>
					</>
				)}
			</Box>
		</HStack>
	)
}

jobOpening.getLayout = RecruitLayout
export default jobOpening
