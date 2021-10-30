import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export type Task = {
  id: string
  name: string
  content: Descendant[]
  priority: number
  plannedStartDate: number | null
  plannedEndDate: number | null
  actualStartDate: number | null
  actualEndDate: number | null
  createdAt: number
  modifiedAt: number
}

export type Tag = {
  id: string
  name: string
  createdAt: number
  modifiedAt: number
}

export type Filter = {
  id: string
  name: string
  stringMatch: string
  tags: string[]
  order: number
  createdAt: number
  modifiedAt: number
}

export type TaskVersion = {
  taskId: string
} & Task

export type TagTask = {
  id: string
  tagId: string
  taskId: string
  order: number
  createdAt: number
  modifiedAt: number
}

export type PrecedingTask = {
  id: string
  taskId: string
  precedingTaskId: string
}

export type Settings = {
  locale: string | null
}

export type NavigationItem = {
  id: string
  name: string
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  current: boolean
}

export type TaskCreateAttributes = Omit<Task, 'id' | 'createdAt' | 'modifiedAt'>

export type CustomElement = { type: string; children: CustomText[] }
export type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
