import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useBreakpoint } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import Slider from 'react-slick'

export const LeftBar = ({ children, isOpen, onClose }: { children: ReactNode; isOpen: boolean; onClose: any }) => {
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
			}
		],
	}

    if(layoutSize?.includes('sm') || layoutSize?.includes('base')) {
        return (
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton color={'white'} />
				<DrawerHeader bg={'#2b2d2e'} color={'white'}>Another</DrawerHeader>

				<DrawerBody pb={6} paddingInline={'10px'} bg={'#2b2d2e'}>
						{children}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
        )
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
