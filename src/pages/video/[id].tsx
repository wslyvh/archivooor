import { Avatar, Box, Flex, Text, Card, CardBody, CardHeader, Button } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import dayjs from 'dayjs'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Asset } from 'types'
import { getAssets } from 'utils/livepeer'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import makeBlockie from 'ethereum-blockies-base64'
import { ViewIcon, TimeIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { LinkComponent } from 'components/layout/LinkComponent'
import { NextSeo, VideoJsonLd } from 'next-seo'
import { SITE_DESCRIPTION, SITE_NAME, SOCIAL_TWITTER } from 'utils/config'

dayjs.extend(relativeTime)
dayjs.extend(duration)

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
          <Flex justifyContent="space-between" alignItems="center" mt={6} mb={2}>
            <HeadingComponent as="h2" size="lg">
              {props.video.name}
            </HeadingComponent>
            <LinkComponent
              href={`https://twitter.com/intent/tweet?url=${window?.location?.href}%0A%0A&text=${props.video.name} 📸%0A%0A&hashtags=archivooor`}>
              <Button leftIcon={<ExternalLinkIcon />} colorScheme="teal" variant="solid">
                Share
              </Button>
            </LinkComponent>
          </Flex>
          {ensAvatar.data ||
            (account.address && (
              <Flex>
                <Avatar src={ensAvatar.data ?? makeBlockie(account.address)} />
                <Box ml="3">
                  <Text fontWeight="bold">{ensName.data ?? account.address}</Text>
                  <Text fontSize="sm">4 videos</Text>
                </Box>
              </Flex>
            ))}
        </Box>

        <Card>
          <CardHeader>
            <Flex gap={2} alignItems="center" flexWrap="wrap">
              <Text fontWeight="bold" mr={4} flexShrink={0}>
                {dayjs().to(props.video.createdAt)}
              </Text>
              <Flex alignItems="center" gap={2} flexShrink={0}>
                <ViewIcon />
                <Text fontSize="sm">{props.video.viewCount} views</Text>
                <TimeIcon />
                <Text fontSize="sm">{Math.round(props.video.playtimeMins * 100) / 100} mins played</Text>
              </Flex>
            </Flex>
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
