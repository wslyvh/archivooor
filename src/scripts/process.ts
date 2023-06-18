import { join } from 'path'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { uploadAsset } from 'utils/livepeer'
import { Video } from 'types'
import dotenv from 'dotenv'
import ffmpegPath from 'ffmpeg-static'
import { SendCreatorNotification } from 'utils/push'
import { Redeploy } from 'utils/vercel'
import { SITE_URL } from 'utils/config'
import { GetSlug } from 'utils/format'
import { Store } from 'utils/storage'
const execSync = require('child_process').execSync

dotenv.config()

const start = async () => {
  console.log('Getting tasks to process..')
  const tasks = readdirSync(join(process.cwd(), 'tasks')).map((i) => {
    const file = readFileSync(join(process.cwd(), 'tasks', i), 'utf-8')
    return JSON.parse(file)
  })

  const task = tasks[tasks.length - 1]
  if (!task) {
    console.log('No tasks found..')
    return
  }

  console.log('Processing Task #', task)
  const path = join(process.cwd(), 'tmp', `${task.created}_${task.creator}.mp4`)

  // To fix Segmentation fault (core dumped), install nscd
  // `sudo apt install nscd`
  console.log('Exec', ffmpegPath)
  const result = execSync(`${ffmpegPath ?? 'ffmpeg'} -i ${task.videoUrl} -ss ${task.start} -to ${task.end} -c:v libx264 -c:a copy -y ${path}`)

  if (result && existsSync(path)) {
    console.log('Uploading..')
    const upload = await uploadAsset(task, path)
    console.log('Completed', upload)

    try {
      console.log('Redeploying Application..')
      await Redeploy()
    } catch (e) {
      console.error('Unable to redeploy', e)
    }

    try {
      console.log('Sending Push notification..')
      const url = `${SITE_URL}/video/${GetSlug(task.name)}`
      await SendCreatorNotification('New video', 'A new video is available on Archivooor. Watch it now!')
      await SendCreatorNotification('Video ready', 'Your video is ready on Archivooor!', task.creator, url)
    } catch (e) {
      console.error('Unable to send notifications', e)
    }

    try {
      console.log('Save to IPFS..')
      await Store(task.name, path)
    } catch (e) {
      console.error('Unable to save to IPFS', e)
    }
  }
}
start()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
