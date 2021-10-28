import Dexie from 'dexie'
import {
  Task,
  TaskVersion,
  TagTask,
  Tag,
  Filter,
  PrecedingTask,
} from '../types'

export class MyAppDatabase extends Dexie {
  Task: Dexie.Table<Task, string>
  TaskVersion: Dexie.Table<TaskVersion, string>
  TagTask: Dexie.Table<TagTask, string>
  Tag: Dexie.Table<Tag, string>
  Filter: Dexie.Table<Filter, string>
  PrecedingTask: Dexie.Table<PrecedingTask, string>

  constructor() {
    super('MyAppDatabase')
    this.version(1).stores({
      Task: '&id, name, content, priority, planned_start_date, planned_end_date, actual_start_date, actual_end_date, created_at, modified_at',
      TaskVersion:
        '&id, task_id, name, content, priority, planned_start_date, planned_end_date, actual_start_date, actual_end_date, created_at, modified_at',
      TagTask: '&id, tag_id, task_id, order, created_at, modified_at',
      Tag: '&id, name, created_at, modified_at',
      Filter: '&id, name, string_match, tags, order, created_at, modified_at',
      PrecedingTask: '&id, task_id, preceding_task_id',
    })

    this.Task = this.table('Task')
    this.TaskVersion = this.table('TaskVersion')
    this.TagTask = this.table('TagTask')
    this.Filter = this.table('Filter')
    this.Tag = this.table('Tag')
    this.PrecedingTask = this.table('PrecedingTask')
  }
}
