import React from 'react'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_TWITTER } from 'utils/config'
import { NextSeo } from 'next-seo'

export function Seo() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL

  return (
    <>
      <NextSeo
        title={SITE_NAME}
        defaultTitle={SITE_NAME}
        titleTemplate={`%s | ${SITE_NAME}`}
        description={SITE_DESCRIPTION}
        openGraph={{
          type: 'website',
          siteName: SITE_NAME,
          url: origin,
          images: [
            {
              url: `${origin}/og.png`,
              alt: `${SITE_NAME} Open Graph Image`,
            },
          ],
          defaultImageWidth: 1200,
          defaultImageHeight: 630,
        }}
        twitter={{
          handle: `@${SOCIAL_TWITTER}`,
          site: `@${SOCIAL_TWITTER}`,
          cardType: 'summary_large_image',
        }}
      />
    </>
  )
}
