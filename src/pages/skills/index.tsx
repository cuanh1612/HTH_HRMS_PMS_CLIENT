import { Button, useDisclosure } from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allSkillsQuery } from 'queries/skill'
import { useContext, useEffect } from 'react'
import { NextLayout } from 'type/element/layout'
import AddSkill from './add-skills'
import UpdateSkill from './update-skills'

const Skill: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//Query ---------------------------------------------------------------------
	const {data: dataAllSkills} = allSkillsQuery(isAuthenticated)

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

	return (
		<>
			<Button onClick={onOpenAdd}>add skills</Button>
			<Button onClick={onOpenUpdate}>update skills</Button>
			<Drawer size="xl" title="Add Skills" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddSkill onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Skills" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateSkill onCloseDrawer={onCloseUpdate} skillId={1} />
			</Drawer>
		</>
	)
}
Skill.getLayout = ClientLayout

export default Skill
