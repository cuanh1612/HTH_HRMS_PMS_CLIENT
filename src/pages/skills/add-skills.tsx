import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	VStack
} from '@chakra-ui/react'
import { ButtonIcon, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { createSkillsMutation } from 'mutations/skill'
import { useRouter } from 'next/router'
import { allSkillsQuery } from 'queries/skill'
import { FormEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'

export interface IAddSkillProps {
	onCloseDrawer?: () => void
}

export default function AddSkill({ onCloseDrawer }: IAddSkillProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [skills, setSkills] = useState<string[]>([''])

	// get all skills
	const { mutate: refetchAllSkills } = allSkillsQuery(isAuthenticated)

	//mutation ------------------------------------------------------------------
	const [mutateCreSkills, { status: statusCreSkills, data: dataCreSkills }] =
	createSkillsMutation(setToast)

	//Function ------------------------------------------------------------------
	const onAddSkill = () => {
		setSkills([
			...skills,
			''
		])
	}

	const onDeleteSkill = (index: number) => {
		const newSkills = skills
		newSkills.splice(index, 1)
		setSkills([...newSkills])
	}

	//Handle change name
	const onChangeName = (name: string, index: number) => {
		const newSkills = skills
		newSkills[index] = name
		setSkills(newSkills)
	}

	//Handle submit create skills
	const onSubmitCreate: FormEventHandler<HTMLDivElement> & FormEventHandler<HTMLFormElement> = (
		event
	) => {
		event.preventDefault()

		if (skills.length !== 0) {

			mutateCreSkills({
				skills,
			})
		}
	}

	//User effect ---------------------------------------------------------------

	//Handle check logged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Note when request success
	useEffect(() => {
		if (statusCreSkills === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: statusCreSkills,
				msg: dataCreSkills?.message as string,
			})

			refetchAllSkills()
		}
	}, [statusCreSkills])

	return (
		<Box pos="relative" p={6} h="auto" as={'form'} onSubmit={onSubmitCreate}>
			<VStack pos="relative" align={'start'} spacing={4}>
				{skills.map((skill, index) => (
					<Grid w={'full'} key={uuidv4()} templateColumns="repeat(7, 1fr)" gap={7}>
						<GridItem w="100%" colSpan={[5, 6]}>
							<FormControl isRequired>
								<FormLabel fontWeight={'normal'}>Name</FormLabel>
								<Input
									required
									type="text"
									defaultValue={skill}
									placeholder={'Name Skill'}
									onChange={(e: any) => onChangeName(e.target.value, index)}
								/>
							</FormControl>
						</GridItem>

						{index !== 0 && (
							<GridItem w="100%" colSpan={[2, 1]}>
								<HStack h="full" align={'end'}>
									<ButtonIcon
										ariaLabel="button-delete"
										handle={() => onDeleteSkill(index)}
										icon={<MdDeleteOutline />}
									/>
								</HStack>
							</GridItem>
						)}
					</Grid>
				))}
			</VStack>

			<Button onClick={onAddSkill} marginY={6}>
				add
			</Button>

			<Divider />

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

			{statusCreSkills === 'running' && <Loading />}
		</Box>
	)
}
