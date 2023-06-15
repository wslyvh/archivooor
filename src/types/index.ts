export interface State<T> {
  loading: boolean
  data?: T
  error?: string
}

export interface DataResponse<T> {
  result: boolean
  message: string
  data: T | undefined
}

export interface Video {
  name: string
  description: string
  start: number
  end: number
  videoUrl: string
  creator?: string
  created?: number
}

export interface Asset {
  id: string
  name: string
  description?: string
  createdAt: number
  duration: number
  playbackId: string
  playbackUrl: string
  downloadUrl: string
  cid: string
}

export interface Message {
  type: '' | 'info' | 'warning' | 'success' | 'error'
  message: string
}
