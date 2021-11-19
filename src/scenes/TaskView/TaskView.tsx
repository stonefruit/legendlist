import { useEffect, useState } from 'react'
import * as models from '../../models'
import { NavigationItem, Task, TaskCreateAttributes } from '../../types'
import NoteView from '../NoteView'
import AddTaskBar from './AddTaskBar'
import ConfirmNavDeleteWidget from './ConfirmNavDeleteWidget'
import TaskListItem from './TaskListItem'
import CompletedTasks from './CompletedTasks'
import { autoReorderTasks, taskSorter } from './helpers'

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
  const [trashState, setTrashState] = useState<TrashState>('INACTIVE')
  const [totalTasks, setTotalTasks] = useState(0)
  const [showCompleted, setShowCompleted] = useState(false)
  taskSorter(tasks, 'orderInFolder', 'ASC')
  const activeTask = tasks.find((task) => task.id === activeTaskId) || null

  // FUNCTIONS

  const refreshTasks = async () => {
    const dbTasks = await models.Task.find({ folderId: selectedNavId })
    const updatedTasks = await autoReorderTasks(dbTasks, selectedNavId)

    const wasActiveTaskRemoved =
      updatedTasks.findIndex((task) => task.id === activeTaskId) === -1
    if (wasActiveTaskRemoved) {
      setActiveTaskId(null)
    }
    setTasks(updatedTasks)
  }

  const addTask = async ({ name }: TaskCreateAttributes) => {
    const newTaskId = await models.Task.create({
      name,
      folderId: selectedNavId,
      orderInFolder: 0,
      content: [],
      priority: 0,
      actualEndDate: null,
      actualStartDate: null,
      plannedEndDate: null,
      plannedStartDate: null,
      filePaths: [],
    })
    await refreshTasks()
    setActiveTaskId(newTaskId)
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
    filePaths,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
    folderId?: string
    filePaths?: string[]
  }) => {
    // Bring task to top when it is moved to another folder
    const isMovingFolder = !!folderId
    const isSettingToUncompleted = actualEndDate === null
    const shouldBringTaskToTop = isMovingFolder || isSettingToUncompleted
    const orderInFolder = shouldBringTaskToTop ? -1 : undefined
    const taskMovedFromElsewhere = shouldBringTaskToTop || actualEndDate

    await models.Task.update({
      id,
      actualEndDate,
      name,
      folderId,
      orderInFolder,
      filePaths,
    })
    const updatedTask = await models.Task.get({ id })
    if (taskMovedFromElsewhere) {
      setActiveTaskId(null)
    } else if (updatedTask) {
      setActiveTaskId(updatedTask.id)
    }
    await refreshTasks()
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
  }

  const completedTasks = tasks.filter((task) => task.actualEndDate)
  const uncompletedTasks = tasks.filter((task) => !task.actualEndDate)
  taskSorter(completedTasks, 'actualEndDate', 'DSC')

  // EFFECTS

  useEffect(() => {
    // Reset state
    setActiveTaskId(null)
    setShowCompleted(false)
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
        setActiveTaskId(null)
        return
      }
      const updatedTask = await models.Task.get({ id: activeTaskId })
      if (!updatedTask) {
        setActiveTaskId(null)
        return
      }
      setActiveTaskId(updatedTask.id)
    }
    runAsync()
  }, [activeTaskId])

  useEffect(() => {
    if (completedTasks.length === 0) {
      setShowCompleted(false)
    }
  }, [completedTasks])

  useEffect(() => {
    if (!showCompleted) {
      setActiveTaskId(null)
    }
  }, [showCompleted])

  return (
    <div className="ml-64 flex flex-row bg-yellow-50 opacity-90">
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigator.name}
            </h1>
            {!(ReservedNavIds as any)[navigator.id] && (
              <ConfirmNavDeleteWidget
                trashState={trashState}
                setTrashState={setTrashState}
                onClickDeleteFolder={onClickDeleteFolder}
                selectedNavId={selectedNavId}
              />
            )}
          </div>
          <AddTaskBar addTask={addTask} />

          <div className="mx-auto">
            <div className="py-4">
              {uncompletedTasks.map((task) => {
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
            <CompletedTasks
              showCompleted={showCompleted}
              completedTasks={completedTasks}
              setShowCompleted={setShowCompleted}
              updateTask={updateTask}
              selectActiveTask={selectActiveTask}
              activeTaskId={activeTaskId}
              moveTask={moveTask}
            />
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
