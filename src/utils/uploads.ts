import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream } from 'fs'
import { Video } from 'types'

if (!process.env.NEXT_PUBLIC_LIVEPEER_API_KEY) {
  console.error('process.env.NEXT_PUBLIC_LIVEPEER_API_KEY is not defined')
}

export async function uploadAsset(video: Video) {
  const { provider } = createClient({
    provider: studioProvider({
      apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY ?? '',
    }),
  })

  console.log('Uploading asset..')
  const stream = createReadStream(video.videoUrl)
  const asset = await provider.createAsset({
    sources: [
      {
        name: video.name,
        file: stream,
        storage: {
          ipfs: true,
          metadata: {
            name: video.name,
            description: video.description,
          },
        },
      },
    ],
  })

  return asset
}
