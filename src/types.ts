export type Task = {
  id: string
  content: string
  start_date?: number
  due_date?: number
  completed_at?: number
  created_at: number
  modified_at: number
}

export type Tag = {
  id: string
  name: string
  created_at: number
  modified_at: number
}

export type Filter = {
  id: string
  name: string
  string_match: string
  tags: string[]
  created_at: number
  modified_at: number
}

export type TaskVersion = {
  task_id: string
} & Task

export type TagTask = {
  id: string
  tag_id: string
  task_id: string
  order: number
  created_at: number
  modified_at: number
}

export type Settings = {
  locale?: string
}
