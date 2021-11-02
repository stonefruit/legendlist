import db from './dexie-db'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskCreateAttributes } from '../types'
import { Descendant } from 'slate'

const create = async ({
  name,
  priority,
  content,
  actualEndDate,
  actualStartDate,
  plannedEndDate,
  plannedStartDate,
}: TaskCreateAttributes): Promise<string> => {
  const id = uuidv4()
  const now = Date.now()
  await db.Task.put({
    id: uuidv4(),
    name: name || id,
    priority,
    content,
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

const find = async (): Promise<Task[]> => {
  return await db.Task.orderBy('createdAt').toArray()
}

const update = async ({
  id,
  actualEndDate,
  content,
  name,
}: {
  id: string
  actualEndDate?: number | null
  content?: Descendant[]
  name?: string
}): Promise<boolean> => {
  try {
    const updateValues = {
      ...(actualEndDate === undefined ? {} : { actualEndDate }),
      ...(content === undefined ? {} : { content }),
      ...(name === undefined ? {} : { name }),
    }
    await db.Task.update(id, updateValues)
    return true
  } catch {
    return false
  }
}

const destroy = async ({ id }: { id: string }): Promise<void> => {
  return await db.Task.delete(id)
}

export { create, get, find, update, destroy }
