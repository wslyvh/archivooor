import { Box, Button, Flex, FormControl, FormLabel, Input, ListItem, UnorderedList } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import dayjs from 'dayjs'
import { GetStaticProps } from 'next'
import duration from 'dayjs/plugin/duration'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Asset, Video } from 'types'
import { getAssets } from 'utils/livepeer'
dayjs.extend(duration)

interface Props {
  assets: Asset[]
}

export default function Index(props: Props) {
  const account = useAccount()
  const [selected, setSelected] = useState(props.assets[0])
  const [video, setVideo] = useState<Video>({
    name: '',
    description: '',
    start: 0,
    end: 0,
    videoUrl: '',
  })

  async function submit() {
    console.log('Submitting task..')
    if (!video?.name || !video?.start || !video?.end) return

    console.log('POST /api/tasks')
    const response = await fetch(`/api/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        ...video,
        videoUrl: selected.playbackUrl,
        creator: account.address ?? '',
        created: dayjs().valueOf(),
      }),
    })
  }

  return (
    <>
      <Head />

      <Flex as="main" color="white">
        <Box flex="1">
          <Player
            title={selected.name}
            playbackId={selected.playbackId}
            objectFit="cover"
            viewerId={account.address ?? 'unknown'}
            priority
            autoUrlUpload={{ fallback: true }}
            showUploadingIndicator={true}
          />
        </Box>
        <Box>
          <HeadingComponent as="h4">Sessions</HeadingComponent>
          <UnorderedList spacing={2}>
            {props.assets.map((i) => {
              return (
                <ListItem key={i.playbackId} onClick={() => setSelected(i)}>
                  {i.name}, {dayjs(i.createdAt).format('MMM DD HH:mm')} -{' '}
                  {dayjs
                    .duration(i.duration, 'seconds')
                    .format('H[h] m[m]')
                    .replace(/\b0+[a-z]+\s*/gi, '')
                    .trim()}
                </ListItem>
              )
            })}
          </UnorderedList>
        </Box>
      </Flex>

      <Flex flexDir="column" my="4" gap={2}>
        <HeadingComponent as="h4">Create new video</HeadingComponent>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Name" value={video.name} onChange={(e) => setVideo({ ...video, name: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input placeholder="Description" value={video.description} onChange={(e) => setVideo({ ...video, description: e.target.value })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Start time</FormLabel>
          <Input placeholder="Start time (in seconds)" value={video.start} onChange={(e) => setVideo({ ...video, start: Number(e.target.value) })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>End time</FormLabel>
          <Input placeholder="End time (in seconds)" value={video.end} onChange={(e) => setVideo({ ...video, end: Number(e.target.value) })} />
        </FormControl>
        <FormControl isDisabled>
          <FormLabel>Creator</FormLabel>
          <Input placeholder="0x" value={account.address} />
        </FormControl>

        <Button onClick={() => submit()}>Create</Button>
      </Flex>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const assets = await getAssets(true)

  // if (process.env.NODE_ENV !== 'production') {
  //   assets.unshift({
  //     id: 'test-asset-id',
  //     name: 'Agent 327 (TEST)',
  //     createdAt: dayjs().valueOf(),
  //     duration: 231,
  //     playbackId: 'f5eese9wwl88k4g8',
  //     playbackUrl: `https://lp-playback.com/hls/${'f5eese9wwl88k4g8'}/index.m3u8`,
  //     downloadUrl: '',
  //     cid: '',
  //   })
  // }

  return {
    props: {
      assets: assets,
    },
  }
}
