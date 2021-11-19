import db from './dexie-db'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskCreateAttributes } from '../types'
import { Descendant } from 'slate'

const create = async ({
  folderId,
  orderInFolder,
  name,
  priority,
  content,
  filePaths,
  actualEndDate,
  actualStartDate,
  plannedEndDate,
  plannedStartDate,
}: TaskCreateAttributes): Promise<string> => {
  const id = uuidv4()
  const now = Date.now()
  await db.Task.put({
    id,
    folderId,
    orderInFolder,
    name: name || id,
    priority,
    content,
    filePaths,
    actualEndDate,
    actualStartDate,
    plannedEndDate,
    plannedStartDate,
    createdAt: now,
    modifiedAt: now,
  })
  return id
}

const get = async ({ id }: { id: string }): Promise<Task | undefined> => {
  return await db.Task.get(id)
}

const find = async ({ folderId }: Partial<Task>): Promise<Task[]> => {
  const whereValues = {
    ...(folderId === undefined ? {} : { folderId }),
  }
  return await db.Task.where(whereValues).toArray()
}

const update = async ({
  id,
  folderId,
  orderInFolder,
  actualEndDate,
  content,
  name,
  filePaths,
}: {
  id: string
  folderId?: string
  orderInFolder?: number
  actualEndDate?: number | null
  content?: Descendant[]
  name?: string
  filePaths?: string[]
}): Promise<boolean> => {
  try {
    const updateValues = {
      ...(folderId === undefined ? {} : { folderId }),
      ...(orderInFolder === undefined ? {} : { orderInFolder }),
      ...(actualEndDate === undefined ? {} : { actualEndDate }),
      ...(content === undefined ? {} : { content }),
      ...(name === undefined ? {} : { name }),
      ...(filePaths === undefined ? {} : { filePaths }),
    }
    await db.Task.update(id, updateValues)
    return true
  } catch {
    return false
  }
}

const bulkPut = async (tasks: Task[]) => {
  await db.Task.bulkPut(tasks)
}

const destroy = async ({ id }: { id: string }): Promise<void> => {
  return await db.Task.delete(id)
}

export { create, get, find, update, destroy, bulkPut }
