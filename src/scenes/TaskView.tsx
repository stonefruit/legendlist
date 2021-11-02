import { useEffect, useState } from 'react'
import { NavigationItem, Task, TaskCreateAttributes } from '../types'
import AddTaskBar from './AddTaskBar'
import NoteView from './NoteView'
import * as models from '../models'
import { CheckIcon, TrashIcon, XIcon } from '@heroicons/react/solid'
import { taskSorter } from '../utils'
import TaskListItem from './TaskListItem'

const ReservedNavIds = { INBOX: 'INBOX', HOME: 'HOME', COMPLETED: 'COMPLETED' }

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
  const [totalTasks, setTotalTasks] = useState(0)
  taskSorter(tasks)

  // FUNCTIONS

  const refreshTasks = async () => {
    const dbTasks = await models.Task.find({ folderId: selectedNavId })
    setTasks(dbTasks)
  }

  const addTask = async ({ name }: TaskCreateAttributes) => {
    await models.Task.create({
      name,
      folderId: selectedNavId,
      orderInFolder: 0,
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
    await models.Task.update({ id, actualEndDate, name })
    await refreshTasks()
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
  }

  // EFFECTS

  useEffect(() => {
    setActiveTask(null)
    setActiveTaskId(null)
    refreshTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNavId])

  useEffect(() => {
    const runAsync = async () => {
      await refreshTasks()
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tasks.length !== totalTasks) {
      setTotalTasks(tasks.length)
    }
  }, [tasks, totalTasks])

  useEffect(() => {
    if (totalTasks > 0) {
      setTrashState('INACTIVE')
    } else {
      setTrashState('ACTIVE')
    }
  }, [totalTasks])

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

  // SUBCOMPONENTS

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

          <div className="mx-auto">
            <div className="py-4">
              {tasks.map((task) => {
                return (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    updateTask={updateTask}
                    selectActiveTask={selectActiveTask}
                    activeTaskId={activeTaskId}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <NoteView task={activeTask} />
    </div>
  )
}
