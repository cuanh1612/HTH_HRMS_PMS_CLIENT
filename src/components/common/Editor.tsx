import { useColorMode } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })


interface IEditor {
    note: string,
    onChangeNote: any
}

export const Editor = ({note, onChangeNote}: IEditor) => {
    const {colorMode} = useColorMode()
	return (
		<ReactQuill
			className={colorMode == 'dark' ? 'quillDark': 'quillLight'}
			placeholder="Enter you text"
			modules={{
				toolbar: [
					['bold', 'italic', 'underline', 'strike'], // toggled buttons
					['blockquote', 'code-block'],

					[{ header: 1 }, { header: 2 }], // custom button values
					[{ list: 'ordered' }, { list: 'bullet' }],
					[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
					[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
					[{ direction: 'rtl' }], // text direction

					[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
					[{ header: [1, 2, 3, 4, 5, 6, false] }],

					[{ color: [] }, { background: [] }], // dropdown with defaults from theme
					[{ font: [] }],
					[{ align: [] }],

					['clean'], // remove formatting button
				],
			}}
			value={note}
			onChange={onChangeNote}
		/>
	)
}
