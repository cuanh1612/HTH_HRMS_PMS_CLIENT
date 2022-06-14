import { Box, Button, HStack, useDisclosure } from '@chakra-ui/react'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { CSSProperties, useContext, useState } from 'react'
import { AiOutlineCaretUp, AiOutlineCheck } from 'react-icons/ai'
import { FaFileCsv } from 'react-icons/fa'
import { MdOutlineRemove } from 'react-icons/md'
import { formatFileSize, useCSVReader } from 'react-papaparse'

//Style Import CSV
const styles = {
	zone: {
		alignItems: 'center',
		border: `1px dashed #009F9D`,
		borderRadius: 5,
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
		padding: 20,
		cursor: 'pointer',
	} as CSSProperties,
}

export interface IImportCSVProps {
	fieldsValid: string[]
	handleImportCSV: (data: any) => void
	statusImport: boolean
	isOpenImportCSV: boolean
	onOpenImportCSV: () => void
	onCloseImportCSV: () => void
}

export default function ImportCSV({
	fieldsValid,
	handleImportCSV,
	statusImport,
	isOpenImportCSV,
	onOpenImportCSV,
	onCloseImportCSV,
}: IImportCSVProps) {
	///setting for import csv--------------------------------------------------
	//State data covert from csv
	const [dataImportCSV, setDataImportCSV] = useState<any>(null)

	const { CSVReader } = useCSVReader()

	const { setToast } = useContext(AuthContext)

	//Conver data array[array[]] to array[object]
	const convertData = (data: [][]) => {
		let result = []
		for (let index = 1; index < data.length; index++) {
			let arrItem = data[index]
			const arrItemConver = {
				index: index,
			}
			for (let index = 0; index < arrItem.length; index++) {
				arrItemConver[data[0][index]] = arrItem[index]
			}
			result.push(arrItemConver)
		}
		return result
	}

	return (
		<>
			<Button
				transform={'auto'}
				bg={'hu-Green.lightA'}
				_hover={{
					bg: 'hu-Green.normal',
					color: 'white',
					scale: 1.05,
				}}
				color={'hu-Green.normal'}
				leftIcon={<FaFileCsv />}
				onClick={onOpenImportCSV}
			>
				Import csv
			</Button>

			<Modal
				size="3xl"
				isOpen={isOpenImportCSV}
				onOpen={onOpenImportCSV}
				onClose={onCloseImportCSV}
				title="Import CSV"
			>
				<Box p={6}>
					<CSVReader
						onUploadAccepted={({ data }: any) => {
							if (data && Array.isArray(data)) {
								//initial check valid fields
								let acceptFile: boolean = true

								// Check field data
								;(data[0] as string[]).forEach((field) => {
									if (!fieldsValid.includes(field)) {
										acceptFile = false
									}
								})

								// Check if valid field false
								if (!acceptFile) {
									setToast({
										msg: `Your data CSV must have all field inclue ${fieldsValid.toString()}`,
										type: 'warning',
									})
								} else {
									if (data.length != 0) {
										const dataConvert = convertData(data)
										setDataImportCSV(dataConvert)
									}
								}
							}
						}}
					>
						{({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
							<>
								<div {...getRootProps()} style={styles.zone}>
									{acceptedFile ? (
										<>
											<HStack w={'100%'} justifyContent={'space-between'}>
												<HStack>
													<img
														width={50}
														height={50}
														src={'/assets/files/excel.svg'}
														alt={'File svg'}
													/>
													<Box>
														<span>
															{formatFileSize(acceptedFile.size)}{' '}
														</span>
														<span>{acceptedFile.name}</span>
													</Box>
												</HStack>
												<HStack
													align="center"
													borderRadius={'50%'}
													border={'2px solid #FF7070'}
													w={30}
													h={30}
													justifyContent={'center'}
												>
													<div {...getRemoveFileProps()}>
														<MdOutlineRemove
															color="red"
															onClick={() => {
																setDataImportCSV(null)
															}}
														/>
													</div>
												</HStack>
											</HStack>
										</>
									) : (
										'Drop CSV file here or click to upload'
									)}
								</div>
							</>
						)}
					</CSVReader>

					{dataImportCSV && (
						<HStack w={'full'} justifyContent={'end'}>
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
								onClick={() => handleImportCSV(dataImportCSV)}
								disabled={statusImport}
							>
								Save
							</Button>
						</HStack>
					)}
				</Box>
			</Modal>
		</>
	)
}
