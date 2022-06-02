import { HStack, Img, Menu, MenuButton, MenuItem, MenuList, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { BsThreeDotsVertical, BsTrash } from 'react-icons/bs'

export interface IItemContractFileProps {
	name: string
	srcImg: string
	urlFile: string
	onDeleteFile: (contractFileId: number) => void
	contractFileId: number
	isChange?: boolean
}

export const ItemContractFile = ({
	name,
	srcImg,
	urlFile,
	onDeleteFile,
	contractFileId,
	isChange = true,
}: IItemContractFileProps) => {
	return (
		<HStack w={'full'} justify={'space-between'}>
			<HStack overflow={'hidden'}>
				<Img alt={name} src={srcImg} w={50} height={70} />
				<VStack w="full" align={'start'} overflow={'hidden'}>
					<Text isTruncated>{name}</Text>
					<Text fontSize={14} color={'gray.400'}>
						<HStack>
							<AiOutlineDownload fontSize={15} />
							<a href={urlFile} download target={'_blank'}>
								Download
							</a>
						</HStack>
					</Text>
				</VStack>
			</HStack>

			{isChange && (
				<Menu placement="top-end">
					<MenuButton>
						<BsThreeDotsVertical />
					</MenuButton>
					<MenuList>
						<MenuItem
							icon={<BsTrash fontSize={15} />}
							onClick={() => onDeleteFile(contractFileId)}
						>
							Delete
						</MenuItem>
					</MenuList>
				</Menu>
			)}
		</HStack>
	)
}
