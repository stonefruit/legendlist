import Dexie from 'dexie'

export class MyAppDatabase extends Dexie {
  contacts: Dexie.Table<IContact, number>
  emails: Dexie.Table<IEmailAddress, number>
  phones: Dexie.Table<IPhoneNumber, number>
  tasks: Dexie.Table<ITask, number>
  constructor() {
    super('MyAppDatabase')

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      contacts: '++id, first, last',
      emails: '++id, contactId, type, email',
      phones: '++id, contactId, type, phone',
      tasks: '++id,date,description,done',
    })

    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.contacts = this.table('contacts')
    this.emails = this.table('emails')
    this.phones = this.table('phones')
    this.tasks = this.table('tasks')
  }
}

// By defining the interface of table records,
// you get better type safety and code completion
export interface IContact {
  id?: number // Primary key. Optional (autoincremented)
  first: string // First name
  last: string // Last name
}

export interface IEmailAddress {
  id?: number
  contactId: number // "Foreign key" to an IContact
  type: string // Type of email such as "work", "home" etc...
  email: string // The email address
}

export interface IPhoneNumber {
  id?: number
  contactId: number
  type: string
  phone: string
}

export interface ITask {
  id?: number
  description: string
  date: number
  done: number
}
