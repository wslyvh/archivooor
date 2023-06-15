import * as PushAPI from '@pushprotocol/restapi'
import { Signer } from 'ethers'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'

const NETWORK = '5' // 1: mainnet // 5: goerli
const CHANNEL_ADDRESS = '0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab'
const CHANNEL_CAIP = `eip155:${NETWORK}:${CHANNEL_ADDRESS}`
const ADDRESS_CAIP = `eip155:${NETWORK}:`
const DEFAULT_ENV = ENV.STAGING

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

export async function GetNotifications() {
  return await PushAPI.user.getFeeds({
    user: CHANNEL_CAIP, // user address in CAIP
    env: DEFAULT_ENV,
  })
}

// export async function SendCreatorNotification() {
//   const apiResponse = await PushAPI.payloads.sendNotification({
//     signer: _signer,
//     type: 3, // target
//     identityType: 2, // direct payload
//     notification: {
//       title: `[SDK-TEST] notification TITLE:`,
//       body: `[sdk-test] notification BODY`,
//     },
//     payload: {
//       title: `[sdk-test] payload title`,
//       body: `sample msg body`,
//       cta: '',
//       img: '',
//     },
//     recipients: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // recipient address
//     channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
//     env: 'staging',
//   })
// }

// export async function SendChannelNotification() {
//   const apiResponse = await PushAPI.payloads.sendNotification({
//     signer: _signer,
//     type: 1, // broadcast
//     identityType: 2, // direct payload
//     notification: {
//       title: `[SDK-TEST] notification TITLE:`,
//       body: `[sdk-test] notification BODY`,
//     },
//     payload: {
//       title: `[sdk-test] payload title`,
//       body: `sample msg body`,
//       cta: '',
//       img: '',
//     },
//     channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // your channel address
//     env: 'staging',
//   })
// }
