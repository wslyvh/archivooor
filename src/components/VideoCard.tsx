import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack, Text, Image, IconButton, Flex } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { Asset } from 'types'
import { useAccount } from 'wagmi'
import { LinkComponent } from './layout/LinkComponent'
import { DownloadIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons'

interface Props {
  video: Asset
}

export function VideoCard(props: Props) {
  const account = useAccount()
  return (
    <Card flexBasis={['100%', '100%', '49%']}>
      <CardBody>
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
        <Stack mt="6" spacing="3">
          <LinkComponent href={`/video/${props.video.slug}`}>
            <Heading size="md">{props.video.name}</Heading>
          </LinkComponent>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup alignItems="center">
          <LinkComponent href={`/video/${props.video.slug}`}>
            <Button variant="solid" size="sm">
              Details
            </Button>
          </LinkComponent>

          <Flex gap={2} alignItems="center">
            <ViewIcon />
            <Text fontSize={['xs', 'sm']}>{props.video.viewCount} views</Text>
            <TimeIcon />
            <Text fontSize={['xs', 'sm']}>{Math.round(props.video.playtimeMins * 100) / 100} mins</Text>
          </Flex>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
