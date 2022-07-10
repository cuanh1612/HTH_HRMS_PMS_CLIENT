import {
	Avatar,
	Box,
	Button,
	Divider,
	Grid,
	GridItem,
	HStack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { SelectMany } from 'components/form'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { changeSkillsobApplicationMutation } from 'mutations/jobApplication'
import { useRouter } from 'next/router'
import { detailJobApplicationQuery } from 'queries/jobApplication'
import { allSkillsQuery } from 'queries/skill'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import AddSkillModal from 'src/pages/skills/add-skills-modal'
import { IOption } from 'type/basicTypes'
import { changeSkillsJobApplicationForm } from 'type/form/basicFormType'
import { changeSkillsJobApplicationValidate } from 'utils/validate'
import JobApplicationFile from './files'

export interface IDetailJobApplicationProps {
	onCloseDrawer?: () => void
	jobApplicationId: string | number | null
}

export default function DetailJobApplication({
	jobApplicationId: jobApplicationIdProp,
}: IDetailJobApplicationProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobApplicationId: jobApplicationIdRouter } = router.query

	const { isOpen: isOpenSkill, onOpen: onOpenSkill, onClose: onCloseSkill } = useDisclosure()

	//State -------------------------------------------------------------------
	const [optionSkills, setOptionSkills] = useState<IOption[]>([])
	const [selectedOptionSkills, setSelectedSkills] = useState<IOption[]>([])

	//Query -------------------------------------------------------------------
	//Get detail job application
	const { data: dataDetailJobApplication } = detailJobApplicationQuery(
		isAuthenticated,
		jobApplicationIdProp || (jobApplicationIdRouter as string)
	)

	console.log(dataDetailJobApplication)

	// get all skills
	const { data: allSkills } = allSkillsQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------
	const [mutateChangeSkillsJobApplication, { status: statusChangeSkillsJobApplication }] =
		changeSkillsobApplicationMutation(setToast)

	//Funcion -----------------------------------------------------------------

	// setForm and submit form create new job application ---------------------
	const formSetting = useForm<changeSkillsJobApplicationForm>({
		defaultValues: {
			skills: undefined,
		},
		resolver: yupResolver(changeSkillsJobApplicationValidate),
	})

	const { handleSubmit } = formSetting

	//Handle update job application skills
	const onSubmit = async (values: changeSkillsJobApplicationForm) => {
		values.jobApplicationId =
			Number(jobApplicationIdProp) || Number(jobApplicationIdRouter as string)
		await mutateChangeSkillsJobApplication(values)
	}
	//User effect ---------------------------------------------------------------

	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Set data option skills state
	useEffect(() => {
		if (allSkills && allSkills.skills) {
			const newOptionSkills: IOption[] = []

			allSkills.skills.map((skill) => {
				newOptionSkills.push({
					label: (
						<>
							<Text>{skill.name}</Text>
						</>
					),
					value: skill.id,
				})
			})

			setOptionSkills(newOptionSkills)
		}
	}, [allSkills])

	//Chane data form when have data detail event
	useEffect(() => {
		if (dataDetailJobApplication && dataDetailJobApplication.jobApplication) {
			//Set data selected option skills
			if (dataDetailJobApplication.jobApplication.skills) {
				const newSelectedOptionSkils: IOption[] = []

				dataDetailJobApplication.jobApplication.skills.map((skill) => {
					newSelectedOptionSkils.push({
						label: (
							<>
								<Text>{skill.name}</Text>
							</>
						),
						value: skill.id,
					})
				})

				setSelectedSkills(newSelectedOptionSkils)
			}

			//set data form
			formSetting.reset({
				skills: dataDetailJobApplication.jobApplication.skills
					? dataDetailJobApplication.jobApplication.skills.map((skill) => skill.id)
					: undefined,
			})
		}
	}, [dataDetailJobApplication])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(4, 1fr)" gap={6}>
					<GridItem colSpan={4}>
						<Box boxSize="150">
							<Avatar
								size="2xl"
								name={dataDetailJobApplication?.jobApplication?.name}
								src={dataDetailJobApplication?.jobApplication?.picture?.url}
							/>
						</Box>
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Name:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailJobApplication?.jobApplication?.name || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Applicant Email:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailJobApplication?.jobApplication?.email || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Applicant Phone:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${dataDetailJobApplication?.jobApplication?.mobile || '--'}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Applied At:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						{`${
							dataDetailJobApplication?.jobApplication?.createdAt
								? new Date(
										dataDetailJobApplication?.jobApplication?.createdAt
								  ).toLocaleDateString('es-CL')
								: '--'
						}`}
					</GridItem>
					<GridItem w="100%" colSpan={[4, 1]} color={'gray.400'}>
						Status:
					</GridItem>
					<GridItem w="100%" colSpan={[4, 3]}>
						<HStack>
							<Box
								width={5}
								height={5}
								bgColor={
									dataDetailJobApplication?.jobApplication?.status
										? dataDetailJobApplication.jobApplication.status ===
										  'Applied'
											? 'black'
											: dataDetailJobApplication.jobApplication.status ===
											  'Phone screen'
											? 'yellow'
											: dataDetailJobApplication.jobApplication.status ===
											  'Interview'
											? 'blue'
											: dataDetailJobApplication.jobApplication.status ===
											  'Hired'
											? 'green'
											: dataDetailJobApplication.jobApplication.status ===
											  'Rejected'
											? 'red'
											: 'gray'
										: 'gray'
								}
								borderRadius={'100%'}
							></Box>
							<Text>
								{`${dataDetailJobApplication?.jobApplication?.status || '--'}`}
							</Text>
						</HStack>
					</GridItem>
				</Grid>

				<Divider marginY={6} />
				<Text fontWeight={'semibold'}>Skill</Text>

				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<HStack mt={2}>
							<SelectMany
								form={formSetting}
								name={'skills'}
								required={true}
								options={optionSkills}
								selectedOptions={selectedOptionSkills}
								isModal={true}
								onOpenModal={onOpenSkill}
							/>
						</HStack>
					</GridItem>
				</Grid>

				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					transform="auto"
					_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
					_active={{
						bg: 'hu-Green.normalA',
						scale: 1,
					}}
					leftIcon={<AiOutlineCheck />}
					mt={6}
					type="submit"
				>
					Save
				</Button>

				<Tabs variant="enclosed" mt={6}>
					<TabList>
						<Tab>Files</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<JobApplicationFile
								jobApplicationIdProp={
									jobApplicationIdProp || (jobApplicationIdRouter as string)
								}
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>

				{statusChangeSkillsJobApplication === 'running' && <Loading />}
			</Box>

			{/* Modal skill */}
			<Modal
				size="3xl"
				isOpen={isOpenSkill}
				onOpen={onOpenSkill}
				onClose={onCloseSkill}
				title="Skill"
			>
				<AddSkillModal />
			</Modal>
		</>
	)
}
