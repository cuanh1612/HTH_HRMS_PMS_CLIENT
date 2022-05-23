import {
	Box,
	Button,
	ButtonGroup,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import AlertDialog from 'components/AlertDialog'
import { Input } from 'components/form/Input'
import { InputNumber } from 'components/form/InputNumber'
import { Select } from 'components/form/Select'
import { Textarea } from 'components/form/Textarea'
import { ClientLayout } from 'components/layouts'
import Modal from 'components/modal/Modal'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import {
	createMilestoneTypeMutation,
	deleteMilestoneMutation,
	updateMilestoneMutation,
} from 'mutations/milestone'
import { useRouter } from 'next/router'
import { milestonesByProjectQuery } from 'queries/milestone'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdDriveFileRenameOutline, MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { milestoneForm } from 'type/form/basicFormType'
import { TColumn } from 'type/tableTypes'
import { milestoneValidate } from 'utils/validate'

const milestones: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	// set loading table
	const [isLoading, setIsloading] = useState(true)
	const [idMilestone, setIdMilestone] = useState<string | number>()
	const [isUpdate, setIsUpdate] = useState(false)

	const { isOpen: isOpenModal, onClose: onCloseModal, onOpen: onOpenModal } = useDisclosure()

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	const { projectId } = router.query

	// get all milestone by project
	const { data: allMilestone, mutate: refetchAllMilestones } = milestonesByProjectQuery(
		isAuthenticated,
		projectId
	)

	const [createMilestone, { status: statusCreate, data: dataCreate }] =
		createMilestoneTypeMutation(setToast)

	const [updateMilestone, { status: statusUpdate, data: dataUpdate }] =
		updateMilestoneMutation(setToast)

	// delete milestone
	const [deleteMilestone, { status: statusDelete, data: dataDelete }] =
		deleteMilestoneMutation(setToast)

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	// setForm and submit form create and update milestone ----------------------------------------------------------
	const formSetting = useForm<milestoneForm>({
		defaultValues: {
			addtobudget: 1,
			cost: 1,
			status: 1,
			title: '',
			summary: '',
		},
		resolver: yupResolver(milestoneValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete user
	const onSubmit = async (values: milestoneForm) => {
		values = {
			...values,
			status: values.status == 1 ? false : true,
			addtobudget: values.addtobudget == 1 ? false : true,
		}

		const data = {
			...values,
			project: projectId,
		}

		if (isUpdate) {
			updateMilestone({
				inputUpdate: data,
				milestoneId: idMilestone,
			})
		} else {
			createMilestone(data)
		}
	}

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Milestones',
			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
					Cell: ({ value }) => {
						return value
					},
				},
				{
					Header: 'Milestone Title',
					accessor: 'title',
					width: 180,
					minWidth: 180,
				},
				{
					Header: 'Milestone Cost',
					accessor: 'cost',
					width: 180,
					minWidth: 180,
					Cell: ({ value }) => `$${value}`,
				},
				{
					Header: 'Status',
					accessor: 'status',
					width: 180,
					minWidth: 180,
					Cell: ({ value }) => (
						<HStack alignItems={'center'} spacing={4}>
							<Box
								background={value ? 'hu-Green.normal' : 'red.300'}
								w={'2'}
								borderRadius={'full'}
								h={'2'}
							/>
							<Text>{value ? 'Complete' : 'Incomplete'}</Text>
						</HStack>
					),
				},
				{
					Header: 'Action',
					accessor: 'action',
					width: 150,
					minWidth: 150,
					disableResizing: true,
					Cell: ({ row }) => (
						<ButtonGroup isAttached variant="outline">
							<Button>View</Button>
							<Menu>
								<MenuButton as={Button} paddingInline={3}>
									<MdOutlineMoreVert />
								</MenuButton>
								<MenuList>
									<MenuItem
										onClick={() => {
											setIdMilestone(row.values['id'])
											console.log(row.values)
											formSetting.reset({
												...row.values,
												status: row.values['status'] == true ? 2 : 1,
												addtobudget:
													row.original['addtobudget'] == true ? 2 : 1,
												summary: row.original['summary'],
											})
											setIsUpdate(true)
											onOpenModal()
										}}
										icon={<RiPencilLine fontSize={'15px'} />}
									>
										Edit
									</MenuItem>

									<MenuItem
										onClick={() => {
											setIdMilestone(row.values['id'])
											onOpenDl()
										}}
										icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
									>
										Delete
									</MenuItem>
								</MenuList>
							</Menu>
						</ButtonGroup>
					),
				},
			],
		},
	]

	useEffect(() => {
		if (statusCreate == 'success' && dataCreate) {
			setToast({
				type: 'success',
				msg: dataCreate.message,
			})
			onCloseModal()
			refetchAllMilestones()
		}
	}, [statusCreate])

	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdate) {
			setToast({
				type: 'success',
				msg: dataUpdate.message,
			})
			onCloseModal()
			refetchAllMilestones()
		}
	}, [statusUpdate])

	useEffect(() => {
		if (statusDelete == 'success' && dataDelete) {
			setToast({
				type: 'success',
				msg: dataDelete.message,
			})
			refetchAllMilestones()
		}
	}, [statusDelete])

	useEffect(() => {
		if (allMilestone) {
			setIsloading(false)
		}
	}, [allMilestone])

	return (
		<div>
			<Button
				onClick={() => {
					formSetting.reset({
						addtobudget: 1,
						cost: 1,
						status: 1,
						title: '',
						summary: '',
					})
					setIsUpdate(false)
					onOpenModal()
				}}
			>
				Add new
			</Button>
			<Table
				data={allMilestone?.milestones || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={false}
			/>
			<Modal
				onOk={() => {}}
				size={'xl'}
				onClose={onCloseModal}
				onOpen={onOpenModal}
				title={'add milestone'}
				isOpen={isOpenModal}
				form={'milestone'}
			>
				<VStack
					as={'form'}
					onSubmit={handleSubmit(onSubmit)}
					id={'milestone'}
					spacing={5}
					paddingInline={6}
				>
					<HStack alignItems="start" w={'full'} spacing={5}>
						<Input
							name="title"
							label="Tilte"
							icon={
								<MdDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter title"
							type="text"
							required
						/>
						<InputNumber
							min={1}
							form={formSetting}
							label={'Cost'}
							name={'cost'}
							required={true}
						/>
					</HStack>
					<HStack alignItems="start" w={'full'} spacing={5}>
						<Select
							options={[
								{
									label: 'Incomplete',
									value: 1,
								},
								{
									label: 'Complete',
									value: 2,
								},
							]}
							name={'status'}
							form={formSetting}
							label={'Status'}
							required={false}
						/>
						<Select
							options={[
								{
									label: 'Incomplete',
									value: 1,
								},
								{
									label: 'Complete',
									value: 2,
								},
							]}
							name={'addtobudget'}
							form={formSetting}
							label={'Add cost to project budget'}
							required={false}
						/>
					</HStack>
					<Textarea
						form={formSetting}
						label={'Summary'}
						required={true}
						name={'summary'}
						placeholder={'Enter summary'}
					/>
				</VStack>
			</Modal>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteMilestone(String(idMilestone))
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>
		</div>
	)
}

milestones.getLayout = ClientLayout

export default milestones
