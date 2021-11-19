import { useEffect, useState } from 'react'
import * as models from '../../models'
import { NavigationItem, Task, TaskCreateAttributes } from '../../types'
import NoteView from '../NoteView'
import AddTaskBar from './AddTaskBar'
import ConfirmNavDeleteWidget from './ConfirmNavDeleteWidget'
import TaskListItem from './TaskListItem'
import CompletedTasks from './CompletedTasks'
import { autoReorderTasks, taskSorter } from './helpers'
import { prepareTasksToUpdate } from './helpers/prepareTasksToUpdate'

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
  const sortedTasks = taskSorter(tasks, 'orderInFolder', 'ASC')
  const activeTask =
    sortedTasks.find((task) => task.id === activeTaskId) || null

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
    const tasksToUpdate = prepareTasksToUpdate(dbTasks, taskId, beforeTaskId)
    await models.Task.bulkPut(tasksToUpdate)
    await refreshTasks()
  }

  const moveTask = async (taskId: string, direction: 'UP' | 'DOWN') => {
    const currentTaskIndex = sortedTasks.findIndex((task) => task.id === taskId)
    if (direction === 'UP' && currentTaskIndex !== 0) {
      await reorderTask(taskId, sortedTasks[currentTaskIndex - 1].id)
    }
    if (direction === 'DOWN' && currentTaskIndex !== sortedTasks.length - 1) {
      const isTaskMovingToLast = currentTaskIndex + 1 === sortedTasks.length - 1
      if (isTaskMovingToLast) {
        await reorderTask(taskId, null)
      } else {
        await reorderTask(taskId, sortedTasks[currentTaskIndex + 2].id)
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

  const completedTasks = sortedTasks.filter((task) => task.actualEndDate)
  const uncompletedTasks = sortedTasks.filter((task) => !task.actualEndDate)
  const sortedCompletedTasks = taskSorter(
    completedTasks,
    'actualEndDate',
    'DSC'
  )

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
    if (sortedTasks.length !== totalTasks) {
      setTotalTasks(sortedTasks.length)
    }
  }, [sortedTasks, totalTasks])

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
    if (sortedCompletedTasks.length === 0) {
      setShowCompleted(false)
    }
  }, [sortedCompletedTasks])

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
              completedTasks={sortedCompletedTasks}
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
