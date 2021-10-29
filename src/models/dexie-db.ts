import Dexie from 'dexie'
import {
  Task,
  TaskVersion,
  TagTask,
  Tag,
  Filter,
  PrecedingTask,
} from '../types'

export class DexieDatabase extends Dexie {
  Task: Dexie.Table<Task, string>
  TaskVersion: Dexie.Table<TaskVersion, string>
  TagTask: Dexie.Table<TagTask, string>
  Tag: Dexie.Table<Tag, string>
  Filter: Dexie.Table<Filter, string>
  PrecedingTask: Dexie.Table<PrecedingTask, string>

  constructor() {
    super('LegendListDatabase')
    this.version(1).stores({
      Task: '&id, name, content, priority, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, createdAt, modifiedAt',
      TaskVersion:
        '&id, taskId, name, content, priority, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, createdAt, modifiedAt',
      TagTask: '&id, tagId, taskId, order, createdAt, modifiedAt',
      Tag: '&id, name, createdAt, modifiedAt',
      Filter: '&id, name, stringMatch, tags, order, createdAt, modifiedAt',
      PrecedingTask: '&id, taskId, precedingTaskId',
    })

    this.Task = this.table('Task')
    this.TaskVersion = this.table('TaskVersion')
    this.TagTask = this.table('TagTask')
    this.Filter = this.table('Filter')
    this.Tag = this.table('Tag')
    this.PrecedingTask = this.table('PrecedingTask')
  }
}

export default new DexieDatabase()
