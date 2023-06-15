import { BellIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, Button, Flex, Text } from '@chakra-ui/react'
import { VideoCard } from 'components/VideoCard'
import { Head } from 'components/layout/Head'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { Asset, Message } from 'types'
import { getAssets } from 'utils/livepeer'
import { GetNotifications, Subscribe } from 'utils/push'
import { useAccount, useSigner } from 'wagmi'

interface Props {
  assets: Asset[]
}

export default function Index(props: Props) {
  const account = useAccount()
  const { data } = useSigner()
  const [alert, setAlert] = useState<Message>({
    type: 'info',
    message: '',
  })

  useEffect(() => {
    async function getNotifications() {
      console.log('Get Notifications')
      const notifs = await GetNotifications()
      console.log(notifs)
    }

    getNotifications()
  }, [])

  async function subscribe() {
    if (account.address && data) {
      const sub = await Subscribe(account.address, data)

      if (sub.status === 'success') {
        setAlert({ type: 'success', message: 'Successfully subscribed' })
      } else {
        setAlert({ type: 'error', message: 'Unable to subscribe. Please try again later' })
      }

      return
    }

    setAlert({ type: 'info', message: 'Please connect your account first' })
  }

  return (
    <>
      <Head />

      <Flex as="section" flexDirection="column" align="end" width="100%" gap={4} my="4">
        {alert.type && alert.message && (
          <Alert status={alert.type} rounded={6}>
            <AlertIcon />
            {alert.message}
          </Alert>
        )}
        <Flex alignItems="center" gap={4}>
          <Text>Get notified of new videos</Text>
          <Button width="140px" size="md" leftIcon={<BellIcon />} onClick={() => subscribe()}>
            Subscribe
          </Button>
        </Flex>
      </Flex>
      <main>
        <Flex as="section" gap={4} wrap="wrap">
          {props.assets.map((asset) => {
            return <VideoCard key={asset.id} video={asset} />
          })}
        </Flex>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const assets = await getAssets()

  return {
    props: {
      assets: assets,
    },
    revalidate: 300,
  }
}
