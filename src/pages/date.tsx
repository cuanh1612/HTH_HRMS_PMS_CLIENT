import { Box, Button, Input } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'

export default function date() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const [selected, setSelected] = useState<any>()

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])
	return (
		<Box position={'relative'} w={'full'}>
			<Input w={'full'} placeholder={'YYYY/MM/DD'} />
			<DayPicker month={new Date()} mode="single" selected={selected} onSelect={setSelected} footer={
        <Box marginTop={2} display={'flex'} justifyContent={'end'} w={'full'} >
          <Button>
            To day
          </Button>
        </Box>
      } />
		</Box>
	)
}
