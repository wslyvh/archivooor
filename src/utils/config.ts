import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli } from '@wagmi/chains'

export const SITE_NAME = 'Archivooor'
export const SITE_DESCRIPTION = 'Watch and capture your favorite moments and highlights of events'
export const SITE_URL = 'https://archivooor.vercel.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'teal'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'wslyvh'
export const SOCIAL_GITHUB = 'wslyvh/archivooor'

export const ETH_CHAINS = [mainnet, goerli]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
