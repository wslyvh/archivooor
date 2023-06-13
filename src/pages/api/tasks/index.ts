import { NextApiRequest, NextApiResponse } from 'next'
import base64 from 'base-64'
import { DataResponse, Video } from 'types'

if (!process.env.GITHUB_TOKEN) {
  throw new Error('process.env.GITHUB_TOKEN is not defined')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DataResponse<Video>>) {
  console.log(req.method, '/api/tasks', req.body)

  if (req.method === 'POST') {
    try {
      const data = JSON.parse(req.body) as Video
      await addToGithub(data)

      return res.json({ result: true, message: '', data })
    } catch (ex) {
      console.error(ex)
      return res.json({ result: false, message: 'Unable to add task to Github', data: undefined })
    }
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
// 724 / 729
async function addToGithub(data: Video) {
  const id = `${data.created}_${data.creator}`
  console.log('Adding to Github..', id)
  const response = await fetch(`https://api.github.com/repos/wslyvh/archivoooor/contents/tasks/${id}.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      message: '[ignore] add task',
      committer: {
        name: 'github_actions',
        email: 'github-actions[bot]@users.noreply.github.com',
      },
      content: base64.encode(JSON.stringify(data)),
    }),
  })

  const body = await response.json()
  console.log(body)
}
