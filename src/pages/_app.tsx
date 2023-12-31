import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo, VideoSeo } from 'components/layout/Seo'
import { LivepeerProvider } from 'providers/Livepeer'
import ErrorBoundary from 'components/layout/Error'
import Head from 'next/head'
import { Asset } from 'types'

export default function App({ Component, pageProps }: AppProps) {
  const video: Asset = pageProps.video
  const isMounted = useIsMounted()

  return (
    <>
      <ErrorBoundary>
        {video && <VideoSeo video={video} />}
        {!video && <Seo />}
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <ChakraProvider>
          <Web3Provider>
            {isMounted && (
              <LivepeerProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </LivepeerProvider>
            )}
          </Web3Provider>
        </ChakraProvider>
      </ErrorBoundary>
    </>
  )
}
