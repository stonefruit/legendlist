import db from './dexie-db'
import { startOfDay, addDays } from 'date-fns'
import { Task } from '../types'
import { Descendant } from 'slate'

const create = async ({
  id,
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
  createdAt,
  modifiedAt,
}: Task): Promise<string> => {
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
    createdAt,
    modifiedAt,
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
  if (Object.keys(whereValues).length === 0) {
    return db.Task.toArray()
  }
  return db.Task.where(whereValues).toArray()
}

const findNext3Days = async () => {
  const startOfToday = +startOfDay(new Date())
  const startOf4thDay = +addDays(startOfToday, 3)
  const tasksPlannedInPast = await db.Task.where('plannedEndDate')
    .below(startOfToday)
    .toArray()
  const overdueTasks = tasksPlannedInPast.filter(
    (task) => task.actualEndDate === null
  )
  const next3DaysTasks = await db.Task.where('plannedEndDate')
    .between(startOfToday, startOf4thDay, true, false)
    .toArray()
  return [...overdueTasks, ...next3DaysTasks]
}

const update = async ({
  id,
  folderId,
  orderInFolder,
  actualEndDate,
  content,
  name,
  filePaths,
  plannedStartDate,
  plannedEndDate,
}: {
  id: string
  folderId?: string
  orderInFolder?: number
  actualEndDate?: number | null
  content?: Descendant[]
  name?: string
  filePaths?: string[] | null
  plannedStartDate?: number | null
  plannedEndDate?: number | null
}): Promise<boolean> => {
  try {
    const updateValues = {
      ...(folderId === undefined ? {} : { folderId }),
      ...(orderInFolder === undefined ? {} : { orderInFolder }),
      ...(actualEndDate === undefined ? {} : { actualEndDate }),
      ...(content === undefined ? {} : { content }),
      ...(name === undefined ? {} : { name }),
      ...(filePaths === undefined ? {} : { filePaths }),
      ...(plannedStartDate === undefined ? {} : { plannedStartDate }),
      ...(plannedEndDate === undefined ? {} : { plannedEndDate }),
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

export { create, get, find, update, destroy, bulkPut, findNext3Days }
