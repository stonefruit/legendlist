import { MyAppDatabase } from './dexie-db'

var db = new MyAppDatabase()
db.version(1).stores({
  tasks: '++id,date,description,done',
})

async function test() {
  var id = await db.tasks.put({
    date: Date.now(),
    description: 'Test Dexie',
    done: 0,
  })
  console.log('Got id ' + id)
  // Now lets add a bunch of tasks
  await db.tasks.bulkPut([
    { date: Date.now(), description: 'Test Dexie bulkPut()', done: 1 },
    {
      date: Date.now(),
      description: 'Finish testing Dexie bulkPut()',
      done: 1,
    },
  ])
  // Ok, so let's query it

  var tasks = await db.tasks.where('done').above(0).toArray()
  console.log('Completed tasks: ' + JSON.stringify(tasks))

  // Ok, so let's complete the 'Test Dexie' task.
  await db.tasks
    .where('description')
    .startsWithIgnoreCase('test dexi')
    .modify({ done: 1 })

  console.log('All tasks should be completed now.')
  console.log("Now let's delete all old tasks:")

  // And let's remove all old tasks:
  await db.tasks.where('date').below(Date.now()).delete()

  console.log('Done.')
}

test().catch((err) => {
  console.error('Uh oh! ' + err.stack)
})
