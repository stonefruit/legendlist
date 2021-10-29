export type Task = {
  id: string
  name: string
  content: string
  priority: number
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
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
  order: number
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

export type PrecedingTask = {
  id: string
  task_id: string
  preceding_task_id: string
}

export type Settings = {
  locale?: string
}

export type NavigationItem = {
  name: string
  href: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  current: boolean
}
