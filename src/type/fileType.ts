export interface IImgCrop {
	height: number
	width: number
	x: number
	y: number
}

export interface IImg {
	files: File[]
	options: IImgCrop
}

export type HandleImg = (data: IImg)=> void 

export interface ICloudinaryImg {
    url: string
    public_id: string
    name: string
}