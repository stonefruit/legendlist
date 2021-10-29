import { useEffect, useState } from 'react'
import { NavigationItem, Task, TaskCreateAttributes } from '../types'
import AddTaskBar from './AddTaskBar'
import TaskList from './TaskList.'
import * as db from '../models'

type Props = {
  navigation: NavigationItem[]
  navIndex: number
}
export default function TaskView({ navigation, navIndex }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    const runAsync = async () => {
      const dbTasks = await db.Task.find()
      setTasks(dbTasks)
    }
    runAsync()
  }, [])

  const addTask = async ({ name }: TaskCreateAttributes) => {
    await db.Task.create({
      name,
      content: '',
      priority: 0,
    })
    const dbTasks = await db.Task.find()
    setTasks(dbTasks)
  }

  return (
    <div className="pl-64 flex flex-col flex-1 h-screen">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {navigation[navIndex]?.name}
          </h1>
        </div>
        <AddTaskBar addTask={addTask} />
        <TaskList tasks={tasks} />
      </div>
    </div>
  )
}
