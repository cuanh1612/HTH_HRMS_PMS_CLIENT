import { Box, useBreakpoint } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import Slider from 'react-slick'

export const LeftBar = ({ children }: { children: ReactNode }) => {
    const layoutSize = useBreakpoint()
    const setting = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 5,
		initialSlide: 0,
		arrows: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				},
			},
			{
				breakpoint: 815,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 550,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			}
		],
	}



	return (
		<Box
			height={['auto', null, null, 'calc( 100% - 35px )']}
			pt={5}
			w={['full', null, null, '310px']}
			pos={'relative'}
			overflow={[null, null, null, 'auto']}
			pr={[null, null, null, '10px']}
		>
            {
                !layoutSize?.includes('xl') && !layoutSize?.includes('lg') ? (
                    <Slider {...setting}>
                        {children}
                    </Slider>
                ): (<>{children}</>)
            }
		</Box>
	)
}
