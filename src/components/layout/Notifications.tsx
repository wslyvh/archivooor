import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import { useAccount, useSigner } from 'wagmi'
import { GetNotifications, Subscribe } from 'utils/push'
import { Notification } from 'types'
import dayjs from 'dayjs'

interface Props {
  className?: string
}

export function Notifications(props: Props) {
  const account = useAccount()
  const className = props.className ?? ''
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const { data } = useSigner()
  const [notifications, setNotifications] = useState<Array<Notification>>([])

  useEffect(() => {
    async function getNotifications() {
      if (!account.address) return

      const notifications = await GetNotifications(account.address)
      setNotifications(notifications)
    }

    const interval = setInterval(() => {
      getNotifications()
    }, 5000)

    return () => clearInterval(interval)
  }, [account.address])

  async function subscribe() {
    if (account.address && data) {
      console.log('SUBSCRIBE', account.address, data)
      const sub = await Subscribe(account.address, data)
      console.log('SUB', sub)
      if (sub.status === 'success') {
        setNotifications([
          {
            id: `${dayjs().valueOf()}`,
            type: 'success',
            title: 'Success',
            message: 'Successfully subscribed',
          },
          ...notifications,
        ])
        return
      }
    }

    setNotifications([
      {
        id: `${dayjs().valueOf()}`,
        type: 'error',
        title: 'Error',
        message: 'Unable to subscribe. Please try again later',
      },
      ...notifications,
    ])
  }

  if (!account.address) return null

  return (
    <Box className={className} _hover={{ cursor: 'pointer' }} ref={btnRef.current} onClick={onOpen}>
      <IconButton
        colorScheme={
          'gray' // or teal / remove for new notifications
        }
        icon={<BellIcon />}
        aria-label="Notifications"
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef.current}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody>
            <Flex flexDirection="column" gap={4}>
              {notifications?.map((i) => {
                return (
                  <Alert key={i.id} status={i.type as any} rounded={6}>
                    <Box m={2}>
                      <AlertIcon />
                    </Box>
                    <Box>
                      <AlertTitle>{i.title}</AlertTitle>
                      <AlertDescription>{i.message}</AlertDescription>
                    </Box>
                  </Alert>
                )
              })}
            </Flex>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={subscribe}>Subscribe</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
