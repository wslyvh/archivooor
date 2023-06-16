import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading } from '@chakra-ui/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import { Notifications } from './Notifications'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={2} mb={8} alignItems="center">
      <Flex gap={4}>
        <LinkComponent href="/">
          <Heading as="h1" size="md">
            📸
          </Heading>
        </LinkComponent>
        <LinkComponent href="/add">Add</LinkComponent>
      </Flex>
      <Spacer />

      <Flex alignItems="center" gap={4}>
        <Notifications />
        <ConnectKitButton />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
