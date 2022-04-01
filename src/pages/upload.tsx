import UploadAvatar from 'components/form/UploadAvatar'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { IImg, ICloudinaryImg} from 'type/fileType'
import { uploadFile } from 'utils/uploadFile'

export default function upload() {
	const { handleLoading, isAuthenticated } = useContext(AuthContext)
	const router = useRouter()
	const [infoImg, setInfoImg] = useState<IImg>()

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated == false) {
				router.push('/login')
			}
		}
	})

	const handleUpload = async() => {
		if(infoImg){
			const data: Array<ICloudinaryImg> = await uploadFile(infoImg.files,['f'],true, undefined, infoImg.options)
		}
	}

	return (
		<>
			<UploadAvatar
				setInfoImg={(data?: IImg) => {
					setInfoImg(data)
				}}
			/>
		</>
	)
}
