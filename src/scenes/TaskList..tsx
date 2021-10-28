import { useEffect, useState } from 'react'
import * as db from '../models'
import { Task } from '../types'

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const runAsync = async () => {
      const dbTasks = await db.Task.find()
      setTasks(dbTasks)
    }
    runAsync()
  }, [])

  const onClickAddRandomTask = async () => {
    await db.Task.create({
      name: Math.random().toString(),
      content: '',
      priority: 0,
    })
    const dbTasks = await db.Task.find()
    setTasks(dbTasks)
  }
  return (
    <div className="py-4">
      <div
        onClick={onClickAddRandomTask}
        className="cursor-pointer hover:text-red-500 p-10 border-2 text-center"
      >
        Add Random Task
      </div>
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
        {tasks.map((task) => {
          return <div>{task.id}</div>
        })}
      </div>
    </div>
  )
}

export default TaskList
