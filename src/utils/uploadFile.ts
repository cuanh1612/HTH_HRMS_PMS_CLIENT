import { ICloudinaryImg, IImgCrop } from 'type/fileType'
interface IUploadFile {
	files: File[]
	tags: string[]
	folder?: string
	options?: IImgCrop
	upload_preset: string
	raw: boolean
}
export const uploadFile = async ({ files, tags, folder, options, upload_preset, raw }: IUploadFile) => {
	let data: any = []
	await Promise.all(
		files.map(async (file) => {
			return new Promise(async (resolve) => {
				const formData = new FormData()
				formData.append('file', file)
			
					formData.append(
						'upload_preset',
						`${upload_preset}`
					)
				if (folder) {
					formData.set('public_id', `${folder}/${file.name}`)
				}
				formData.append('api_key', `${process.env.NEXT_PUBLIC_API_KEY}`)
				formData.append('cloud_name', `${process.env.NEXT_PUBLIC_API_CLOUD_NAME}`)

				tags.map((tag: any) => {
					formData.append('tags[]', tag)
				})
				console.log( String(process.env.NEXT_PUBLIC_API_URL_IMG), String(process.env.NEXT_PUBLIC_API_URL_RAW))
				const result = await fetch(
					!raw
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
	if (!raw && options) {
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

export const uploadBase64 = async (upload_preset: string, file: string, tags?: String[]) => {
	const formData = new FormData()
	formData.append('file', file)

	formData.append('upload_preset', `${upload_preset}`)

	formData.append('api_key', `${process.env.NEXT_PUBLIC_API_KEY}`)
	formData.append('cloud_name', `${process.env.NEXT_PUBLIC_API_CLOUD_NAME}`)

	tags &&
		tags.map((tag: any) => {
			formData.append('tags[]', tag)
		})

	const result = await fetch(String(process.env.NEXT_PUBLIC_API_URL_IMG), {
		method: 'POST',
		body: formData,
	}).then((e) => e.json())

	return {
		public_id: result.public_id,
		url: result.secure_url,
	}
}

//Base64 url image
async function parseURI(d: Blob) {
	var reader = new FileReader()
	reader.readAsDataURL(d)
	return new Promise((res) => {
		reader.onload = (e) => {
			if (e.target) {
				res(e.target.result)
			}
		}
	})
}

export async function getDataBlob(url: string) {
	var res = await fetch(url)
	var blob = await res.blob()
	var uri = await parseURI(blob)
	return uri
}
