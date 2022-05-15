import { Button, useDisclosure } from '@chakra-ui/react'
import Drawer from 'components/Drawer'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AddHoliday from './add-holidays'
import UpdateHoliday from './update-holidays'
import DetailHoliday from './[holidayId]'

export interface IHolidayProps {}

export default function Holiday({}: IHolidayProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()

	//State ---------------------------------------------------------------------
	const [holidayIdUpdate, setHolidayIdUpdate] = useState<number | null>(1)
	const [holidayIdDetail, setHolidayIdDetail] = useState<number | null>(2)

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

	//Function -------------------------------------------------------------------
	const handleOpenDetailHoliday = () => {
		window.history.pushState({}, '', `/holidays/${holidayIdDetail}`)
		onOpenDetail()
	}

	const handleCloseDetailHoliday = () => {
		router.push('/holidays', undefined, { shallow: true })
		onCloseDetail()
	}

	return (
		<>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				open add holiday
			</Button>
			<Button colorScheme="blue" onClick={onOpenUpdate}>
				open update holiday
			</Button>
			<Button colorScheme="blue" onClick={() => handleOpenDetailHoliday()}>
				open detail holiday
			</Button>
			<Drawer size="xl" title="Add Holiday" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddHoliday onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Holiday" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateHoliday onCloseDrawer={onOpenUpdate} holidayId={holidayIdUpdate} />
			</Drawer>
			<Drawer
				size="xl"
				title="Detail Holiday"
				onClose={handleCloseDetailHoliday}
				isOpen={isOpenDetail}
			>
				<DetailHoliday
					holidayIdProp={holidayIdDetail}
					onCloseDrawer={handleCloseDetailHoliday}
				/>
			</Drawer>
		</>
	)
}
