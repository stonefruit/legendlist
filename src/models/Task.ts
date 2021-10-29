import db from './dexie-db'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskCreateAttributes } from '../types'

const create = async ({
  name,
  priority,
  content,
}: TaskCreateAttributes): Promise<string> => {
  const id = uuidv4()
  const createdAt = Date.now()
  await db.Task.put({
    id: uuidv4(),
    name: name || id,
    priority,
    content,
    createdAt,
    modifiedAt: createdAt,
  })
  return id
}

const get = async ({ id }: Task): Promise<Task | undefined> => {
  return await db.Task.get(id)
}

const find = async (): Promise<Task[]> => {
  return await db.Task.orderBy('createdAt').toArray()
}

const update = async ({
  id,
  actualEndDate,
}: {
  id: string
  actualEndDate: number
}): Promise<boolean> => {
  try {
    await db.Task.update(id, { actualEndDate })
    return true
  } catch {
    return false
  }
}

export { create, get, find, update }
