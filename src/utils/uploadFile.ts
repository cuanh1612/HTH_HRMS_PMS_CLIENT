import { ICloudinaryImg, IImgCrop } from 'type/fileType'

export const uploadFile = async (
	files: File[],
	tags: String[],
	avatar: boolean,
	folder?: string,
	options?: IImgCrop
) => {
	let data: any = []
	await Promise.all(
		files.map(async (file) => {
			return new Promise(async (resolve) => {
				const formData = new FormData()
				formData.append('file', file)
				if (avatar) {
					formData.append(
						'upload_preset',
						`${process.env.NEXT_PUBLIC_UPLOAD_PRESET_AVATAR}`
					)
				} else {
					formData.append('upload_preset', `${process.env.NEXT_PUBLIC_UPLOAD_PRESET}`)
					formData.set('public_id', `${folder}/${file.name}`)
				}
				formData.append('api_key', `${process.env.NEXT_PUBLIC_API_KEY}`)
				formData.append('cloud_name', `${process.env.NEXT_PUBLIC_API_CLOUD_NAME}`)

				tags.map((tag: any) => {
					formData.append('tags[]', tag)
				})

				const result = await fetch(
					avatar
						? String(process.env.NEXT_PUBLIC_API_URL_IMG)
						: String(process.env.NEXT_PUBLIC_API_URL_RAW),
					{
						method: 'POST',
						body: formData,
					}
				).then((e) => e.json())
				data.push({
					public_id: result.public_id,
					url: result.secure_url,
					name: file.name,
				})
				resolve(result)
			})
		})
	)
	if (avatar && options) {
		data = data.map((item: ICloudinaryImg) => {
			item.url = item.url.replace(
				'upload',
				`upload/c_crop,h_${options.height},w_${options.width},x_${options.x},y_${options.y}`
			)
			return item
		})
		return data
	}
	return data
}

export const uploadBase64 = async (file: string, tags: String[]) => {
	const formData = new FormData()
	formData.append('file', file)
	
	formData.append('upload_preset', `${process.env.NEXT_PUBLIC_UPLOAD_PRESET_SIGN}`)
	
	formData.append('api_key', `${process.env.NEXT_PUBLIC_API_KEY}`)
	formData.append('cloud_name', `${process.env.NEXT_PUBLIC_API_CLOUD_NAME}`)
	
	tags.map((tag: any) => {
		formData.append('tags[]', tag)
	})

	const result = await fetch(String(process.env.NEXT_PUBLIC_API_URL_IMG), {
		method: 'POST',
		body: formData,
	}).then((e) => e.json())
	console.log('thanh cong')

	return result
}
