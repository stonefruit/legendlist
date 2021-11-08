import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

// START - DB TYPES

export type Task = {
  id: string
  folderId: string
  orderInFolder: number
  name: string
  content: Descendant[]
  priority: number
  filePaths: string[] | null
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
  createdAt: number
  modifiedAt: number
}

export type Folder = {
  id: string
  name: string
  createdAt: number
  modifiedAt: number
}

// END - DB TYPES

export type Settings = {
  locale: string | null
}

export type NavigationItem = {
  id: string
  name: string
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}

export type TaskCreateAttributes = Omit<Task, 'id' | 'createdAt' | 'modifiedAt'>
export type FolderCreateAttributes = Omit<
  Folder,
  'id' | 'createdAt' | 'modifiedAt'
>

export type CustomElement = { type: string; children: CustomText[] }
export type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

export type SvgIconProps = {
  height?: number
  width?: number
  fill?: string
}
