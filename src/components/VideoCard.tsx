import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack, Text, Image } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { Asset } from 'types'
import { useAccount } from 'wagmi'
import { LinkComponent } from './layout/LinkComponent'

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
          autoUrlUpload={{ fallback: true }}
          showUploadingIndicator={true}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{props.video.name}</Heading>
          {props.video.description && <Text>{props.video.description}</Text>}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup gap="2" alignItems="center">
          <LinkComponent href={props.video.downloadUrl}>
            <Button variant="solid" size="sm">
              Download
            </Button>
          </LinkComponent>
          <Text fontSize="sm">{props.video.viewCount} views</Text>
          {/* <Button variant="ghost" size="sm">
            Add to cart
          </Button> */}
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
