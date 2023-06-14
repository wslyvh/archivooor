import { Box, Flex } from '@chakra-ui/react'
import { VideoCard } from 'components/VideoCard'
import { Head } from 'components/layout/Head'
import { GetStaticProps } from 'next'
import { Asset } from 'types'
import { getAssets } from 'utils/livepeer'

interface Props {
  assets: Asset[]
}

export default function Index(props: Props) {
  return (
    <>
      <Head />

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
  }
}
