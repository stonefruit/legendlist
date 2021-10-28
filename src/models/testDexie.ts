import { MyAppDatabase } from './dexie-db'
import { v4 as uuidv4 } from 'uuid'

var db = new MyAppDatabase()
// db.version(1).stores({
//   tasks: '++id,date,description,done',
// })

// async function test() {
//   var id = await db.Task.put({
//     id: uuidv4(),
//     content: 'test',
//     created_at: Date.now(),
//     modified_at: Date.now(),
//   })
//   console.log('Got id ' + id)
//   // Now lets add a bunch of tasks
//   await db.Task.bulkPut([
//     {
//       id: uuidv4(),
//       content: 'test1',
//       created_at: Date.now(),
//       modified_at: Date.now(),
//     },
//     {
//       id: uuidv4(),
//       content: 'test2',
//       created_at: Date.now(),
//       modified_at: Date.now(),
//       completed_at: Date.now(),
//     },
//   ])
//   // Ok, so let's query it

//   var tasks = await db.Task.where('completed_at').below(Date.now()).toArray()
//   console.log('Completed tasks: ' + JSON.stringify(tasks))

//   // Ok, so let's complete the 'Test Dexie' task.
//   await db.Task.where('content')
//     .startsWithIgnoreCase('test2')
//     .modify({ done: 1 })

//   console.log('All tasks should be completed now.')
//   console.log("Now let's delete all old tasks:")

//   // And let's remove all old tasks:
//   await db.Task.where('created_at').below(Date.now()).delete()

//   console.log('Done.')
// }

// test().catch((err) => {
//   console.error('Uh oh! ' + err.stack)
// })
