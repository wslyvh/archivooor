import { Avatar, Box, Flex, Text, Card, CardBody, CardHeader } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import dayjs from 'dayjs'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Asset } from 'types'
import { getAssets } from 'utils/livepeer'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import relativeTime from 'dayjs/plugin/relativeTime'
import makeBlockie from 'ethereum-blockies-base64'
dayjs.extend(relativeTime)

interface Props {
  video: Asset
}

interface Params extends ParsedUrlQuery {
  id: string
}

export default function Index(props: Props) {
  const account = useAccount()
  const ensName = useEnsName({
    address: account.address,
    chainId: 1,
  })
  const ensAvatar = useEnsAvatar({
    address: account.address,
    chainId: 1,
  })

  return (
    <>
      <Head />

      <main>
        <Player
          title={props.video.name}
          playbackId={props.video.playbackId}
          objectFit="cover"
          viewerId={account.address ?? 'unknown'}
          priority
          showTitle={false}
          autoUrlUpload={{ fallback: true }}
          showUploadingIndicator={true}
        />

        <Box as="section" my={4}>
          <HeadingComponent as="h2">{props.video.name}</HeadingComponent>

          <Flex>
            <Avatar src={ensAvatar.data ?? makeBlockie(account.address ?? '')} />
            <Box ml="3">
              <Text fontWeight="bold">{ensName.data ?? account.address}</Text>
              <Text fontSize="sm">4 videos</Text>
            </Box>
          </Flex>
        </Box>

        <Card>
          <CardHeader>
            <Text fontWeight="bold">{dayjs().to(props.video.createdAt)}</Text>
            <Text fontSize="sm">
              {props.video.viewCount} views / {Math.round(props.video.playtimeMins * 100) / 100} mins playtime
            </Text>
          </CardHeader>
          {props.video.description && (
            <CardBody>
              <Text>{props.video.description}</Text>
            </CardBody>
          )}
        </Card>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const assets = await getAssets()

  return {
    paths: assets.map((i) => ({ params: { id: i.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const assets = await getAssets()
  const video = assets.find((i) => i.slug === context.params?.id)

  if (!video) return { props: null, notFound: true }

  return {
    props: {
      video: video,
    },
    revalidate: 300,
  }
}
