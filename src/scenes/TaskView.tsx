import { useEffect, useState } from 'react'
import { NavigationItem, Task, TaskCreateAttributes } from '../types'
import AddTaskBar from './AddTaskBar'
import TaskList from './TaskList.'
import * as db from '../models'
import NoteView from './NoteView'
import * as models from '../models'
import { CheckIcon, TrashIcon, XIcon } from '@heroicons/react/solid'

const ReservedNavIds = { INBOX: 'INBOX', HOME: 'HOME', COMPLETED: 'COMPLETED' }

const taskFilterer = (tasks: Task[], { navId }: { navId: string }): Task[] => {
  if (navId === ReservedNavIds.INBOX) {
    return tasks
  }
  if (navId === ReservedNavIds.HOME) {
    return tasks.filter((task) => {
      return !task.actualEndDate
    })
  }
  if (navId === ReservedNavIds.COMPLETED) {
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

type TrashState = 'INACTIVE' | 'ACTIVE' | 'CONFIRM'

type Props = {
  navigator: NavigationItem
  selectedNavId: string
  onClickDeleteFolder(id: string): Promise<void>
}
export default function TaskView({
  navigator,
  selectedNavId,
  onClickDeleteFolder,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [trashState, setTrashState] = useState<TrashState>('INACTIVE')
  const [totalFilteredTasks, setTotalFilteredTasks] = useState(0)
  const filteredTasks = taskFilterer(tasks, { navId: selectedNavId })
  taskSorter(filteredTasks)

  const refreshTasks = async () => {
    const dbTasks = await db.Task.find()
    setTasks(dbTasks)
  }

  useEffect(() => {
    setActiveTask(null)
  }, [selectedNavId])

  useEffect(() => {
    const runAsync = async () => {
      await refreshTasks()
    }
    runAsync()
  }, [])

  useEffect(() => {
    if (filteredTasks.length !== totalFilteredTasks) {
      setTotalFilteredTasks(filteredTasks.length)
    }
  }, [filteredTasks, totalFilteredTasks])

  useEffect(() => {
    if (totalFilteredTasks > 0) {
      setTrashState('INACTIVE')
    } else {
      setTrashState('ACTIVE')
    }
  }, [totalFilteredTasks])

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
    name,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
  }) => {
    await db.Task.update({ id, actualEndDate, name })
    await refreshTasks()
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
  }

  const ConfirmNavDeleteWidget = () => {
    return (
      <div>
        {trashState === 'ACTIVE' && (
          <button
            onClick={() => setTrashState('CONFIRM')}
            className="bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
          >
            <TrashIcon className="h-full w-full" />
          </button>
        )}
        {trashState === 'CONFIRM' && (
          <div className="flex justify-center items-center">
            <div className="text-sm">Confirm?</div>
            <button
              onClick={() => {
                setTrashState('ACTIVE')
              }}
              className="ml-1 bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
            >
              <XIcon className="h-full w-full" />
            </button>
            <button
              onClick={() => {
                setTrashState('ACTIVE')
                onClickDeleteFolder(selectedNavId)
              }}
              className="ml-1 bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
            >
              <CheckIcon className="h-full w-full" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-row">
      <div className="pl-64 flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigator.name}
            </h1>
            {!(ReservedNavIds as any)[navigator.id] && (
              <ConfirmNavDeleteWidget />
            )}
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
