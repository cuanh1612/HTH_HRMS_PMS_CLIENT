import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
})

const theme = extendTheme({
	colors: {
		black: '#16161D',
		'hu-Pink': {
			light: '#FFF7F6',
			lightH: '#FFF2F2',
			lightA: '#FFE5E4',
			normal: '#FFAAA7',
			normalH: '#E69996',
			normalA: '#CC8886',
			dark: '#BF807D',
			darkH: '#996664',
			darkA: '#734C4B',
			darker: '#593B3A'
		},
		'hu-GreenN': {
			light: '#FBFDF9',
			lightH: '#F9FCF6',
			lightA: '#F2F9EC',
			normal: '#D5ECC2',
			normalH: '#C0D4AF',
			normalA: '#AABD9B',
			dark: '#A0B192',
			darkH: '#808E74',
			darkA: '#606A57',
			darker: '#4B5344'
		},
		'hu-Green': {
			light: '#E6F6F4',
			lightH: '#D9F2EF',
			lightA: '#B0E4DD',
			normal: '#00A991',
			normalH: '#009883',
			normalA: '#008774',
			dark: '#007F6D',
			darkH: '#006557',
			darkA: '#004C41',
			darker: '#003B33'
		},
		'hu-Lam': {
			light: '#FFFBF8',
			lightH: '#FFF8F4',
			lightA: '#FFF1E8',
			normal: '#FFD3B4',
			normalH: '#E6BEA2',
			normalA: '#CCA990',
			dark: '#BF9E87',
			darkH: '#997F6C',
			darkA: '#735F51',
			darker: '#594A3F'
		}
	},
	fonts,
	breakpoints,
})

export default theme
