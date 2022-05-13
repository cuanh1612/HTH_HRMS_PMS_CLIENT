import { dataTypeFile } from "./basicData"

//Generate img type file
export const generateImgFile = (nameFile: string) => {
    const nameSplit = nameFile.split('.')
    let typeFile = nameSplit[nameSplit.length - 1]
    console.log(typeFile)

    if (!dataTypeFile.includes(typeFile)) {
        typeFile = 'other'
    }

    return `/assets/files/${typeFile}.svg`
}
