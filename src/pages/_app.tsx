import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'
import { LivepeerProvider } from 'providers/Livepeer'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <>
      <Seo />
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
    </>
  )
}
