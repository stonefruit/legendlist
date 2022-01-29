import { Folder } from '../types'
import db from './dexie-db'

const create = async (folder: Folder): Promise<string> => {
  await db.Folder.put(folder)
  return folder.id
}

const get = async ({ id }: { id: string }): Promise<Folder | undefined> => {
  return await db.Folder.get(id)
}

const find = async (): Promise<Folder[]> => {
  return await db.Folder.orderBy('createdAt').toArray()
}

const update = async ({
  id,
  name,
}: {
  id: string
  name?: string
}): Promise<boolean> => {
  try {
    const updateValues = {
      ...(name === undefined ? {} : { name }),
    }
    await db.Folder.update(id, updateValues)
    return true
  } catch {
    return false
  }
}

const destroy = async ({ id }: { id: string }): Promise<void> => {
  return await db.Folder.delete(id)
}

export { create, get, find, update, destroy }
