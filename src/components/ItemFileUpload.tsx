import { HStack, Img } from '@chakra-ui/react'
import * as React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

export interface IItemFileUploadProps {
	src: string
	fileName: string
	onRemoveFile?: (index: number) => void
	index: number
	url_file?: string
}

export default function ItemFileUpload({
	src,
	fileName,
	onRemoveFile,
	index,
	url_file,
}: IItemFileUploadProps) {
	return (
		<HStack
			border={'1px solid #80808050'}
			w={'full'}
			padding={5}
			borderRadius={5}
			justifyContent={'space-between'}
		>
			<HStack spacing={2}>
				<Img alt={'file_upload'} src={src} width={50} height={50} />
				{url_file ? (
					<div>
						<a className="color-3" href={url_file} download>
							{fileName}
						</a>
					</div>
				) : (
					<div>{fileName}</div>
				)}
			</HStack>
			{onRemoveFile && (
				<HStack>
					<AiOutlineCloseCircle
						style={{
							color: '#FF7070',
							fontSize: '24px',
							cursor: 'pointer',
						}}
						onClick={() => onRemoveFile(index)}
					/>
				</HStack>
			)}
		</HStack>
	)
}
