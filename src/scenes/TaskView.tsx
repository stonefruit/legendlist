import { useEffect, useState } from 'react'
import { NavigationItem, Task, TaskCreateAttributes } from '../types'
import AddTaskBar from './AddTaskBar'
import TaskList from './TaskList.'
import * as db from '../models'
import NoteView from './NoteView'
import * as models from '../models'

const taskFilterer = (tasks: Task[], { navId }: { navId: string }): Task[] => {
  if (navId === 'HOME') {
    return tasks.filter((task) => {
      return !task.actualEndDate
    })
  }
  if (navId === 'COMPLETED') {
    return tasks.filter((task) => {
      return task.actualEndDate
    })
  }
  return []
}

const taskSorter = (tasks: Task[]): Task[] => {
  const sorter = (taskA: Task, taskB: Task) => {
    if (taskA.createdAt < taskB.createdAt) {
      return 1
    } else if (taskA.createdAt > taskB.createdAt) {
      return -1
    } else {
      return 0
    }
  }
  return tasks.sort(sorter)
}

type Props = {
  navigation: NavigationItem[]
  navIndex: number
}
export default function TaskView({ navigation, navIndex }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const filteredTasks = taskFilterer(tasks, { navId: navigation[navIndex].id })
  taskSorter(tasks)

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

  useEffect(() => {
    const runAsync = async () => {
      if (activeTaskId === null) {
        setActiveTask(null)
        return
      }
      const updatedTask = await models.Task.get({ id: activeTaskId })
      if (!updatedTask) {
        setActiveTask(null)
        return
      }
      setActiveTask(updatedTask)
    }
    runAsync()
  }, [activeTaskId])

  const addTask = async ({ name }: TaskCreateAttributes) => {
    await db.Task.create({
      name,
      content: [],
      priority: 0,
      actualEndDate: null,
      actualStartDate: null,
      plannedEndDate: null,
      plannedStartDate: null,
    })
    await refreshTasks()
  }

  const updateTask = async ({
    id,
    actualEndDate,
  }: {
    id: string
    actualEndDate: number
  }) => {
    await db.Task.update({ id, actualEndDate })
    await refreshTasks()
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
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
          <TaskList
            tasks={filteredTasks}
            updateTask={updateTask}
            selectActiveTask={selectActiveTask}
            activeTaskId={activeTaskId}
          />
        </div>
      </div>
      <NoteView task={activeTask} />
    </div>
  )
}
