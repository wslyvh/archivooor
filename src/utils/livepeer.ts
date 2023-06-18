import { createClient, studioProvider } from '@livepeer/react'
import { createReadStream } from 'fs'
import { Asset, Video } from 'types'
import { Asset as LPAsset } from '@livepeer/react'
import { GetSlug } from './format'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.NEXT_PUBLIC_LIVEPEER_API_KEY) {
  console.error('process.env.NEXT_PUBLIC_LIVEPEER_API_KEY is not defined')
}

export const IGNORE_FILTER = ['ignore', 'test']
export const STREAM_DURATION = 3600

export async function uploadAsset(video: Video, path: string) {
  const { provider } = createClient({
    provider: studioProvider({
      apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY ?? '',
    }),
  })

  console.log('Uploading asset..')
  const stream = createReadStream(path)
  const asset = await provider.createAsset({
    sources: [
      {
        name: video.name,
        file: stream,
        storage: {
          ipfs: true,
          metadata: {
            ...video,
          },
        },
      },
    ],
  })

  return asset
}

// export async function getStreamAssets(): Promise<Asset[]> {
//   const res = await fetch('https://livepeer.studio/api/stream', {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
//     },
//   })

//   const streams = await res.json()
//   const filtered = streams
//     .filter((i: any) => !i.isActive && i.record && !i.suspended && i.sourceSegmentsDuration > 3600)
//     .map(async (i: any) => {
//       const res = await fetch(`https://livepeer.studio/api/asset/${i.sessionId}`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
//         },
//       })

//       const asset = await res.json()
//       if (asset.errors) {
//         console.error(asset.errors)
//         return []
//       }

//       return toAsset(asset)
//     })
//     .filter((i: any) => !!i)

//   return await Promise.all(filtered)
// }

export async function getAssets(manage?: boolean): Promise<Asset[]> {
  const res = await fetch(`https://livepeer.studio/api/asset/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
    },
  })

  const data = await res.json()
  if (data.errors) {
    console.error(data.errors)
    return []
  }

  const assets = await Promise.all(
    data
      .filter((i: LPAsset) => i.status?.phase === 'ready' && !IGNORE_FILTER.some((f) => i.name.toLowerCase().includes(f)))
      .map(async (i: LPAsset) => {
        const res = await fetch(`https://livepeer.studio/api/data/views/query/total/${i.playbackId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
          },
        })
        const data = await res.json()
        if (data.errors) {
          console.error(data.errors)
          return await toAsset(i)
        }

        return await toAsset(i, data?.viewCount, data?.playtimeMins)
      }) as Asset[]
  )

  if (manage) {
    return assets.filter((i) => i.duration > 3600).sort((a, b) => b.viewCount - a.viewCount)
  } else {
    return assets.filter((i) => i.duration < 3600).sort((a, b) => b.viewCount - a.viewCount)
  }
}

async function toAsset(asset: LPAsset, viewCount: number = 0, playtimeMins: number = 0) {
  let video: Asset = {
    id: asset.id,
    slug: GetSlug(asset.name),
    name: asset.name,
    createdAt: asset.createdAt ?? 0,
    duration: asset.videoSpec?.duration ?? 0,
    playbackId: asset.playbackId ?? '',
    playbackUrl: asset.playbackUrl ?? '',
    downloadUrl: asset.downloadUrl ?? '',
    cid: asset.storage?.ipfs?.cid ?? '',
    viewCount: viewCount,
    playtimeMins: playtimeMins,
  }

  if (asset.storage?.ipfs?.nftMetadata?.gatewayUrl) {
    console.log('Fetching Metadata', asset.id)
    const res = await fetch(asset.storage.ipfs.nftMetadata.gatewayUrl)
    const metadata = await res.json()

    if (metadata?.description) video.description = metadata.description
    if (metadata?.creator) video.creator = metadata.creator
    if (metadata?.start) video.start = metadata.start
    if (metadata?.end) video.end = metadata.end
    if (metadata?.videoUrl) video.videoUrl = metadata.videoUrl
  }

  return video
}
