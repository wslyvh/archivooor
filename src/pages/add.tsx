import { Alert, AlertIcon, Box, Button, Checkbox, Flex, FormControl, FormLabel, Input, ListItem, UnorderedList } from '@chakra-ui/react'
import { Player } from '@livepeer/react'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import dayjs from 'dayjs'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { Asset, Message, Video } from 'types'
import { getAssets } from 'utils/livepeer'
import { Subscribe } from 'utils/push'
import { Seo } from 'components/layout/Seo'

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
  const [selected, setSelected] = useState(props.assets[0])
  const [subscribe, setSubscribe] = useState(true)
  const [video, setVideo] = useState<Video>({
    name: '',
    description: '',
    start: 0,
    end: 0,
    videoUrl: '',
  })

  async function submit() {
    console.log('Submitting task..')
    if (!video?.name || !video?.start || video?.start === 0 || !video?.end || video?.end === 0 || !account.address) {
      setAlert({ type: 'warning', message: 'Please fill in required fields' })
      return
    }

    console.log('POST /api/tasks')
    setAlert({ type: '', message: '' })
    // const response = {
    //   status: 200,
    // }
    const response = await fetch(`/api/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        ...video,
        videoUrl: selected.playbackUrl,
        creator: account.address ?? '',
        created: dayjs().valueOf(),
      }),
    })

    // Subscribe to updates
    if (data && subscribe) await Subscribe(account.address, data)

    if (response.status !== 200) {
      setAlert({ type: 'error', message: 'Unable to process your task. Please check your inputs and try again' })
    } else {
      setAlert({ type: 'success', message: 'Task submitted. Processing can take up to 1 hour depending on selected inputs' })
    }
  }

  return (
    <>
      <Flex as="main" flexWrap="wrap">
        <Box flex="1" minW="200px">
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
        <Box m={4}>
          <HeadingComponent as="h4">Sessions</HeadingComponent>
          <UnorderedList spacing={2}>
            {props.assets.map((i) => {
              return (
                <ListItem key={i.playbackId} _hover={{ cursor: 'pointer' }} onClick={() => setSelected(i)}>
                  {i.name}, {dayjs(i.createdAt).format('MMM DD')}
                </ListItem>
              )
            })}
          </UnorderedList>
        </Box>
      </Flex>

      <Flex flexDir="column" my="4" gap={2}>
        <HeadingComponent as="h4">Clip new video</HeadingComponent>

        {alert.type && alert.message && (
          <Alert status={alert.type} rounded={6}>
            <AlertIcon />
            {alert.message}
          </Alert>
        )}
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Name" value={video.name} onChange={(e) => setVideo({ ...video, name: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input placeholder="Description" value={video.description} onChange={(e) => setVideo({ ...video, description: e.target.value })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Start time (in seconds)</FormLabel>
          <Input placeholder="Start time (in seconds)" value={video.start} onChange={(e) => setVideo({ ...video, start: Number(e.target.value) })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>End time (in seconds)</FormLabel>
          <Input placeholder="End time (in seconds)" value={video.end} onChange={(e) => setVideo({ ...video, end: Number(e.target.value) })} />
        </FormControl>
        <FormControl isRequired isDisabled>
          <FormLabel>Creator</FormLabel>
          <Input placeholder="Please connect your account first.." value={account.address} />
        </FormControl>

        <FormControl>
          <Checkbox defaultChecked={true} checked={subscribe} onChange={() => setSubscribe(!subscribe)}>
            Notify me when video is ready
          </Checkbox>
        </FormControl>

        <Button onClick={() => submit()} disabled={!video?.name || !video?.start || !video?.end || !account.address}>
          Create
        </Button>
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
