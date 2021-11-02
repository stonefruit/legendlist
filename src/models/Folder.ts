import { v4 as uuidv4 } from 'uuid'
import { Folder, FolderCreateAttributes } from '../types'
import db from './dexie-db'

const create = async ({ name }: FolderCreateAttributes): Promise<string> => {
  const id = uuidv4()
  const now = Date.now()
  await db.Folder.put({
    id: uuidv4(),
    name,
    createdAt: now,
    modifiedAt: now,
  })
  return id
}

const get = async ({ id }: { id: string }): Promise<Folder | undefined> => {
  return await db.Folder.get(id)
}

const find = async (): Promise<Folder[]> => {
  return await db.Folder.orderBy('createdAt').toArray()
}

const destroy = async ({ id }: { id: string }): Promise<void> => {
  return await db.Folder.delete(id)
}

export { create, get, find, destroy }
