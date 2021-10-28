import db from './dexie-db'
import { v4 as uuidv4 } from 'uuid'
import { Task } from '../types'

const create = async ({
  name,
  priority,
  content,
}: Omit<Task, 'id' | 'created_at' | 'modified_at'>): Promise<string> => {
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

export { create, get, find }
