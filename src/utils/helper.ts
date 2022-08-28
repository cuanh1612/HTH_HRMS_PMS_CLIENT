import { Options } from 'intro.js'
import { dataTypeFile } from './basicData'

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

export const optionIntro = (path: string, colorMode: string): Options => {
	const classes =
		colorMode == 'dark'
			? {
					highlightClass: 'introHighlight-dark',
					buttonClass: 'introButton-dark',
					tooltipClass: 'introTooltip-dark',
			  }
			: {
					highlightClass: 'introHighlight',
					buttonClass: 'introButton',
					tooltipClass: 'introTooltip',
			  }

	switch (path) {
		case '/dashboard':
			return {
				...classes,
				steps: [
                    
					{
						element: document.querySelector('.card-demo') || undefined,
						intro: 'This step focuses on an image',
					},
					{
						title: 'Farewell!',
						element: document.querySelector('.card-demo1') || undefined,
						intro: 'And this is our final step!',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}
		case '/private-dashboard':
			return {
				...classes,
				steps: [
                    {
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.card-demo') || undefined,
						intro: 'This step focuses on an image',
					},
					{
						title: 'Farewell!',
						element: document.querySelector('.card-demo1') || undefined,
						intro: 'And this is our final step!',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],

			}

		default:
			return {}
	}
}
