// custom loading
import ClipLoader from 'react-spinners/BarLoader'
import { css } from '@emotion/react'
import { Center } from '@chakra-ui/layout'

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`

export const Loading = ()=> {
	return (
		<Center
			bg={'#FFFFFF95'}
			w={'full'}
			height={'full'}
			pos={'absolute'}
			top={'0px'}
			left={'0px'}
            backdropBlur={"3xl"}
            zIndex={10}
		>
			<ClipLoader color={'green'} loading={true} css={override} width="200px" />
		</Center>
	)
}
