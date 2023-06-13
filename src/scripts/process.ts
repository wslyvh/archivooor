import { join } from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { readFileSync, readdirSync } from 'fs'
import { uploadAsset } from 'utils/uploads'
import { Video } from 'types'
import dotenv from 'dotenv'

dotenv.config()

const start = async () => {
  console.log('Process videos..')

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
  const result = await new Promise((resolve, reject) => {
    console.log('Processing..')
    const path = join(process.cwd(), 'tmp', task.created + '.mp4')
    ffmpeg(task.videoUrl)
      .setStartTime(task.start)
      .setDuration(task.end - task.start)
      .output(path)
      .on('error', (err) => reject(err))
      .on('end', () => {
        const obj = {
          ...task,
          videoUrl: path,
        }
        resolve(obj)
      })
      .on('progress', (progress) => {
        console.log(`${progress.percent ? Math.round(progress.percent) : 0}%`)
      })
      .run()
  })

  if (result) {
    const upload = await uploadAsset(result as Video)
    console.log('Completed', upload)
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
