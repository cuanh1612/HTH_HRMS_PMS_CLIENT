import { Box, Button, Grid, GridItem } from '@chakra-ui/react'
import { Loading } from 'components/common'
import { Input } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateSkillMutation } from 'mutations/skill'
import { useRouter } from 'next/router'
import { allSkillsQuery, detailSkillQuery } from 'queries/skill'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdOutlineHolidayVillage } from 'react-icons/md'
import { updateSkillsForm } from 'type/form/basicFormType'

export interface IUpdateSkillProps {
	onCloseDrawer?: () => void
	skillId: string | number | null
}

export default function UpdateSkill({ onCloseDrawer, skillId }: IUpdateSkillProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Query ---------------------------------------------------------------------
	const {data: dataDetailSkills} = detailSkillQuery(skillId)

	// get all holidays
	const { mutate: refetchAllSkills} = allSkillsQuery(isAuthenticated)

	//mutation ------------------------------------------------------------------
	const [mutateUpSkill, { status: statusUpSkill, data: dataUpSkill }] =
		updateSkillMutation(setToast)

	// setForm and submit form update skill -----------------------------------
	const formSetting = useForm<updateSkillsForm>({
		defaultValues: {
			name: '',
		},
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: updateSkillsForm) => {
		if (!skillId) {
			setToast({
				type: 'error',
				msg: 'Not found skill to update',
			})
		} else {
			mutateUpSkill({
				name: values.name,
				skillId,
			})
		}
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

	//Setting form when have data detail skill
	useEffect(() => {
		if (dataDetailSkills?.skill) {
			//Set data form
			formSetting.reset({
				name: dataDetailSkills.skill.name || '',
			})
		}
	}, [dataDetailSkills])

	//Note when request success
	useEffect(() => {
		if (statusUpSkill === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: statusUpSkill,
				msg: dataUpSkill?.message as string,
			})

			refetchAllSkills()
		}
	}, [statusUpSkill])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2]}>
						<Input
							name="name"
							label="Name"
							icon={
								<MdOutlineHolidayVillage
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter Name"
							type="text"
							required
						/>
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

				{statusUpSkill === 'running' && <Loading />}
			</Box>
		</>
	)
}
