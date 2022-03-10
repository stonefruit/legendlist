import { Folder } from '../types'
import db from './dexie-db'

const create = async (folder: Folder): Promise<string> => {
  await db.Folder.put(folder)
  return folder.id
}

const get = async ({ id }: { id: string }): Promise<Folder | undefined> => {
  return await db.Folder.get(id)
}

const find = async ({
  isArchived,
}: {
  isArchived?: boolean
}): Promise<Folder[]> => {
  const folders = await db.Folder.orderBy('createdAt').toArray()

  if (typeof isArchived === 'boolean') {
    if (isArchived) {
      return folders.filter((folder) => folder.archivedAt)
    }
    return folders.filter((folder) => !folder.archivedAt)
  }
  return folders
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

const archive = async ({
  id,
  archivedAt,
}: {
  id: string
  archivedAt?: number | null
}): Promise<void> => {
  await db.Folder.update(id, { archivedAt })
}

export { create, get, find, update, archive }
