import * as PushAPI from '@pushprotocol/restapi'
import { Signer } from 'ethers'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'

const NETWORK = '5' // 1: mainnet // 5: goerli
const CHANNEL_ADDRESS = '0x0DEFE95102FeE830aEC32A3e0927b9367Ac67043'
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

export async function SendCreatorNotification(recipient: string, title: string, description: string, signer: Signer) {
  return await PushAPI.payloads.sendNotification({
    signer: signer,
    type: 3, // target
    identityType: 2, // direct payload
    notification: {
      title: title,
      body: description,
    },
    payload: {
      title: title,
      body: description,
      cta: '',
      img: '',
    },
    recipients: `${ADDRESS_CAIP}${recipient}`, // recipient address
    channel: CHANNEL_CAIP, // your channel address
    env: DEFAULT_ENV,
  })
}

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
