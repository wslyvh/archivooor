import { Web3Storage, getFilesFromPath } from 'web3.storage'
import dotenv from 'dotenv'
import { existsSync } from 'fs'

dotenv.config()

if (!process.env.WEB3_STORAGE_API_KEY) {
  console.error('process.env.WEB3_STORAGE_API_KEY is not defined')
}

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY ?? '' })

export async function Store(name: string, filePath: string) {
  console.log('Storing on web3.storage..')

  if (existsSync(filePath)) {
    const files = await getFilesFromPath(filePath)
    const inputFile = files[0]
    const cid = await client.put([inputFile], {
      name: name,
    })
    console.log('Done! CID:', cid)
  }
}

export async function Pin(name: string, hash: string) {
  console.log('Pinning to IPFS Pinning Service..')

  const response = await fetch(`https://api.web3.storage/pins`, {
    method: 'POST',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${process.env.WEB3_STORAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cid: hash,
      name: name,
    }),
  })
  const body = await response.json()
  console.log('Pinned!', body)
}

export async function List() {
  console.log('Listing files..')

  for await (const item of client.list({ maxResults: 10 })) {
    console.log(item.cid, item.name, item.created)
  }
}
