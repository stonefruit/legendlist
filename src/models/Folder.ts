import { Folder } from '../types'
import db from './dexie-db'

const get = async ({ id }: { id: string }): Promise<Folder | undefined> => {
  return await db.Folder.get(id)
}

const find = async (): Promise<Folder[]> => {
  return await db.Folder.orderBy('createdAt').toArray()
}

export { get, find }
