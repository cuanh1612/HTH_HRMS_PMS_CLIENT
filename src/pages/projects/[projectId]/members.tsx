import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { NextLayout } from 'type/element/layout'
import { ClientLayout } from 'components/layouts'
import { allEmployeesInProjectQuery } from 'queries/project'
import Table from 'components/Table'
import { TColumn } from 'type/tableTypes'
import {
	Avatar,
	Badge,
	Button,
	HStack,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Radio,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { deleteEmpInProjectMutation, projectAdminMutation } from 'mutations/project'
import AlertDialog from 'components/AlertDialog'
import { commonResponse, projectMutaionResponse } from 'type/mutationResponses'
import { updateHourlyRateMutation } from 'mutations/hourlyRate'

var hourlyRateTimeOut: NodeJS.Timeout

const members: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { projectId } = router.query
	const [employeeId, setIdEmployee] = useState<number>()
	const [projectRsponse, setProject] = useState<projectMutaionResponse>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// set project admin
	const [setProjectAdmin, { status: statusSetAdmin, data: dataProjectAdmin }] =
		projectAdminMutation(setToast)

	// delete employee in project
	const [deleteEmployee, { status: statusDelete, data: dataDeleteEmpl }] =
		deleteEmpInProjectMutation(setToast)

	// set hourly rate
	const [setHourlyRate, { status: statusHourlyRate, data: dataHourlyRate }] =
		updateHourlyRateMutation(setToast)

	const { data: allEmployees, mutate: refetchMember } = allEmployeesInProjectQuery(
		isAuthenticated,
		projectId
	)

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	useEffect(() => {
		if (statusSetAdmin == 'success' && dataProjectAdmin) {
			setToast({
				type: 'success',
				msg: dataProjectAdmin.message,
			})

			refetchMember()
		}
	}, [statusSetAdmin])

	useEffect(() => {
		if (statusDelete == 'success' && dataDeleteEmpl) {
			setToast({
				type: 'success',
				msg: dataDeleteEmpl.message,
			})
			refetchMember()
			setIsloading(false)
		}
	}, [statusDelete])

	useEffect(() => {
		if (statusHourlyRate == 'success' && dataHourlyRate) {
			setToast({
				type: 'success',
				msg: dataHourlyRate.message,
			})
			refetchMember()
			setIsloading(false)
		}
	}, [statusHourlyRate])

	

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Project member',

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
					Header: 'Employee Id',
					accessor: 'employeeId',
					minWidth: 180,
					width: 180,
					disableResizing: true,
				},
				{
					Header: 'Name',
					accessor: 'name',
					minWidth: 250,
					Cell: ({ value, row }) => {
						return (
							<HStack w={'full'} spacing={5}>
								<Avatar
									flex={'none'}
									size={'sm'}
									name={row.values['name']}
									src={row.original.avatar?.url}
								/>
								<VStack w={'70%'} alignItems={'start'}>
									<Text isTruncated w={'full'}>
										{value}
										{currentUser?.id == row.values['id'] && (
											<Badge
												marginLeft={'5'}
												color={'white'}
												background={'gray.500'}
											>
												It's you
											</Badge>
										)}
									</Text>
									<Text isTruncated w={'full'} fontSize={'sm'} color={'gray.400'}>
										Junior
									</Text>
								</VStack>
							</HStack>
						)
					},
				},
				{
					Header: 'hourly rate',
					accessor: 'hourly_rate_project',
					minWidth: 180,
					width: 180,
					Cell: ({ value, row }) => (
						<NumberInput
							min={1}
							precision={2}
							onChange={(value) => {
								clearTimeout(hourlyRateTimeOut)
								hourlyRateTimeOut = setTimeout(()=> {
									setHourlyRate({
										hourly_rate: Number(value),
										idEmployee: Number(row.values['id']),
										idProject: projectRsponse?.project?.id,
									})
									setIsloading(true)
								}, 500)
							}}
							defaultValue={Number(value.hourly_rate)}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					),
				},
				{
					Header: 'User role',
					accessor: 'role',
					minWidth: 180,
					width: 180,
					Cell: ({ row }) => {
						return (
							<HStack spacing={4}>
								<Radio
									onChange={(event) => {
										setProjectAdmin({
											idProject: projectId,
											idEmployee: row.values['id'],
										})
									}}
									isChecked={
										projectRsponse?.project?.project_Admin
											? projectRsponse.project.project_Admin.id ==
											  row.values['id']
											: false
									}
									value={row.values['id']}
								/>
								<Text>Project Admin</Text>
							</HStack>
						)
					},
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => (
						<Button
							onClick={() => {
								setIdEmployee(Number(row.values['id']))
								onOpenDl()
							}}
						>
							Delete
						</Button>
					),
				},
			],
		},
	]

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (allEmployees?.project) {
			allEmployees.project.employees = allEmployees.project?.employees?.map(
				(employee, key) => {
					return {
						...employee,
						hourly_rate_project: allEmployees.hourly_rate_projects[key],
					}
				}
			)
			setProject(allEmployees)
		}
	}, [allEmployees])

	useEffect(() => {
		if (projectRsponse) {
			setIsloading(false)
		}
	}, [projectRsponse])
	return (
		<div>
			<Table
				data={projectRsponse?.project?.employees || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={false}
				disableColumns={['department', 'designation']}
			/>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteEmployee({
						employeeId,
						projectId,
					})
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>
		</div>
	)
}

members.getLayout = ClientLayout

export default members
