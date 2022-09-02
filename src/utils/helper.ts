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
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.information') || undefined,
						intro: 'Information off the whole system',
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
						element: document.querySelector('.information') || undefined,
						intro: 'Information off this account',
					},
					{
						element: document.querySelector('.basic-info') || undefined,
						intro: 'Basic information and items relate this account',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}
		case '/clients':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage clients',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all clients off system',
					},
					{
						intro: '<p>Function to manage client</p><img src = "/assets/functionClient.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}
		case '/salaries':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage salaries',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all salaries off system',
					},
					{
						intro: '<p>Function to manage salary</p><img src = "/assets/functionSalary.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/employees':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage employees',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all employees off system',
					},
					{
						intro: '<p>Function to manage employee</p><img src = "/assets/functionEmployee.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/leaves':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage leaves',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all leaves off system',
					},
					{
						intro: '<p>Function to manage leave</p><img src = "/assets/functionLeave.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/attendance':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage attendance',
					},
					{
						element: document.querySelector('.caption') || undefined,
						intro: 'Caption icons',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all attendance off system',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/holidays':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage holidays',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all holidays off system',
					},
					{
						intro: '<p>Function to manage holiday</p><img src = "/assets/functionHoliday.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/contracts':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage contracts',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all contracts off system',
					},
					{
						intro: '<p>Function to manage contract</p><img src = "/assets/functionContract.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/projects':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage projects',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all projects off system',
					},
					{
						intro: '<p>Function to manage project</p><img src = "/assets/functionProject.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/tasks':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage tasks',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all tasks off system',
					},
					{
						intro: '<p>Function to manage task</p><img src = "/assets/functionTask.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/time-logs':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage time logs',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all time logs off system',
					},
					{
						intro: '<p>Function to manage time log</p><img src = "/assets/functionTimeLog.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/notice-boards':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage notice boards',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all notice boards off system',
					},
					{
						intro: '<p>Function to manage notice boards</p><img src = "/assets/functionNoticeBoard.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/dashboard-jobs':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.information') || undefined,
						intro: 'Information off recruit',
					},
					{
						element: document.querySelector('.basic-info') || undefined,
						intro: 'Basic information and items relate recruit',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}

		case '/skills':
			return {
				...classes,
				steps: [
					{
						intro: 'This step focuses on an image',
					},
					{
						element: document.querySelector('.function') || undefined,
						intro: 'Function to manage skills',
					},
					{
						element: document.querySelector('.table') || undefined,
						intro: 'List all skills off system',
					},
					{
						intro: '<p>Function to manage skill</p><img src = "/assets/functionSkill.png"/>',
					},
					{
						intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
					},
				],
			}
		
			case '/jobs':
				return {
					...classes,
					steps: [
						{
							intro: 'This step focuses on an image',
						},
						{
							element: document.querySelector('.function') || undefined,
							intro: 'Function to manage jobs',
						},
						{
							element: document.querySelector('.table') || undefined,
							intro: 'List all jobs off system',
						},
						{
							intro: '<p>Function to manage job</p><img src = "/assets/functionJob.png"/>',
						},
						{
							intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
						},
					],
				}
			
				case '/job-applications':
					return {
						...classes,
						steps: [
							{
								intro: 'This step focuses on an image',
							},
							{
								element: document.querySelector('.function') || undefined,
								intro: 'Function to manage job applications',
							},
							{
								element: document.querySelector('.table') || undefined,
								intro: 'List all job applications off system',
							},
							{
								intro: '<p>Function to manage job application</p><img src = "/assets/functionJobApplication.png"/>',
							},
							{
								intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
							},
						],
					}
				
					case '/job-offer-letters':
						return {
							...classes,
							steps: [
								{
									intro: 'This step focuses on an image',
								},
								{
									element: document.querySelector('.function') || undefined,
									intro: 'Function to manage job offer letters',
								},
								{
									element: document.querySelector('.table') || undefined,
									intro: 'List all job offer letters off system',
								},
								{
									intro: '<p>Function to manage job offer letter</p><img src = "/assets/functionOfferLetter.png"/>',
								},
								{
									intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
								},
							],
						}

						case '/interviews':
							return {
								...classes,
								steps: [
									{
										intro: 'This step focuses on an image',
									},
									{
										element: document.querySelector('.function') || undefined,
										intro: 'Function to manage interviews letters',
									},
									{
										element: document.querySelector('.table') || undefined,
										intro: 'List all job interviews off system',
									},
									{
										intro: '<p>Function to manage interview</p><img src = "/assets/functionInterview.png"/>',
									},
									{
										intro: '<img src="https://i.giphy.com/media/ujUdrdpX7Ok5W/giphy.webp" onerror="this.onerror=null;this.src=\'https://i.giphy.com/ujUdrdpX7Ok5W.gif\';" alt="">',
									},
								],
							}

							case '/rooms':
								return {
									...classes,
									steps: [
										{
											intro: 'This step focuses on an image',
										},
										{
											element: document.querySelector('.function') || undefined,
											intro: 'Function to manage rooms',
										},
										{
											intro: '<p>Function to manage room</p><img src = "/assets/functionRoom.png"/>',
										},
										{
											intro: '<p>Click this button to join room</p><img src = "/assets/joinRoom.png"/>',
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
