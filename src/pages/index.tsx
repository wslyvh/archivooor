import { BellIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, Button, Flex, Text } from '@chakra-ui/react'
import { VideoCard } from 'components/VideoCard'
import { Seo } from 'components/layout/Seo'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { Asset, Message } from 'types'
import { getAssets } from 'utils/livepeer'
import { Subscribe } from 'utils/push'
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
      <Flex as="section" flexDirection="column" align="end" width="100%" gap={4} my="4">
        {alert.type && alert.message && (
          <Alert status={alert.type} rounded={6}>
            <AlertIcon />
            {alert.message}
          </Alert>
        )}
        <Flex alignItems="center" gap={4}>
          <Button width="120px" size="sm" leftIcon={<BellIcon />} onClick={() => subscribe()} disabled={!account?.address}>
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
