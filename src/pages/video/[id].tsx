import { Avatar, Box, Flex, Text, Card, CardBody, CardHeader, Button, IconButton } from '@chakra-ui/react'
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
import { ViewIcon, TimeIcon, ExternalLinkIcon, DownloadIcon } from '@chakra-ui/icons'
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
  const creator = account.address ?? '0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab'
  const ensName = useEnsName({
    address: creator,
    chainId: 1,
  })
  const ensAvatar = useEnsAvatar({
    address: creator,
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
            <Flex gap={2}>
              <LinkComponent href={props.video.downloadUrl}>
                <IconButton variant="ghost" icon={<DownloadIcon />} aria-label="Download" />
              </LinkComponent>
              <LinkComponent
                href={`https://twitter.com/intent/tweet?url=${window?.location?.href}%0A%0A&text=${props.video.name} 📸%0A%0A&hashtags=archivooor`}>
                <Button leftIcon={<ExternalLinkIcon />} colorScheme="teal" variant="solid">
                  Share
                </Button>
              </LinkComponent>
            </Flex>
          </Flex>
          {ensAvatar.data ||
            (creator && (
              <Flex>
                <Avatar src={ensAvatar.data ?? makeBlockie(creator)} />
                <Box ml="3">
                  <Text fontWeight="bold">{ensName.data ?? creator}</Text>
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
            {props.video.cid && (
              <Box mt={2}>
                <LinkComponent href={`ipfs://${props.video.cid}`}>ipfs://{props.video.cid}</LinkComponent>
              </Box>
            )}
          </CardHeader>
          <CardBody>
            {props.video.description && <Text>{props.video.description}</Text>}

            {props.video.videoUrl && (
              <Box mt={8}>
                <LinkComponent href={props.video.videoUrl}>
                  &raquo; Original video ({dayjs.duration(props.video.start ?? 0, 'second').format('HH:mm:ss')})
                </LinkComponent>
              </Box>
            )}
          </CardBody>
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
