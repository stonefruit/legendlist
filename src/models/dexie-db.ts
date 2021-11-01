import Dexie from 'dexie'
import {
  Task,
  TaskVersion,
  TagTask,
  Tag,
  Filter,
  PrecedingTask,
  Folder,
  FolderTask,
} from '../types'
import seeder from './dexie-seeder'

export class DexieDatabase extends Dexie {
  Task: Dexie.Table<Task, string>
  TaskVersion: Dexie.Table<TaskVersion, string>
  TagTask: Dexie.Table<TagTask, string>
  Tag: Dexie.Table<Tag, string>
  Filter: Dexie.Table<Filter, string>
  PrecedingTask: Dexie.Table<PrecedingTask, string>
  Folder: Dexie.Table<Folder, string>
  FolderTask: Dexie.Table<FolderTask, string>

  constructor() {
    super('LegendListDatabase')
    this.version(1).stores({
      Task: '&id, name, content, priority, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, createdAt, modifiedAt',
      TaskVersion:
        '&id, taskId, name, content, priority, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, createdAt, modifiedAt',
      TagTask: '&id, tagId, taskId, order, createdAt, modifiedAt',
      Tag: '&id, name, createdAt, modifiedAt',
      Filter: '&id, name, stringMatch, tags, order, createdAt, modifiedAt',
      PrecedingTask: '&id, taskId, precedingTaskId, createdAt, modifiedAt',
      Folder: '&id, name, createdAt, modifiedAt',
      FolderTask: '&id, folderId, taskId, order, createdAt, modifiedAt',
    })

    this.Task = this.table('Task')
    this.TaskVersion = this.table('TaskVersion')
    this.TagTask = this.table('TagTask')
    this.Filter = this.table('Filter')
    this.Tag = this.table('Tag')
    this.PrecedingTask = this.table('PrecedingTask')
    this.Folder = this.table('Folder')
    this.FolderTask = this.table('FolderTask')
  }
}
const db = new DexieDatabase()

db.on('ready', () => seeder(db))

export default db
