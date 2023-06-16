import React from 'react'
import { Box } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'

interface Props {
  className?: string
}

export function Notifications(props: Props) {
  const className = props.className ?? ''

  return (
    <Box className={className} _hover={{ cursor: 'pointer' }}>
      <BellIcon />
    </Box>
  )
}
