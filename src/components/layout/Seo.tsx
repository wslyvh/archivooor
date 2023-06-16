import React from 'react'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_TWITTER } from 'utils/config'
import { NextSeo, VideoJsonLd } from 'next-seo'
import { Asset } from 'types'
import dayjs from 'dayjs'

interface Props {
  video: Asset
}

export function Seo() {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL

  return (
    <>
      <NextSeo
        title={SITE_NAME}
        defaultTitle={SITE_NAME}
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

export function VideoSeo(props: Props) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL

  const title = `${props.video.name} | ${SITE_NAME}`
  const desc = props.video.description ?? SITE_DESCRIPTION
  return (
    <>
      <NextSeo
        title={title}
        description={desc}
        twitter={{
          cardType: 'player',
          handle: `@${SOCIAL_TWITTER}`,
          site: `@${SOCIAL_TWITTER}`,
        }}
        additionalMetaTags={[
          {
            property: 'twitter:player',
            content: props.video.playbackUrl,
          },
          {
            property: 'twitter:title',
            content: title,
          },
          {
            property: 'twitter:description',
            content: desc,
          },
          {
            property: 'twitter:player:height',
            content: '1920',
          },
          {
            property: 'twitter:player:width',
            content: '1080',
          },
        ]}
        openGraph={{
          siteName: SITE_NAME,
          title: title,
          description: desc,
          url: props.video.playbackUrl,
          type: 'video.movie',
          video: {
            duration: props.video.duration,
            releaseDate: dayjs(props.video.createdAt).toISOString(),
          },
          defaultImageWidth: 1200,
          defaultImageHeight: 630,
          images: [
            {
              url: `${origin}/og.png`,
              alt: `${SITE_NAME} Open Graph Image`,
            },
          ],
        }}
      />
      <VideoJsonLd
        name={title}
        description={desc}
        contentUrl={props.video.playbackUrl}
        embedUrl={props.video.playbackUrl}
        uploadDate={dayjs(props.video.createdAt).toISOString()}
        duration={dayjs.duration(props.video.duration).toISOString()}
        watchCount={props.video.viewCount}
      />
    </>
  )
}
