import db from './dexie-db'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskCreateAttributes } from '../types'

const create = async ({
  name,
  priority,
  content,
}: TaskCreateAttributes): Promise<string> => {
  const id = uuidv4()
  const created_at = Date.now()
  await db.Task.put({
    id: uuidv4(),
    name: name || id,
    priority,
    content,
    created_at,
    modified_at: created_at,
  })
  return id
}

const get = async ({ id }: Task): Promise<Task | undefined> => {
  return await db.Task.get(id)
}

const find = async (): Promise<Task[]> => {
  return await db.Task.orderBy('created_at').toArray()
}

const update = async ({
  id,
  actual_end_date,
}: {
  id: string
  actual_end_date: number
}): Promise<boolean> => {
  try {
    await db.Task.update(id, { actual_end_date })
    return true
  } catch {
    return false
  }
}

export { create, get, find, update }
