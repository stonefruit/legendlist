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
  navigation: NavigationItem[]
}
export default function TaskView({
  navigator,
  selectedNavId,
  onClickDeleteFolder,
  navigation,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [trashState, setTrashState] = useState<TrashState>('INACTIVE')
  const [totalTasks, setTotalTasks] = useState(0)
  taskSorter(tasks, 'orderInFolder', 'ASC')

  // FUNCTIONS

  const autoReorderTasks = async (_dbTasks: Task[]) => {
    const dbTasks = JSON.parse(JSON.stringify(_dbTasks)) as Task[]
    taskSorter(dbTasks, 'orderInFolder', 'ASC')

    let hasChange = false
    let prevOrder: null | number = null
    const desiredTasks: Task[] = []
    let tasksWithSameOrder: Task[] = []
    for (let i = 0; i < dbTasks.length; i += 1) {
      const currentTask = dbTasks[i]
      // Initial setup with first value
      if (prevOrder === null) {
        prevOrder = currentTask.orderInFolder
        tasksWithSameOrder.push(currentTask)
        continue
      }
      if (prevOrder !== currentTask.orderInFolder) {
        taskSorter(tasksWithSameOrder, 'createdAt', 'DSC')
        tasksWithSameOrder.forEach((task) => desiredTasks.push(task))
        tasksWithSameOrder = []
      }
      tasksWithSameOrder.push(currentTask)
      prevOrder = currentTask.orderInFolder
    }
    // Handle last group of tasks after loop ends
    tasksWithSameOrder.forEach((task) => desiredTasks.push(task))

    const orderedTasks = desiredTasks.map((task, index) => {
      if (!hasChange && dbTasks[index].orderInFolder !== index) {
        hasChange = true
      }
      task.orderInFolder = index
      return task
    })
    if (hasChange) {
      const tasksToUpdate = orderedTasks.map((task, index) => {
        task.orderInFolder = index
        return task
      })
      await models.Task.bulkPut(tasksToUpdate)
      return await models.Task.find({ folderId: selectedNavId })
    }
    return dbTasks
  }

  const refreshTasks = async () => {
    const dbTasks = await models.Task.find({ folderId: selectedNavId })
    const updatedTasks = await autoReorderTasks(dbTasks)

    const wasActiveTaskRemoved =
      updatedTasks.findIndex((task) => task.id === activeTaskId) === -1
    if (wasActiveTaskRemoved) {
      setActiveTask(null)
      setActiveTaskId(null)
    }
    setTasks(updatedTasks)
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

  const reorderTask = async (taskId: string, beforeTaskId: string | null) => {
    const dbTasks = await models.Task.find({ folderId: selectedNavId })
    taskSorter(dbTasks, 'orderInFolder', 'ASC')

    const currentTaskIndex = dbTasks.findIndex((task) => task.id === taskId)
    const beforeTaskIndex = dbTasks.findIndex(
      (task) => task.id === beforeTaskId
    )
    let newTaskIndex: number
    if (beforeTaskIndex > -1) {
      dbTasks.splice(beforeTaskIndex, 0, dbTasks[currentTaskIndex])
      newTaskIndex = beforeTaskIndex
    } else {
      dbTasks.splice(dbTasks.length, 0, dbTasks[currentTaskIndex])
      newTaskIndex = dbTasks.length
    }
    const taskToRemoveIndex = dbTasks.findIndex(
      (task, index) => task.id === taskId && newTaskIndex !== index
    )
    dbTasks.splice(taskToRemoveIndex, 1)

    const tasksToUpdate = dbTasks.map((task, index) => {
      task.orderInFolder = index
      return task
    })
    await models.Task.bulkPut(tasksToUpdate)
    await refreshTasks()
  }

  const moveTask = async (taskId: string, direction: 'UP' | 'DOWN') => {
    const currentTaskIndex = tasks.findIndex((task) => task.id === taskId)
    if (direction === 'UP' && currentTaskIndex !== 0) {
      await reorderTask(taskId, tasks[currentTaskIndex - 1].id)
    }
    if (direction === 'DOWN' && currentTaskIndex !== tasks.length - 1) {
      const isTaskMovingToLast = currentTaskIndex + 1 === tasks.length - 1
      if (isTaskMovingToLast) {
        await reorderTask(taskId, null)
      } else {
        await reorderTask(taskId, tasks[currentTaskIndex + 2].id)
      }
    }
  }

  const updateTask = async ({
    id,
    actualEndDate,
    name,
    folderId,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
    folderId?: string
  }) => {
    await models.Task.update({
      id,
      actualEndDate,
      name,
      folderId,
      // Bring task to top when it is moved to another folder
      orderInFolder: folderId ? -1 : undefined,
    })
    const updatedTask = await models.Task.get({ id })
    if (updatedTask) {
      setActiveTask(updatedTask)
    }
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
    <div className="ml-64 flex flex-row bg-yellow-50 opacity-90">
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
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
                  <div key={task.id}>
                    <TaskListItem
                      key={task.id}
                      task={task}
                      updateTask={updateTask}
                      selectActiveTask={selectActiveTask}
                      activeTaskId={activeTaskId}
                      moveTask={moveTask}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <NoteView
        task={activeTask}
        navigation={navigation}
        updateTask={updateTask}
      />
    </div>
  )
}
