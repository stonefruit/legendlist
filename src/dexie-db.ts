import Dexie from 'dexie'
import { Task, TaskVersion, TagTask, Tag, Filter } from './types'

export class MyAppDatabase extends Dexie {
  Task: Dexie.Table<Task, string>
  TaskVersion: Dexie.Table<TaskVersion, string>
  TagTask: Dexie.Table<TagTask, string>
  Tag: Dexie.Table<Tag, string>
  Filter: Dexie.Table<Filter, string>

  constructor() {
    super('MyAppDatabase')
    this.version(1).stores({
      Task: '&id,content,start_date,due_date,completed_at,created_at,modified_at',
      TaskVersion:
        '&id,task_id,content,start_date,due_date,completed_at,created_at,modified_at',
      TagTask: '&id,tag_id,task_id,order,created_at,modified_at',
      Tag: '&id,name,created_at,modified_at',
      Filter: '&id,name,string_match,tags,order,created_at,modified_at',
    })

    this.Task = this.table('Task')
    this.TaskVersion = this.table('TaskVersion')
    this.TagTask = this.table('TagTask')
    this.Filter = this.table('Filter')
    this.Tag = this.table('Tag')
  }
}
