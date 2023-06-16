import * as PushAPI from '@pushprotocol/restapi'
import { Signer, Wallet } from 'ethers'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { Notification } from 'types'

const DEFAULT_ENV = ENV.PROD
const DEFAULT_NETWORK = '1' // 1: mainnet // 5: goerli
const CHANNEL_ADDRESS = '0x0DEFE95102FeE830aEC32A3e0927b9367Ac67043'
const CHANNEL_CAIP = `eip155:${DEFAULT_NETWORK}:${CHANNEL_ADDRESS}`
const ADDRESS_CAIP = `eip155:${DEFAULT_NETWORK}:`

export async function Subscribe(address: string, signer: Signer) {
  return await PushAPI.channels.subscribe({
    signer: signer as any,
    channelAddress: CHANNEL_CAIP, // channel address in CAIP
    userAddress: `${ADDRESS_CAIP}${address}`, // user address in CAIP
    onSuccess: () => {
      console.log('opt in success')
    },
    onError: () => {
      console.error('opt in error')
    },
    env: DEFAULT_ENV,
  })
}

export async function GetNotifications(address: string) {
  const notifications = await PushAPI.user.getFeeds({
    user: `${ADDRESS_CAIP}${address}`, // user address in CAIP
    env: DEFAULT_ENV,
  })

  return notifications
    .filter((i: any) => !!i.title && !!i.message)
    .map((i: any) => {
      return {
        id: i.sid,
        type: 'info',
        title: i.title,
        message: i.message,
        link: i.cta,
      } as Notification
    })
}

export async function SendCreatorNotification(title: string, description: string, recipient?: string) {
  if (process.env.DEPLOYER_KEY === undefined) {
    console.error('DEPLOYER_KEY not set')
  }

  const signer = new Wallet(process.env.DEPLOYER_KEY ?? '')
  const result = await PushAPI.payloads.sendNotification({
    signer: signer,
    type: recipient ? 3 : 1, // target or broadcast
    identityType: 2, // direct payload
    notification: {
      title: title,
      body: description,
    },
    payload: {
      title: title,
      body: description,
      cta: 'https://archivooor.vercel.app/',
      img: '',
    },
    recipients: recipient ? `${ADDRESS_CAIP}${recipient}` : '', // recipient address
    channel: CHANNEL_CAIP, // your channel address
    env: DEFAULT_ENV,
  })

  return result?.status === 200 || result?.status === 204
}
