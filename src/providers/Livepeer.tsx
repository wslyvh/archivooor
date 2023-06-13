import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

if (!process.env.NEXT_PUBLIC_LIVEPEER_API_KEY) {
  console.warn('You need to provide a NEXT_PUBLIC_LIVEPEER_API_KEY env variable')
}
const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY ?? '' }),
})

export function LivepeerProvider(props: Props) {
  return <LivepeerConfig client={client}>{props.children}</LivepeerConfig>
}
