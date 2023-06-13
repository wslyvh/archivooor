import { join } from 'path'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { uploadAsset } from 'utils/uploads'
import { Video } from 'types'
import dotenv from 'dotenv'
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
  const path = join(process.cwd(), 'tmp', task.created + '.mp4')
  const result = execSync(`ffmpeg -i ${task.videoUrl} -ss ${task.start} -to ${task.end} -c:v libx264 -c:a copy ${path}`)

  if (result && existsSync(path)) {
    const upload = await uploadAsset({
      ...task,
      videoUrl: path,
    } as Video)
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
