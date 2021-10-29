import { useEffect, useState } from 'react'
import { NavigationItem, Task, TaskCreateAttributes } from '../types'
import AddTaskBar from './AddTaskBar'
import TaskList from './TaskList.'
import * as db from '../models'
import NoteView from './NoteView'

type Props = {
  navigation: NavigationItem[]
  navIndex: number
}
export default function TaskView({ navigation, navIndex }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])

  const filteredTasks = tasks.filter((task) => {
    return !task.actual_end_date
  })

  const refreshTasks = async () => {
    const dbTasks = await db.Task.find()
    setTasks(dbTasks)
  }

  useEffect(() => {
    const runAsync = async () => {
      await refreshTasks()
    }
    runAsync()
  }, [])

  const addTask = async ({ name }: TaskCreateAttributes) => {
    await db.Task.create({
      name,
      content: '',
      priority: 0,
    })
    await refreshTasks()
  }

  const updateTask = async ({
    id,
    actual_end_date,
  }: {
    id: string
    actual_end_date: number
  }) => {
    await db.Task.update({ id, actual_end_date })
    await refreshTasks()
  }

  return (
    <div className="flex flex-row">
      <div className="pl-64 flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation[navIndex]?.name}
            </h1>
          </div>
          <AddTaskBar addTask={addTask} />
          <TaskList tasks={filteredTasks} updateTask={updateTask} />
        </div>
      </div>
      <NoteView />
    </div>
  )
}
